// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title CasperFlow Payment Bridge
 * @notice Accepts payments from Ethereum for CasperFlow subscriptions
 * @dev Payments are locked and bridged to Casper for settlement
 */
contract PaymentBridge is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    /// @notice USDC token address
    IERC20 public immutable usdc;

    /// @notice Chainlink ETH/USD price feed
    AggregatorV3Interface public priceFeed;

    /// @notice Authorized relayer address
    address public relayer;

    /// @notice Treasury address for collected fees
    address public treasury;

    /// @notice Protocol fee in basis points (e.g., 50 = 0.5%)
    uint256 public protocolFeeBps = 50;

    /// @notice Payment counter for unique IDs
    uint256 public paymentCounter;

    /// @notice Mapping of payment ID to payment details
    mapping(uint256 => Payment) public payments;

    /// @notice Mapping of Casper invoice ID to payment ID
    mapping(bytes32 => uint256) public invoiceToPayment;

    // ============ Structs ============

    struct Payment {
        uint256 id;
        address payer;
        bytes32 casperInvoiceId;
        address token;
        uint256 amount;
        uint256 amountInCspr;
        uint256 timestamp;
        PaymentStatus status;
    }

    enum PaymentStatus {
        Pending,
        Confirmed,
        Refunded,
        Failed
    }

    // ============ Events ============

    event PaymentReceived(
        uint256 indexed paymentId,
        address indexed payer,
        bytes32 indexed casperInvoiceId,
        address token,
        uint256 amount,
        uint256 amountInCspr
    );

    event PaymentConfirmed(
        uint256 indexed paymentId,
        bytes32 indexed casperInvoiceId
    );

    event PaymentRefunded(
        uint256 indexed paymentId,
        address indexed payer,
        uint256 amount
    );

    event RelayerUpdated(address indexed oldRelayer, address indexed newRelayer);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    // ============ Constructor ============

    constructor(
        address _usdc,
        address _priceFeed,
        address _relayer,
        address _treasury
    ) {
        usdc = IERC20(_usdc);
        priceFeed = AggregatorV3Interface(_priceFeed);
        relayer = _relayer;
        treasury = _treasury;
    }

    // ============ Payment Functions ============

    /**
     * @notice Pay for a CasperFlow invoice with ETH
     * @param casperInvoiceId The invoice ID on Casper blockchain
     * @param expectedCsprAmount Expected amount in CSPR (with 9 decimals)
     */
    function payWithEth(
        bytes32 casperInvoiceId,
        uint256 expectedCsprAmount
    ) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        require(invoiceToPayment[casperInvoiceId] == 0, "Invoice already paid");

        // Get ETH/USD price from Chainlink
        uint256 ethPrice = getEthPrice();
        
        // Calculate CSPR equivalent (assuming 1 CSPR = $0.02 for demo)
        // In production, use actual CSPR price oracle
        uint256 csprPrice = 2e16; // $0.02 with 18 decimals
        uint256 amountInCspr = (msg.value * ethPrice) / csprPrice;

        // Verify amount is close to expected (within 5% slippage)
        require(
            amountInCspr >= (expectedCsprAmount * 95) / 100,
            "Insufficient payment amount"
        );

        // Calculate and collect protocol fee
        uint256 fee = (msg.value * protocolFeeBps) / 10000;
        if (fee > 0) {
            payable(treasury).transfer(fee);
        }

        // Create payment record
        paymentCounter++;
        uint256 paymentId = paymentCounter;

        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            casperInvoiceId: casperInvoiceId,
            token: address(0), // ETH
            amount: msg.value - fee,
            amountInCspr: amountInCspr,
            timestamp: block.timestamp,
            status: PaymentStatus.Pending
        });

        invoiceToPayment[casperInvoiceId] = paymentId;

        emit PaymentReceived(
            paymentId,
            msg.sender,
            casperInvoiceId,
            address(0),
            msg.value,
            amountInCspr
        );
    }

    /**
     * @notice Pay for a CasperFlow invoice with USDC
     * @param casperInvoiceId The invoice ID on Casper blockchain
     * @param amount USDC amount (6 decimals)
     * @param expectedCsprAmount Expected amount in CSPR (9 decimals)
     */
    function payWithUsdc(
        bytes32 casperInvoiceId,
        uint256 amount,
        uint256 expectedCsprAmount
    ) external nonReentrant {
        require(amount > 0, "Must send USDC");
        require(invoiceToPayment[casperInvoiceId] == 0, "Invoice already paid");

        // Calculate CSPR equivalent (1 CSPR = $0.02)
        // USDC has 6 decimals, CSPR has 9 decimals
        uint256 amountInCspr = (amount * 1e9) / 2e4; // $0.02 per CSPR

        require(
            amountInCspr >= (expectedCsprAmount * 95) / 100,
            "Insufficient payment amount"
        );

        // Transfer USDC from user
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate and collect protocol fee
        uint256 fee = (amount * protocolFeeBps) / 10000;
        if (fee > 0) {
            usdc.safeTransfer(treasury, fee);
        }

        // Create payment record
        paymentCounter++;
        uint256 paymentId = paymentCounter;

        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            casperInvoiceId: casperInvoiceId,
            token: address(usdc),
            amount: amount - fee,
            amountInCspr: amountInCspr,
            timestamp: block.timestamp,
            status: PaymentStatus.Pending
        });

        invoiceToPayment[casperInvoiceId] = paymentId;

        emit PaymentReceived(
            paymentId,
            msg.sender,
            casperInvoiceId,
            address(usdc),
            amount,
            amountInCspr
        );
    }

    // ============ Relayer Functions ============

    /**
     * @notice Confirm that a payment was successfully processed on Casper
     * @param paymentId The payment ID to confirm
     */
    function confirmPayment(uint256 paymentId) external {
        require(msg.sender == relayer, "Only relayer");
        
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Pending, "Invalid status");

        payment.status = PaymentStatus.Confirmed;

        // Transfer funds to treasury (for bridging to Casper)
        if (payment.token == address(0)) {
            payable(treasury).transfer(payment.amount);
        } else {
            IERC20(payment.token).safeTransfer(treasury, payment.amount);
        }

        emit PaymentConfirmed(paymentId, payment.casperInvoiceId);
    }

    /**
     * @notice Refund a payment if Casper processing failed
     * @param paymentId The payment ID to refund
     */
    function refundPayment(uint256 paymentId) external {
        require(msg.sender == relayer || msg.sender == owner(), "Unauthorized");
        
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Pending, "Invalid status");
        require(
            block.timestamp > payment.timestamp + 1 hours,
            "Too early to refund"
        );

        payment.status = PaymentStatus.Refunded;

        if (payment.token == address(0)) {
            payable(payment.payer).transfer(payment.amount);
        } else {
            IERC20(payment.token).safeTransfer(payment.payer, payment.amount);
        }

        emit PaymentRefunded(paymentId, payment.payer, payment.amount);
    }

    // ============ View Functions ============

    /**
     * @notice Get current ETH/USD price from Chainlink
     */
    function getEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        // Chainlink returns 8 decimals, convert to 18
        return uint256(price) * 1e10;
    }

    /**
     * @notice Get payment details
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    // ============ Admin Functions ============

    function setRelayer(address _relayer) external onlyOwner {
        emit RelayerUpdated(relayer, _relayer);
        relayer = _relayer;
    }

    function setTreasury(address _treasury) external onlyOwner {
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setProtocolFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 500, "Fee too high"); // Max 5%
        protocolFeeBps = _feeBps;
    }

    function setPriceFeed(address _priceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Emergency withdraw
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            uint256 balance = IERC20(token).balanceOf(address(this));
            IERC20(token).safeTransfer(owner(), balance);
        }
    }
}
