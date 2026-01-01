/**
 * CasperFlow Embeddable Widget
 * 
 * Usage:
 * <script src="https://casperflow.vercel.app/widget.js"></script>
 * <casperflow-button plan-id="plan_123" theme="dark"></casperflow-button>
 * 
 * Or via JavaScript:
 * CasperFlow.init({ planId: 'plan_123' });
 */

(function () {
    'use strict';

    const CASPERFLOW_API = 'https://casperflow.vercel.app';

    // Styles for the widget
    const styles = `
        .casperflow-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .casperflow-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .casperflow-button--dark {
            background: linear-gradient(135deg, #ff3e3e 0%, #8b5cf6 100%);
            color: white;
        }
        
        .casperflow-button--dark:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 62, 62, 0.3);
        }
        
        .casperflow-button--light {
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            color: white;
        }
        
        .casperflow-button--light:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }
        
        .casperflow-button--outline {
            background: transparent;
            border: 2px solid #ff3e3e;
            color: #ff3e3e;
        }
        
        .casperflow-button--outline:hover {
            background: #ff3e3e;
            color: white;
        }
        
        .casperflow-button__icon {
            width: 20px;
            height: 20px;
        }
        
        .casperflow-button__loader {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: casperflow-spin 0.8s linear infinite;
        }
        
        @keyframes casperflow-spin {
            to { transform: rotate(360deg); }
        }
        
        .casperflow-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .casperflow-modal--open {
            opacity: 1;
            visibility: visible;
        }
        
        .casperflow-modal__content {
            background: #12121a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .casperflow-modal--open .casperflow-modal__content {
            transform: translateY(0);
        }
        
        .casperflow-modal__close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 24px;
        }
        
        .casperflow-modal__title {
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px 0;
        }
        
        .casperflow-modal__subtitle {
            color: #888;
            font-size: 14px;
            margin: 0 0 24px 0;
        }
        
        .casperflow-modal__plan {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .casperflow-modal__plan-name {
            color: white;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px 0;
        }
        
        .casperflow-modal__plan-price {
            color: #ff3e3e;
            font-size: 32px;
            font-weight: 700;
        }
        
        .casperflow-modal__plan-period {
            color: #888;
            font-size: 14px;
        }
        
        .casperflow-modal__features {
            list-style: none;
            padding: 0;
            margin: 16px 0 0 0;
        }
        
        .casperflow-modal__feature {
            color: #888;
            font-size: 14px;
            padding: 4px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .casperflow-modal__feature::before {
            content: '✓';
            color: #10b981;
        }
        
        .casperflow-modal__trial {
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
            border: 1px solid rgba(251, 191, 36, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .casperflow-modal__trial-text {
            color: #fbbf24;
            font-size: 14px;
            font-weight: 500;
        }
        
        .casperflow-modal__actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .casperflow-modal__cta {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .casperflow-modal__cta--primary {
            background: linear-gradient(135deg, #ff3e3e 0%, #8b5cf6 100%);
            color: white;
        }
        
        .casperflow-modal__cta--primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 62, 62, 0.3);
        }
        
        .casperflow-modal__cta--secondary {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .casperflow-modal__cta--secondary:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .casperflow-powered {
            text-align: center;
            margin-top: 16px;
            font-size: 12px;
            color: #666;
        }
        
        .casperflow-powered a {
            color: #888;
            text-decoration: none;
        }
        
        .casperflow-powered a:hover {
            color: #ff3e3e;
        }
    `;

    // Inject styles
    function injectStyles() {
        if (document.getElementById('casperflow-styles')) return;
        const styleEl = document.createElement('style');
        styleEl.id = 'casperflow-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // Create the subscribe button
    function createButton(options) {
        const btn = document.createElement('button');
        btn.className = `casperflow-button casperflow-button--${options.theme || 'dark'}`;
        btn.innerHTML = `
            <svg class="casperflow-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            ${options.text || 'Subscribe with CSPR'}
        `;
        btn.onclick = () => openModal(options);
        return btn;
    }

    // Create and open modal
    function openModal(options) {
        // Remove existing modal if any
        const existing = document.getElementById('casperflow-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'casperflow-modal';
        modal.className = 'casperflow-modal casperflow-widget';

        const plan = options.plan || {};
        const features = plan.features || ['Access to all features', 'API access included', 'Email support'];

        modal.innerHTML = `
            <div class="casperflow-modal__content">
                <button class="casperflow-modal__close">&times;</button>
                <h2 class="casperflow-modal__title">Subscribe to ${plan.name || 'Plan'}</h2>
                <p class="casperflow-modal__subtitle">Powered by CasperFlow on Casper Blockchain</p>
                
                <div class="casperflow-modal__plan">
                    <h3 class="casperflow-modal__plan-name">${plan.name || 'Subscription Plan'}</h3>
                    <div>
                        <span class="casperflow-modal__plan-price">${plan.price || '??'}</span>
                        <span class="casperflow-modal__plan-period">CSPR / ${plan.period || 'month'}</span>
                    </div>
                    <ul class="casperflow-modal__features">
                        ${features.map(f => `<li class="casperflow-modal__feature">${f}</li>`).join('')}
                    </ul>
                </div>
                
                ${plan.trialDays ? `
                    <div class="casperflow-modal__trial">
                        <span class="casperflow-modal__trial-text">🎉 ${plan.trialDays}-day free trial available!</span>
                    </div>
                ` : ''}
                
                <div class="casperflow-modal__actions">
                    ${plan.trialDays ? `
                        <button class="casperflow-modal__cta casperflow-modal__cta--primary" data-action="trial">
                            Start ${plan.trialDays}-Day Free Trial
                        </button>
                        <button class="casperflow-modal__cta casperflow-modal__cta--secondary" data-action="subscribe">
                            Subscribe Now (${plan.price} CSPR)
                        </button>
                    ` : `
                        <button class="casperflow-modal__cta casperflow-modal__cta--primary" data-action="subscribe">
                            Subscribe with Casper Wallet
                        </button>
                    `}
                </div>
                
                <div class="casperflow-powered">
                    Secured by <a href="https://casperflow.vercel.app" target="_blank">CasperFlow</a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('casperflow-modal--open');
        });

        // Close handlers
        modal.querySelector('.casperflow-modal__close').onclick = () => closeModal();
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Action handlers
        modal.querySelectorAll('[data-action]').forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.action;
                if (action === 'subscribe' || action === 'trial') {
                    // Redirect to CasperFlow with plan ID
                    const url = `${CASPERFLOW_API}/app/user/browse?planId=${options.planId}&action=${action}`;
                    window.open(url, '_blank');
                    closeModal();
                }
            };
        });
    }

    function closeModal() {
        const modal = document.getElementById('casperflow-modal');
        if (modal) {
            modal.classList.remove('casperflow-modal--open');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Fetch plan details
    async function fetchPlan(planId) {
        try {
            const response = await fetch(`${CASPERFLOW_API}/api/plans/${planId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.error('CasperFlow: Failed to fetch plan', e);
        }
        return null;
    }

    // Initialize custom element
    class CasperFlowButton extends HTMLElement {
        connectedCallback() {
            injectStyles();

            const planId = this.getAttribute('plan-id');
            const theme = this.getAttribute('theme') || 'dark';
            const text = this.getAttribute('text');

            if (!planId) {
                console.error('CasperFlow: plan-id attribute is required');
                return;
            }

            // Fetch plan and create button
            fetchPlan(planId).then(plan => {
                const btn = createButton({
                    planId,
                    theme,
                    text,
                    plan: plan || { name: 'Subscription', price: '??', period: 'month' }
                });
                this.appendChild(btn);
            });
        }
    }

    // Register custom element
    if (!customElements.get('casperflow-button')) {
        customElements.define('casperflow-button', CasperFlowButton);
    }

    // Global API
    window.CasperFlow = {
        init: function (options) {
            injectStyles();
            fetchPlan(options.planId).then(plan => {
                const btn = createButton({
                    ...options,
                    plan: plan || options.plan
                });

                if (options.container) {
                    const container = typeof options.container === 'string'
                        ? document.querySelector(options.container)
                        : options.container;
                    if (container) container.appendChild(btn);
                }

                if (options.onReady) options.onReady(btn);
            });
        },

        openSubscribeModal: function (planId) {
            fetchPlan(planId).then(plan => {
                openModal({ planId, plan });
            });
        },

        version: '1.0.0'
    };

    console.log('CasperFlow Widget v1.0.0 loaded');
})();
