document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const favoriteBills = JSON.parse(localStorage.getItem('favoriteBills')) || [];

    if (favoriteBills.length > 0) {
        favoriteBills.forEach((bill, index) => {
            const billTable = document.createElement('table');
            billTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${bill.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>${item.total.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            const addBillButton = document.createElement('button');
            addBillButton.innerText = 'Apply this Bill';
            addBillButton.classList.add('apply-bill-button');
            addBillButton.addEventListener('click', () => {
                addBillToMainPage(bill);
            });

            // Create delete button
            const deleteBillButton = document.createElement('button');
            deleteBillButton.innerText = 'Delete this Bill';
            deleteBillButton.classList.add('delete-bill-button');
            deleteBillButton.addEventListener('click', () => {
                deleteBill(index);
            });

            const billContainer = document.createElement('div');
            billContainer.classList.add('bill-container');
            billContainer.appendChild(billTable);
            billContainer.appendChild(addBillButton);
            billContainer.appendChild(deleteBillButton); // Append delete button to the container
            favoritesContainer.appendChild(billContainer);
        });
    } else {
        favoritesContainer.innerText = 'No favorite bills saved.';
    }

    document.getElementById('back-to-main-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function addBillToMainPage(bill) {
        localStorage.setItem('selectedBill', JSON.stringify(bill));
        alert('Bill has been applied.');
    }

    // Function to delete a bill from localStorage
    function deleteBill(index) {
        favoriteBills.splice(index, 1); // Remove the bill from the array
        localStorage.setItem('favoriteBills', JSON.stringify(favoriteBills)); // Update localStorage
        location.reload(); // Reload the page to reflect changes
    }
});
