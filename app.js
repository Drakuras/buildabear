const promoInput = document.getElementById('promo-input');
const promoBtn = document.getElementById('promo-btn');
const promoMessage = document.getElementById('promo-message');
const totalAmountEl = document.getElementById('order-total-amount');
const promoLinesContainer = document.getElementById('promo-lines-container');

// State
let baseTotal = 88.00;
let activePromos = [];

function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function calculateTotal() {
    let total = baseTotal;
    promoLinesContainer.innerHTML = '';

    activePromos.forEach(promo => {
        let discount = 0;
        if (promo.type === 'fixed') {
            discount = promo.value;
        } else if (promo.type === 'percent') {
            discount = baseTotal * promo.value;
        }

        total -= discount;

        // Add line item
        const row = document.createElement('div');
        row.className = 'promo-row';
        row.innerHTML = `
            <span>Promo: ${promo.code}</span>
            <span>-${formatCurrency(discount)}</span>
        `;
        promoLinesContainer.appendChild(row);
    });

    total = Math.max(0, total); // don't go below zero
    totalAmountEl.textContent = formatCurrency(total);
}

promoBtn.addEventListener('click', () => {
    const codeEntered = promoInput.value.trim().toUpperCase();

    if (!codeEntered) {
        promoMessage.textContent = 'Please enter a code.';
        promoMessage.className = 'promo-msg msg-error';
        return;
    }

    const alreadyUsed = activePromos.some(p => p.code === codeEntered);
    if (alreadyUsed) {
        promoMessage.textContent = 'This code has already been redeemed.';
        promoMessage.className = 'promo-msg msg-error';
        return;
    }

    const promo = { type: 'percent', value: 0.80 };
    activePromos.push({ ...promo, code: codeEntered });

    promoMessage.textContent = `Discount code applied from: bear.ubenify.com`;
    promoMessage.className = 'promo-msg msg-success';
    promoInput.value = '';

    calculateTotal();
});

// Initialize total
calculateTotal();
