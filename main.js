
document.addEventListener('DOMContentLoaded', () => {
    const billTableBody = document.getElementById('bill-table-body');
    const totalAmount = document.getElementById('total-amount');
    const proceedButton = document.getElementById('proceed-button');

    const addToBillButtons = document.querySelectorAll('.add-to-bill-button');
    addToBillButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-product-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            addToBill(productName, productPrice);
        });
    });

    function addToBill(productName, productPrice, quantity = 1) {
        let existingRow = [...billTableBody.rows].find(row => row.cells[0].innerText === productName);
        if (existingRow) {
            const quantityCell = existingRow.cells[2];
            const newQuantity = parseInt(quantityCell.innerText) + quantity;
            quantityCell.innerText = newQuantity;
            updateTotal(existingRow, productPrice);
        } else {
            const newRow = billTableBody.insertRow();
            newRow.insertCell(0).innerText = productName;
            newRow.insertCell(1).innerText = productPrice.toFixed(2);
            newRow.insertCell(2).innerText = quantity;
            newRow.insertCell(3).innerText = (productPrice * quantity).toFixed(2);
            const actionCell = newRow.insertCell(4);
            actionCell.appendChild(createActionButtons());
        }
        updateTotalAmount();
    }

    function createActionButtons() {
        const container = document.createElement('div');
        container.className = 'action-button-container'; // Add this line to apply CSS styles
        const increaseButton = document.createElement('button');
        increaseButton.innerText = '+';
        const decreaseButton = document.createElement('button');
        decreaseButton.innerText = '-';
        const deleteButton = document.createElement('button'); // Adding a delete button
        deleteButton.innerText = 'X'; // Text for the delete button

        increaseButton.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const price = parseFloat(row.cells[1].innerText);
            const quantityCell = row.cells[2];
            quantityCell.innerText = parseInt(quantityCell.innerText) + 1;
            updateTotal(row, price);
            updateTotalAmount();
        });

        decreaseButton.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const price = parseFloat(row.cells[1].innerText);
            const quantityCell = row.cells[2];
            const newQuantity = parseInt(quantityCell.innerText) - 1;
            if (newQuantity <= 0) {
                row.remove();
            } else {
                quantityCell.innerText = newQuantity;
                updateTotal(row, price);
            }
            updateTotalAmount();
        });

        // Adding functionality to delete a row entirely
        deleteButton.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            row.remove();
            updateTotalAmount();
        });

        container.appendChild(increaseButton);
        container.appendChild(decreaseButton);
        container.appendChild(deleteButton); // Append the delete button to the container
        return container;
    }

    function updateTotal(row, price) {
        const quantity = parseInt(row.cells[2].innerText);
        row.cells[3].innerText = (price * quantity).toFixed(2);
    }

    function updateTotalAmount() {
        let total = 0;
        [...billTableBody.rows].forEach(row => {
            total += parseFloat(row.cells[3].innerText);
        });
        totalAmount.innerText = `Total: ${total.toFixed(2)} LKR`;
    }

    document.getElementById('save-to-favorites-button').addEventListener('click', saveToFavorites);
    document.getElementById('select-from-favorites-button').addEventListener('click', () => {
        window.location.href = 'favorites.html';
    });

    function saveToFavorites() {
        const billItems = [...billTableBody.rows].map(row => ({
            productName: row.cells[0].innerText,
            price: parseFloat(row.cells[1].innerText),
            quantity: parseInt(row.cells[2].innerText),
            total: parseFloat(row.cells[3].innerText)
        }));
        let favoriteBills = JSON.parse(localStorage.getItem('favoriteBills')) || [];
        favoriteBills.push(billItems);
        localStorage.setItem('favoriteBills', JSON.stringify(favoriteBills));
        alert('Bill saved to favorites!');
    }

    const selectedBill = JSON.parse(localStorage.getItem('selectedBill'));
    if (selectedBill) {
        selectedBill.forEach(item => {
            addToBill(item.productName, item.price, item.quantity);
        });
        localStorage.removeItem('selectedBill');
    }

    proceedButton.addEventListener('click', () => {
        const billItems = [...billTableBody.rows].map(row => ({
            productName: row.cells[0].innerText,
            price: parseFloat(row.cells[1].innerText),
            quantity: parseInt(row.cells[2].innerText),
            total: parseFloat(row.cells[3].innerText)
        }));
        sessionStorage.setItem('orderSummary', JSON.stringify(billItems));
        window.location.href = 'order-summary.html';
    });
});
