document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display the order summary
    const summaryTableContainer = document.getElementById('summary-table-container');
    const orderSummary = JSON.parse(sessionStorage.getItem('orderSummary')) || [];

    if (orderSummary.length > 0) {
        let totalAmount = 0;
        const summaryTable = document.createElement('table');
        summaryTable.innerHTML = `
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderSummary.map(item => {
                    totalAmount += item.total;
                    return `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>${item.total.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>Total Price:</strong></td>
                    <td><strong>${totalAmount.toFixed(2)} LKR</strong></td>
                </tr>
            </tfoot>
        `;
        summaryTableContainer.appendChild(summaryTable);
    } else {
        summaryTableContainer.innerText = 'No order summary available.';
    }

    // Show/hide card details based on payment method
    const paymentMethodSelect = document.getElementById('payment-method');
    const cardDetailsDiv = document.getElementById('card-details');

    paymentMethodSelect.addEventListener('change', () => {
        if (paymentMethodSelect.value === 'credit-debit') {
            cardDetailsDiv.classList.remove('hidden');
        } else {
            cardDetailsDiv.classList.add('hidden');
        }
    });

    // Format card number with spaces every 4 digits
    function formatCardNumber(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
        value = value.slice(0, 16); // Limit to 16 digits
        // Insert space every 4 digits
        value = value.match(/.{1,4}/g)?.join(' ') || '';
        input.value = value;
    }

    // Format expiry date to MM/YY with slash
    function formatExpiryDate(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4); // MM/YY format
        }
        input.value = value;
    }

    // Format CVV to 3 digits
    function formatCVV(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
        input.value = value.slice(0, 3); // Limit to 3 digits
    }

    // Validate the payment form
    function validateForm() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        const cardNumberPattern = /^\d{16}$/;
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvPattern = /^\d{3}$/;

        if (!cardNumberPattern.test(cardNumber)) {
            alert("Card number must be exactly 16 digits.");
            return false;
        }

        if (!expiryDatePattern.test(expiryDate)) {
            alert("Expiry date must be in MM/YY format.");
            return false;
        }

        if (!cvvPattern.test(cvv)) {
            alert("CVV must be exactly 3 digits.");
            return false;
        }

        return true;
    }

    // Attach event listeners for input formatting
    const cardNumberInput = document.getElementById('card-number');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    cardNumberInput.addEventListener('input', formatCardNumber);
    expiryDateInput.addEventListener('input', formatExpiryDate);
    cvvInput.addEventListener('input', formatCVV);

    // Handle form submission
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Calculate and store estimated delivery date
            const estimatedDate = new Date();
            estimatedDate.setDate(estimatedDate.getDate() + 7); // Estimate delivery in 7 days
            sessionStorage.setItem('estimatedDate', estimatedDate.toLocaleDateString());

            // Redirect to the success page
            window.location.href = 'order-success.html'; // Ensure this path is correct
        }
    });
});


//Order Success Page
//dilivery date

document.addEventListener('DOMContentLoaded', function() {
    // Calculate the delivery date (7 days from now)
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 7);

    // Format the delivery date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDeliveryDate = deliveryDate.toLocaleDateString(undefined, options);

    // Display the delivery date in the new paragraph
    const deliveryDateElement = document.getElementById('delivery-date');
    deliveryDateElement.textContent = `Estimated Delivery Date: ${formattedDeliveryDate}`;
});
