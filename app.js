import {Account} from './account.js';

const accountsList = [];

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

// Event Listeners
registerBtn.addEventListener('click', () => {
    registerContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
    
});

loginBtn.addEventListener('click', () => {
    if (accountsList.length === 0) {
        const newMessage = "No accounts found. Please register first.";
        showMessage(newMessage);        
        return;
    }
    loginContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
});

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

document.addEventListener('DOMContentLoaded', () => {
    loadAccountsList();
    console.log(accountsList);
    accountsList.forEach(account => {
        writeToAdminTable(account);
    });
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email-login');
    const password = formData.get('password-login');
});
