// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Inbox {
    // The keyword `public` automatically generates a function that
    // allows you to access the current value of the state variable
    // from outside of the contract (see lines 22 - 28).
    string public message;

    // Note: Removing `public` visibility specifier. Visibility (public / external)
    // is not needed for constructors anymore: To prevent a contract from being
    // created, it can be marked abstract. This makes the visibility concept
    // for constructors obsolete.
    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    // Because we declared the `message` state variable above with
    // keyword `public`, the compiler automatically generates a getter
    // function for us equivalent to:
    //
    // function message() external view returns (string memory) { return message; }
    //
    // ...so we do **NOT** need to define a getter function ourselves.
}
