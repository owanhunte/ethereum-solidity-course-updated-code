# Up-to-date Inbox Smart Contract, Node.js Scripts & Unit Tests

> Section 1 of the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) by [Stephen Grider](https://www.udemy.com/user/sgslo/) implements an Inbox smart contract, along with a Node.js compile script, deploy script and unit tests for that contract. In this repo I provide up-to-date equivalents (along with detailed explanations) for each of these, for the benefit of students who have enrolled in Stephen's course.

## Contents

- [Inbox smart contract](#inbox-smart-contract)
- [Compile Script](#compile-script)
- [Update your package.json](#update-your-packagejson)
- [Unit Tests](#unit-tests)
- [Deploy Script](#deploy-script)

<p align="center"><hr /></p>

## Inbox Smart Contract

An up-to-date equivalent to the course's Inbox smart contract can be found [here](./contracts/Inbox.sol) and is shown immediately below:

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

- Variables of type `string` are special arrays in Solidity. You can check out the official documentation on arrays [here](https://docs.soliditylang.org/en/latest/types.html#arrays).
- Since `string`s are arrays we have to specifiy an explicit data location, so we specify the `memory` location. The Ethereum Virtual Machine (EVM) has three areas where it can store data: **storage**, **memory** and the **stack**. See https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#storage-memory-and-the-stack if you want to learn more about these data locations.

The final change to the contract was to also add the `memory` data location to the `newMessage` parameter of the `setMessage` function.

<p align="center"><hr /></p>

## Compile Script

An up-to-date equivalent to the course's compile script for the Inbox contract can be found [here](./compile.js) and is shown immediately below:

```js
const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: source
    }
  },
  settings: {
    metadata: {
      useLiteralContent: true
    },
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts["Inbox.sol"].Inbox;
```

There's alot to digest with respect to the changes made to this script to bring it up-to-date. So let's dive in and explain what's going on:

### Compiler Input and Output JSON Description

The recommended way to interface with the Solidity compiler, especially when developing more complex and automated setups is the so-called JSON-input-output interface. In summary, the compiler API expects a JSON formatted input and outputs the compilation result in a JSON formatted output. For details on this approach, including thorough descriptions of the input and output formats, check out the Solidity docs [here](https://docs.soliditylang.org/en/latest/using-the-compiler.html#compiler-input-and-output-json-description).

In our updated `compile.js` above, we declare a variable named `input` to hold a JavaScript object representation of the input that will be passed to the compiler after it's JSON stringified. In this object we define the single Solidity source file that has to be compiled, `Inbox.sol`, passing the fully loaded source code of the contract as the content source of the contract.

The lines

```js
const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts["Inbox.sol"].Inbox;
```

parse the output returned by the call to `solc.compile(...)` and store it in the `output` variable. We then extract the `Inbox` contract object only and set that as the only export from `compile.js`.

<p align="center"><hr /></p>

## Update your package.json

Before I get into the unit tests and deploy script, I think it's important to first explain the updates that need to be made to this project's [package.json](./package.json), specificially the dependencies being used. **All** of the dependencies should be updated to their latest versions and the `ganache-cli` dependency replaced with `ganache`, since the `ganache-cli` package has been deprecated and is now just `ganache` (as explained [here](https://github.com/trufflesuite/ganache/blob/develop/UPGRADE-GUIDE.md)).

Here is what my package.json looks like:

```json
{
  "name": "inbox",
  "version": "2.0.2",
  "description": "Inbox smart contract Node.js project.",
  "main": "compile.js",
  "scripts": {
    "test": "mocha"
  },
  "author": "Owan Hunte",
  "license": "ISC",
  "dependencies": {
    "@truffle/hdwallet-provider": "^2.1.6",
    "dotenv": "^16.0.3",
    "solc": "^0.8.18",
    "web3": "^1.8.2"
  },
  "devDependencies": {
    "ganache": "^7.7.4",
    "mocha": "^10.2.0"
  }
}
```

Note that I installed the `ganache` and `mocha` packages as development dependencies since both are only used in the [unit tests](./test/Inbox.test.js).

<p align="center"><hr /></p>

## Unit Tests

An up-to-date equivalent to the course's unit tests (`Inbox.test.js`) can be found [here](./test/Inbox.test.js) and is shown immediately below:

```js
const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, evm } = require("../compile");

const message = "Hi there!";
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts.
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object, arguments: [message] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const msg = await inbox.methods.message().call();
    assert.strictEqual(msg, message);
  });

  it("can change the message", async () => {
    const newMsg = "bye";
    await inbox.methods.setMessage(newMsg).send({ from: accounts[0] });

    const msg = await inbox.methods.message().call();
    assert.strictEqual(msg, newMsg);
  });
});
```

There are 2 main changes happening with the above tests file. First we have the line:

```js
const ganache = require("ganache");
```

which replaces the line from the course's version that uses the now deprecated `ganache-cli`.

Second, the line

```js
const { abi, evm } = require("../compile");`
```

imports the compiled `Inbox` contract object that the compile script exports and stores the `abi` and `evm` object values as variables. The import line which the course has, `const { interface, bytecode } = require("../compile");`, will not work with the latest Solidity compiler versions. The `abi` object replaces the `interface` object, and we can access the contract's bytecode object via `evm.bytecode.object`, as shown above.

<p align="center"><hr /></p>

## Deploy Script

An up-to-date equivalent to the course's deploy script for the Inbox contract can be found [here](./deploy.js) and is shown immediately below:

```js
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");
const mnemonicPhrase = process.env.ACCOUNT_MNEMONIC;
const network = process.env.GOERLI_ENDPOINT;

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase
  },
  providerOrUrl: network
});

const web3 = new Web3(provider);
const message = "Hi there!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object, arguments: [message] })
    .send({ from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
```

The changes in this script from the course's version are as follows:

- The line `const { abi, evm } = require("./compile");` replaces the `const { interface, bytecode } = require("./compile");` line that's found in the course example, and we access the bytecode object via `evm.bytecode.object`.
- Instead of hard-coding the account mnemonic and Infura endpoint as is done in the course's deploy script, I'm storing and referencing these via environment variables.
- A [Goerli Infura](https://app.infura.io) endpoint (stored in the `process.env.GOERLI_ENDPOINT` environment variable) is passed to `HDWalletProvider` instead of a Rinkeby endpoint since the Rinkeby network no longer exists. So when copying your endpoint from the Infura dashboard, remember to grab the Goerli Ethereum endpoint.
- The `dotenv` package is used to read these environment variables from a `.env` file. Create that file locally in the root of this inbox folder and copy the contents of `.env.example` into your `.env` file. Set `ACCOUNT_MNEMONIC` and `GOERLI_ENDPOINT` in your `.env` file appropriately. **DO NOT use a mnemonic for an account/wallet with real money or Ether associated with it!**
- To prevent the deployment from hanging, the statement `provider.engine.stop();` is added at the end of the `deploy` function definition.

## That's all for now

That about covers things where the updates to the Inbox smart contract and Node.js project are concerned. I sincerely hope my contributions prove useful to all students of the course who find their way to this repository.
