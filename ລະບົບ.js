// ໂຫຼດຂໍ້ມູນຂາກ localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let filterType = 'all';

// ບັນທືກລາຍການ
function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    if (!description || !amount) {
        alert('❌ ກະລຸນາເຕິມໃຫ້ຄົບ');
        return;
    }

    const transaction = {
        id: Date.now(),
        date: new Date().toLocaleDateString('lo-LO'),
        description,
        amount,
        category,
        type
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    clearForm();
    updateUI();
}

// ລົບລາຍການ
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
}

// ລ້າງຟອມ
function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = 'ອາຫານ';
    document.getElementById('type').value = 'expense';
}

// ເຕິມຂໍ້ມູນ
function filterTransactions(type) {
    filterType = type;
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    updateUI();
}

// ອັບເດດ UI
function updateUI() {
    // ຈັດການລາຍການ
    let filtered = transactions;
    if (filterType !== 'all') {
        filtered = transactions.filter(t => t.type === filterType);
    }

    // ຄຶດໄລ່ລວມ
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // ອັບເດດຈຳນວນເງຶນ
    document.getElementById('totalIncome').textContent = '₭' + totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = '₭' + totalExpense.toFixed(2);
    document.getElementById('balance').textContent = '₭' + balance.toFixed(2);

    // ສະແດງລາຍການ
    const tbody = document.getElementById('transactionBody');
    const emptyState = document.getElementById('emptyState');

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tbody.innerHTML = filtered
        .reverse()
        .map(t => `
            <tr>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td><span class="category-badge">${t.category}</span></td>
                <td>${t.type === 'income' ? '💵 ລາຍຮັບ' : '💸 ລາຍຈ່າຍ'}</td>
                <td class="${t.type === 'income' ? 'amount-income' : 'amount-expense'}">
                    ${t.type === 'income' ? '+' : '-'}฿${t.amount.toFixed(2)}
                </td>
                <td><button class="btn-delete" onclick="deleteTransaction(${t.id})">ລົບ</button></td>
            </tr>
        `)
        .join('');
}

// เรียกใช้เมื่อหน้าเว็บโหลดเสร็จ
updateUI();