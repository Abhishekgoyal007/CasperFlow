// Contract Deployment Script for Casper Testnet
// Using CSPR.cloud API for better reliability

const fs = require('fs');
const path = require('path');
const https = require('https');
const { Keys, RuntimeArgs, DeployUtil } = require('casper-js-sdk');

// Configuration
const CHAIN_NAME = 'casper-test';
const WASM_PATH = path.join(__dirname, 'wasm', 'SubscriptionManager.wasm');
const SECRET_KEY_PATH = path.join(__dirname, 'secret_key.pem');

// Gas payment (in motes: 1 CSPR = 1,000,000,000 motes)
const PAYMENT_AMOUNT = '100000000000'; // 100 CSPR for deployment

// Official Casper testnet endpoint (from Discord support)
const NODES = [
    'https://node.testnet.casper.network/rpc',
];

async function tryFetch(url, options, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);


    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function deploy() {
    console.log('🚀 Deploying SubscriptionManager contract to Casper Testnet...');
    console.log('');

    // Load the secret key
    if (!fs.existsSync(SECRET_KEY_PATH)) {
        console.error('❌ Secret key not found! Please add secret_key.pem');
        process.exit(1);
    }

    let keys;
    try {
        keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(SECRET_KEY_PATH);
    } catch (e) {
        try {
            keys = Keys.Ed25519.loadKeyPairFromPrivateFile(SECRET_KEY_PATH);
        } catch (e2) {
            console.error('❌ Could not load key');
            process.exit(1);
        }
    }

    console.log('✅ Loaded secret key');
    console.log('   Public Key:', keys.publicKey.toHex());
    console.log('');

    // Load WASM
    if (!fs.existsSync(WASM_PATH)) {
        console.error('❌ WASM file not found!');
        process.exit(1);
    }

    const wasmData = new Uint8Array(fs.readFileSync(WASM_PATH));
    console.log('✅ Loaded WASM:', wasmData.length, 'bytes');
    console.log('');

    // Create the deploy
    const deployParams = new DeployUtil.DeployParams(
        keys.publicKey,
        CHAIN_NAME
    );

    const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
        wasmData,
        RuntimeArgs.fromMap({})
    );

    const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    const deployHash = Buffer.from(signedDeploy.hash).toString('hex');
    console.log('📤 Deploy prepared');
    console.log('   Deploy Hash:', deployHash);
    console.log('');

    // Try each node
    for (const nodeUrl of NODES) {
        console.log(`🔄 Trying: ${nodeUrl}`);

        try {
            const deployJson = DeployUtil.deployToJson(signedDeploy);

            const response = await tryFetch(nodeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'account_put_deploy',
                    params: { deploy: deployJson.deploy }
                })
            }, 15000);

            if (response.ok) {
                const result = await response.json();

                if (result.result?.deploy_hash) {
                    console.log('');
                    console.log('🎉 SUCCESS! Contract deployed!');
                    console.log('');
                    console.log('   Deploy Hash:', result.result.deploy_hash);
                    console.log('');
                    console.log('🔗 View on explorer:');
                    console.log(`   https://testnet.cspr.live/deploy/${result.result.deploy_hash}`);
                    console.log('');
                    console.log('⏳ Wait 2-3 minutes for confirmation');
                    return;
                } else if (result.error) {
                    console.log('   Error:', result.error.message);
                }
            }
        } catch (error) {
            console.log('   Failed:', error.message?.substring(0, 50) || 'Connection error');
        }
    }

    console.log('');
    console.log('❌ All nodes failed. The testnet RPC may be having issues.');
    console.log('');
    console.log('📋 Alternative: Deploy via CSPR.live');
    console.log('   1. Go to: https://testnet.cspr.live/deploy');
    console.log('   2. Upload: casperflow_contracts/wasm/Flipper.wasm');
    console.log('   3. Sign with Casper Wallet');
    console.log('');
}

deploy();
