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


// Event Listeners
registerBtn.addEventListener('click', () => {
    registerContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
    
});

loginBtn.addEventListener('click', () => {
    loginContainer.classList.remove('hidden');
    introContainer.classList.add('hidden');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const accountNo = Math.floor(Math.random() * 1000000000);    
    const formData = new FormData(registerForm);

    
    const newAccount = new Account(
        formData.get('title'),
        formData.get('firstName'),
        formData.get('lastName'),
        formData.get('email'),
        formData.get('password'),
        accountNo,
        0,
        []);
    accountsList.push(newAccount);
    saveAccountsList();
    alert(`Account created successfully! Your account number is ${accountNo}`);
    registerForm.reset();
    registerContainer.classList.add('hidden');
    introContainer.classList.remove('hidden');
});
