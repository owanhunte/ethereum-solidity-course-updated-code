# Up-to-date Inbox Smart Contract, Node.js Scripts & Unit Tests

> Section 1 of the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) by [Stephen Grider](https://www.udemy.com/user/sgslo/) implements an Inbox smart contract, along with a Node.js compile script, deploy script and unit tests for that contract. In this repo I provide up-to-date equivalents (along with detailed explanations) for each of these, for the benefit of students who have enrolled in Stephen's course.

## Contents

- [Inbox smart contract](#inbox-smart-contract)
- [Compile Script](#compile-script)
- [Deploy Script](#deploy-script)
- [Unit Tests](#unit-tests)

<p align="center"><hr /></p>

## Inbox Smart Contract

An up-to-date equivalent to Stephen's Inbox smart contract can be found [here](./contracts/Inbox.sol) and immediately below:

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.5.0 <0.9.0;

contract Inbox {
    string public message;

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
```

This smart contract is extremely simple but a good one for showing the changes that need to be made from the course version to bring it up-to-date with the latest Solidity version.

The first line:

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
```

is an [SPDX license identifier](https://docs.soliditylang.org/en/v0.6.8/layout-of-source-files.html?highlight=spdx#spdx-license-identifier), _introduced from Solidity 0.6.8_, which allows developers to specify the [license](https://spdx.org/licenses) the smart contract uses. **Every Solidity source file should start with a comment indicating its license** and it should be one of the identifiers listed at https://spdx.org/licenses. In this case I've specified that the smart contract uses the [GNU General Public License v3.0 or later](https://spdx.org/licenses/GPL-3.0-or-later.html)

The next line:

```solidity
pragma solidity >=0.5.0 <0.9.0;
```

specifies that this smart contract's source code is written for Solidity version 0.5.0 up to, but not including version 0.9.0. In the udemy.com course, the author uses a version pragma of ^0.4.17, so _the course's version of Inbox will not compile on a Solidity compiler earlier than version 0.4.17 nor will it compile on a compiler starting from version 0.5.0_.

Within the contract body definition, we will keep the line that declares the `message` state variable as is:

```solidity
string public message;
```

Now since we're declaring this variable using the `public` visibility keyword, the compiler will automatically generate a getter function that allows the current value of the `message` to be read from outside of the contract. The code of this function is equivalent to the following:

```solidity
function message() external view returns (string memory) { return message; }
```

This makes the `getMessage` function that the course author adds to his Inbox contract definition redundant, so there is no need for your Inbox contract to have this function.

### Change in syntax for definining the Contructor

In the course example, a constructor for Inbox is defined as follows:

```solidity
function Inbox(string initialMessage) public {
  message = initialMessage;
}
```

**This style of constructor definition is no longer valid**. As of Solidity 0.5.0, constructors [must be defined using the `constructor` keyword](https://docs.soliditylang.org/en/latest/050-breaking-changes.html#constructors). As of Solidity 0.7.0, [visibility (public / internal) is not needed for constructors anymore](https://docs.soliditylang.org/en/latest/050-breaking-changes.html#constructors). To prevent a contract from being created, it can be marked `abstract`, thereby making the visibility concept for constructors obsolete.

The constructor function for the Inbox contract therefore needs to be changed to:

```solidity
constructor(string memory initialMessage) {
  message = initialMessage;
}
```

Note that with this change, we also use the `memory` keyword when declaring the constructor's `initialMessage` string parameter. This is because, as of Solidity 0.5.0, explicit data location for all variables of struct, array or mapping types is now mandatory (see https://docs.soliditylang.org/en/latest/050-breaking-changes.html#explicitness-requirements), and this applies to function parameters and return variables as well. So just for the sake of a bit more clarity:

- Variables of type `string` are special arrays in Solidity. You can check out the official documentation on arrays [here](https://docs.soliditylang.org/en/v0.8.18/types.html#arrays).
- Since `string`s are arrays we have to specifiy an explicit data location, so we specify the `memory` location. The Ethereum Virtual Machine (EVM) has three areas where it can store data: **storage**, **memory** and the **stack**. See https://docs.soliditylang.org/en/v0.8.18/introduction-to-smart-contracts.html#storage-memory-and-the-stack if you want to learn more about these data locations.

Finally, we also add needed to add the `memory` data location to the `newMessage` parameter of the `setMessage` function.

<p align="center"><hr /></p>

## Compile Script

<p align="center"><hr /></p>

## Deploy Script

<p align="center"><hr /></p>

## Unit Tests
