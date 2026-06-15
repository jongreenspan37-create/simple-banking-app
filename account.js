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
        this.transactionHistory.push({ type: 'deposit', amount });
    }

    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            this.transactionHistory.push({ type: 'withdrawal', amount });
        } else {
            console.log("Insufficient funds");
        }
    }

    getBalance() {
        return this.balance;
    }

    getTransactionHistory() {
        return this.transactionHistory;
}
}