import {Account} from './account.js';

const accountsList = [];
let currentAccount = null;

const introContainer = document.getElementById('intro-container');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const registerContainer = document.getElementById('register-container');
const loginContainer = document.getElementById('login-container');
const accountContainer = document.getElementById('account-container');      
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const adminBody = document.getElementById('admin-body');
const messageContainer = document.getElementById('message-container');
const accountName =document.getElementById('account-name');
const accountBalance = document.getElementById('account-balance');
const accountNo = document.getElementById('account-no');
const transactionForm = document.getElementById('transaction-form');

// Functions
function saveAccountsList(){
    localStorage.setItem('bankAccounts', JSON.stringify(accountsList));
}

function loadAccountsList(){
    const storedAccounts = localStorage.getItem('bankAccounts');
    if (storedAccounts) {
        accountsList.push(...JSON.parse(storedAccounts));
    }
} 

function showMessage(message){
    messageContainer.textContent = message;
    messageContainer.classList.remove('hidden');
    setTimeout(() => {         
        messageContainer.classList.add('hidden');
    }, 3000);
}

function writeToAdminTable(account){
    
    
    const row = document.createElement('tr');

    const titleCell = document.createElement('td');
    titleCell.textContent = account.title;

    const firstNameCell = document.createElement('td');
    firstNameCell.textContent = account.firstName;

    const lastNameCell = document.createElement('td');
    lastNameCell.textContent = account.lastName;

    const emailCell = document.createElement('td');
    emailCell.textContent = account.email;

    const accountNoCell = document.createElement('td');
    accountNoCell.textContent = account.accountNo;

    const balanceCell = document.createElement('td');
    balanceCell.textContent = account.balance;

    row.append(titleCell, firstNameCell, lastNameCell, emailCell, accountNoCell, balanceCell);
    adminBody.append(row);
    console.log(adminBody);
    
}

function showAccountDetails(first,last,account,balance){

    accountName.textContent= "Name: "+ first +"" + last;
    accountNo.textContent= "Account No: " + account;
    accountBalance.textContent= "Balance: £" + balance;  

}

// Event Listeners

// Load accounts from localStorage and display them in the admin table
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('email.login').value='';
        document.getElementById('password-login').value='';
        loginForm.reset();
        registerForm.reset();
    } , 100);
    
    
    loadAccountsList();
    console.log(accountsList);
    accountsList.forEach(account => {
        writeToAdminTable(account);
    });
});

// Event listener for register button
registerBtn.addEventListener('click', () => {
    registerContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
    
});

// Event listener for login button
loginBtn.addEventListener('click', () => {
    if (accountsList.length === 0) {
        const newMessage = "No accounts found. Please register first.";
        showMessage(newMessage);        
        return;
    }
    loginContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
});

// Event listener for register form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const accountNo = Math.floor(Math.random() * 1000000000);   

    if (accountsList && accountsList.length > 0) {  
        const checkEmail = accountsList.some(account => account.email === formData.get('email'));
        if (checkEmail) {
            const newMessage = "Email already exists. Please use a different email.";
            showMessage(newMessage);            
                return;
            }
        }
    const newAccount = new Account(
        formData.get('title'),
        formData.get('first-name'),
        formData.get('last-name'),
        formData.get('email'),
        formData.get('password'),
        accountNo,
        0,
        []);
        console.log(formData.get('family-name'));
    accountsList.push(newAccount);
    saveAccountsList();
    const newMessage = `Account created successfully! ${newAccount.firstName} ${newAccount.lastName}, Account No: ${newAccount.accountNo}`;
    showMessage(newMessage);
    registerForm.reset();
    registerContainer.classList.add('hidden');
    introContainer.classList.remove('hidden');
    writeToAdminTable(newAccount);
    
});



// Event listener for login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email-login');
    const password = formData.get('password-login');

    const matchedEmail = accountsList.find(item => item.email === email)

    //Check validity of email and password
    if (!matchedEmail || matchedEmail.password !== password ) {
         showMessage("Incorrect Details");
         return;
    }
    
    //Set current account to matched email
    currentAccount = matchedEmail;
    
    loginForm.reset();
            
    //Hide login form and show account details
    loginContainer.classList.add('hidden');
    accountContainer.classList.remove('hidden');
            
    //Fill in account details

    showAccountDetails(matchedEmail.firstName, matchedEmail.lastName,matchedEmail.accountNo,matchedEmail.balance)
         
        
});

// Event listener for transaction form submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(transactionForm);
    const amount = parseFloat(formData.get('amount'));  
    
    if (isNaN(amount) || amount <= 0) {
        showMessage("Please enter a valid amount.");
        return;
    }
    
     // Identify which button was clicked using e.submitter
    const clickedButtonName = e.submitter.getAttribute('name');

    if (clickedButtonName === 'deposit-btn') {
        currentAccount.deposit(amount);
    } else if (clickedButtonName === 'withdraw-btn') {
        currentAccount.withdraw(amount);
    }



    accountBalance.textContent= getBalance();
    saveAccountsList();
    transactionForm.reset();

});




    