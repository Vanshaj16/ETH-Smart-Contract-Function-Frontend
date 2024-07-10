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
