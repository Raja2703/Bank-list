'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


const displayMovements = function (movements) {
  containerMovements.innerHTML = ''
  movements.forEach(function (movement, i) {
    const transactionType = movement > 0 ? "deposit" : "withdrawal"

    const movementHtml = `
    <div class="movements__row">
    <div class="movements__type movements__type--${transactionType}">
      ${i + 1} ${transactionType}
    </div>
    <div class="movements__value">${movement}€</div>
  </div>
  `
    containerMovements.insertAdjacentHTML('afterbegin', movementHtml)

  })
}


// Balance
const calcDisplayBalance = (currentAccount) => {
  currentAccount.balance = currentAccount.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${currentAccount.balance} EUR`
}


// summary
const calcDisplaySummary = (movements,interestRate)=>{
  const incomes = movements.filter(mov => mov>0).reduce((acc,mov)=>acc+mov,0)
  labelSumIn.textContent=`${incomes}€`

  const out = Math.abs(movements.filter(mov => mov<0).reduce((acc,mov)=>acc+mov,0))
  labelSumOut.textContent=`${out}€`

  const interest= movements
  .filter(mov => mov>0)
  .map(deposit=> (deposit * interestRate)/100)
  .filter((mov)=>mov>1)
  .reduce((acc,mov)=>acc+mov,0)
  labelSumInterest.textContent=`${interest}$`
}


// username generation
(function createUserNames(accounts){
  accounts.forEach((acc) => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
})(accounts)


//handling login
let currentAccount

btnLogin.addEventListener("click",(e)=>{
  e.preventDefault()
  currentAccount=accounts.find(account => account.username === inputLoginUsername.value)
  console.log(currentAccount)

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log("logged in")
    //empty login inputs
    inputLoginUsername.value=''
    inputLoginPin.value=''

    //display welcome message
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner}`
    
    //Display UI
    containerApp.style.opacity=1;

    //show current user details
    showUserCreds(currentAccount)
  }else{
    containerApp.style.opacity=0;
    labelWelcome.textContent="Log in to get started"
  }
})

function showUserCreds(currentAccount){
  displayMovements(currentAccount.movements)
  calcDisplayBalance(currentAccount)
  calcDisplaySummary(currentAccount.movements,currentAccount.interestRate)
}

//transfer
let transferTo
btnTransfer.addEventListener("click",(e)=>{
  e.preventDefault();
  transferTo = accounts.find(account=> account.username === inputTransferTo.value)

  if(transferTo && transferTo.username!==currentAccount.username && Number(inputTransferAmount.value)>0 && currentAccount.balance-Number(inputTransferAmount.value)>=0){
    currentAccount.movements.push(-Number(inputTransferAmount.value))
    transferTo.movements.push(Number(inputTransferAmount.value))
    console.log(transferTo.movements)
    showUserCreds(currentAccount)
    inputTransferTo.value=""
    inputTransferAmount.value=""
  }
})