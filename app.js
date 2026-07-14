import {Account} from './account.js';

const accountsList = [];
let currentAccount = null;

const navBar = document.getElementById('nav-bar');

const logOut = document.getElementById('logout-btn');
const introContainer = document.getElementById('intro-container');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const registerContainer = document.getElementById('register-container');
const loginContainer = document.getElementById('login-container');
const accountContainer = document.getElementById('account-container');   
const adminContainer = document.getElementById('admin-container')   
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const adminBody = document.getElementById('admin-body');
const messageContainer = document.getElementById('message-container');
const accountName =document.getElementById('account-name');
const accountBalance = document.getElementById('account-balance');
const accountNo = document.getElementById('account-no');
const transactionForm = document.getElementById('transaction-form');
const transactionTableBody = document.getElementById('transaction-body')
const allLinks = document.querySelectorAll('.js-nav-link');
const allSections = document.querySelectorAll('.js-page-section');



// Functions
function saveAccountsList(){
    localStorage.setItem('bankAccounts', JSON.stringify(accountsList));
}

function loadAccountsList(){
    const storedAccounts = localStorage.getItem('bankAccounts');
    if (storedAccounts) {
        const plainObjectsArray = JSON.parse(storedAccounts);
        
        // Clear the array to prevent duplicating entries on reload
        accountsList.length = 0; 
        
        // Rebuild each account as javascript object
        plainObjectsArray.forEach(acc => {
            const instantiatedAccount = new Account(
                acc.title,
                acc.firstName,
                acc.lastName,
                acc.email,
                acc.password,
                acc.accountNo,
                acc.balance,
                acc.transactionHistory
            );
            accountsList.push(instantiatedAccount);
        });
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
    titleCell.classList = "hidden md:table-cell text-left p-2"

    const firstNameCell = document.createElement('td');
    firstNameCell.textContent = account.firstName;
    firstNameCell.classList = "hidden md:table-cell text-left p-2"

    const lastNameCell = document.createElement('td');
    lastNameCell.textContent = account.lastName;
    lastNameCell.classList = "hidden md:table-cell text-left p-2"

    const emailCell = document.createElement('td');
    emailCell.textContent = account.email;
    emailCell.classList = "text-left p-2"

    const accountNoCell = document.createElement('td');
    accountNoCell.textContent = account.accountNo;
    accountNoCell.classList = "text-left p-2"

    

    row.append(titleCell, firstNameCell, lastNameCell, emailCell, accountNoCell);
    adminBody.append(row);
    
    
}

function writeToTranactionTable(transaction){

    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = transaction.date;
    dateCell.classList = "text-left p-2"

    const typeCell = document.createElement('td');
    typeCell.textContent = transaction.type;
    typeCell.classList = "text-left p-2"

    const amountCell = document.createElement('td');
    amountCell.textContent = transaction.amount;
    amountCell.classList = "text-left p-2"

    row.append(dateCell, typeCell, amountCell);
    transactionTableBody.append(row);
}

async function hashPassword(plainTextPassword) {
  const data = new TextEncoder().encode(plainTextPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


//----------------
// Event Listeners
//----------------

// Load accounts from localStorage and display them in the admin table
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('email-login').value='';
        document.getElementById('password-login').value='';
        loginForm?.reset();
        registerForm?.reset();
    } , 100);
    
    
    loadAccountsList();
    accountsList.forEach(account => {
       
        writeToAdminTable(account);
    });
});

//Nav bar event listners

allLinks.forEach(link =>{
    link.addEventListener('click',(e)=>{
        e.preventDefault();

        allSections.forEach(section => section.classList.add('hidden'));
    
        const targetId =link.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);

        targetSection?.classList.remove('hidden');
        targetSection?.scrollIntoView({behavior : 'smooth'});

        navBar.classList.remove('active');
        
    })
})

//Event listner for hamburger menu

const hamBurger = document.getElementById('hamburger');
const closeHamburger = document.getElementById('close-hamburger')


hamBurger.addEventListener('click', ()=>{
    
    navBar.classList.add('active')

});

closeHamburger.addEventListener('click', ()=>{
    navBar.classList.remove('active')
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
registerForm.addEventListener('submit', async (e) => {
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

    const plainTextPassword =formData.get('password');
    const hashedPassword = await hashPassword(plainTextPassword);;



    const newAccount = new Account(
        formData.get('title'),
        formData.get('first-name'),
        formData.get('last-name'),
        formData.get('email'),
        hashedPassword,
        accountNo,
        0,
        []);
        
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
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email-login');
    const plainPassword = formData.get('password-login');

    const matchedEmail = accountsList.find(item => item.email === email)

    //Check validity of email and password
    if (!matchedEmail) {
         showMessage("Incorrect Details");
         return;
    }
    
    const hashedPassword = await hashPassword(plainPassword)
   
    const savedPassword = accountsList.find(item => item.password === hashedPassword ) 

    if(!savedPassword){
        showMessage("Incorrect Details");
         return;

    }
    
    
    //Set current account to matched email
    currentAccount = matchedEmail;
    
    loginForm.reset();
            
    //Hide login form and show account details
    loginContainer.classList.add('hidden');
    accountContainer.classList.remove('hidden');
    //Also Hide menu and show logout
    navBar.classList.add('!hidden');
    hamBurger.classList.add('hidden'); // fixes bug where mobile still had menu
    logOut.classList.remove('hidden');
    

            
    //Fill in account details
    accountName.textContent = `Name: ${currentAccount.firstName} ${currentAccount.lastName}`;
    accountNo.textContent = `Account No: ${currentAccount.accountNo}`;
    accountBalance.textContent = `Balance: £${currentAccount.getBalance().toFixed(2)}`;

    //Fill in the past transactions
    if(transactionTableBody) transactionTableBody.innerHTML='';
    currentAccount.transactionHistory.forEach(transaction =>{

            writeToTranactionTable(transaction);
        

    })
        
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
        
        const success=currentAccount.withdraw(amount);

        if (!success){
             showMessage("There are insufficient funds for this transaction");
             
            }

    }

    accountBalance.textContent = `Balance: £${currentAccount.getBalance().toFixed(2)}`;

    saveAccountsList();
    if(transactionTableBody) transactionTableBody.innerHTML='';

    currentAccount.transactionHistory.forEach(transaction =>{

            writeToTranactionTable(transaction);
    
        })

    transactionForm.reset();

});

//event listner for logout
logOut.addEventListener('click', ()=>{

    //Cleasr temp array
    currentAccount= null;
    
    //delete header info
    if (accountName) accountName.textContent = 'Name: ';
    if (accountNo) accountNo.textContent = 'Account No: ';
    if (accountBalance) accountBalance.textContent = 'Balance: £0.00';
    
    // delete the table info
    const transactionBody = document.getElementById('transaction-body');
    if (transactionBody) transactionBody.innerHTML = '';
    
    // Hide the account sectiom and show the home view
    allSections.forEach(section => section.classList.add('hidden')); 
    introContainer?.classList.remove('hidden');   
    
    //show menu
    navBar.classList.remove('!hidden');
    hamBurger.classList.remove('hidden')
    logOut.classList.add('hidden');
    
    
    showMessage("Logged out successfully.");

});
