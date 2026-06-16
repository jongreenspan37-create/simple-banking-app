export class Account {
    constructor(title, firstName, lastName, email, password, accountNo, balance, transactionHistory) {
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.accountNo = accountNo;
        this.balance = balance;
        this.transactionHistory = transactionHistory || [];
    }

    deposit(amount) {
        this.balance += amount;
        this.transactionHistory.push({ date: new Date().toLocaleDateString('en-GB'), type: 'Deposit', amount });
    }

    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            this.transactionHistory.push({ date: new Date().toLocaleDateString('en-GB'), type: 'Withdrawal', amount });
        } else {
            return false;
        }
    }

    getBalance() {
        return this.balance;
    }

    getTransactionHistory() {
        return this.transactionHistory;
}
}