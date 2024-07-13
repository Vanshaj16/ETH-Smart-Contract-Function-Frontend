# Project: Function Frontend

## Description
This project is a simple Ethereum DApp allows users to deposit and withdraw funds, as well as add interest and deduct service charges. The project consists of a solidity smart contract, deployment scripts using Hardhat and a React frontend for interacting with the contract.

## Tech Stack
#### 1. Solidity: Smart contract language used to define the contract logic.
#### 2. Hardhat: Develpoment environment for deploying and testing Ethereum smart contracts.
#### 3. React.js: Frontend library used to build the user interface.
#### 4. Ethers.js: Library for interacting with the Ethereum blockchain.
#### 5. MetaMask: Browder extension for manging Ethereum accounts and signing transactions.

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) and npm installed.
- [MetaMask](https://metamask.io/) extension installed in your browser.
## Smart Contract
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract MyProject {
    address payable public owner;
    uint public balance;

    event InterestAdded(uint interestAmount);
    event Deposit(uint amount);
    event ServiceChargeDeducted(uint serviceChargeAmount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }
    
     // Fallback function is executed when the contract is called with data that does not match any function
    fallback() external payable {
        balance += msg.value;
        emit Deposit(msg.value);
    }

    // Receive function is executed when the contract is called without any data
    receive() external payable {
        balance += msg.value;
        emit Deposit(msg.value);
    }
    
    function addInterest(uint interestRate) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        // Calculate interest based on the interest rate
        uint256 interestAmount = (balance * interestRate) / 100; // Interest rate is in basis points

        // Add interest to the balance
        balance += interestAmount;

         // assert transaction completed successfully
        assert(balance == _previousBalance + interestAmount);

        // Emit the event
        emit InterestAdded(interestAmount);
    }

    function deposit(uint _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

     // custom error
    error InsufficientBalance(uint balance, uint256 withdrawAmount);

    function deductServiceCharge(uint serviceCharge) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        // Make sure there are sufficient funds for the service charge
        if (balance < serviceCharge) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: serviceCharge
            });
        }

        // Deduct service charge from the balance
        balance -= serviceCharge;
        
        // assert the balance is correct
        assert(balance == (_previousBalance - serviceCharge));
        // Emit the event
        emit ServiceChargeDeducted(serviceCharge);
    }

    function getBalance() public view returns(uint) {
        return balance;
    }
}


```


## Starter Next/Hardhat Project

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Connect to MetaMask
1. Install MetaMask: If you haven't already, install the MetaMask extension for your browser from MetaMask.

2. Connect to MetaMask: When you open the application, MetaMask will prompt you to connect your account. Follow the instructions to connect.

3. Switch Network: Ensure MetaMask is connected to the correct network (e.g., localhost network if you're running a local Ethereum node).
## Authors

Vanshaj

vanshajsen16@gmail.com
