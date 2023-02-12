# Up-to-date Lottery Smart Contract, Node.js Scripts & Unit Tests

> Section 2 of the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) by [Stephen Grider](https://www.udemy.com/user/sgslo/) implements a Lottery smart contract, along with a Node.js compile script, deploy script and unit tests for that contract. In this repo I provide up-to-date equivalents (along with detailed explanations) for each of these, for the benefit of students who have enrolled in Stephen's course.

## Contents

- [Lottery smart contract](#lottery-smart-contract)
- [Compile Script](#compile-script)
- [Update your package.json](#update-your-packagejson)
- [Unit Tests](#unit-tests)
- [Deploy Script](#deploy-script)

<p align="center"><hr /></p>

## Lottery Smart Contract

This is the second smart contract implemented in the udemy.com course and whereas the first contract (`Inbox`) was extremely simple, the `Lottery` contract is more complex. It introduces some of Solidity's more advanced concepts which you should ensure you understand thoroughly if you want to be on your way to mastering smart contract development. Also note that in order to bring the Lottery contract's code up-to-date, the changes I made from what is implemented in the course are significant.

You can find my version of the Lottery smart contract [here](./contracts/Lottery.sol) and it is shown immediately below. For frictionless readability, I've kept the comments alongside the source code, since they provide clear explanations for each part of the code in a seamless way.

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.5.0 <0.9.0;

contract Lottery {
  // As of Solidity 0.5.0 the `address` type was split into `address` and
  // `address payable`, where only `address payable` provides the transfer
  // function. We therefore need to explicity use the `address payable[]`
  // array type for the players array.
  address public manager;
  address payable[] public players;

  // As of Solidity 0.5.0 constructors must be defined using the `constructor`
  // keyword. See https://docs.soliditylang.org/en/latest/050-breaking-changes.html#constructors
  //
  // As of Solidity 0.7.0 visibility (public / internal) is not needed for
  // constructors anymore. To prevent a contract from being created,
  // it can be marked abstract.
  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    // Note: Although optional, it's a good practice to include error messages
    // in `require` calls.
    require(msg.value > .01 ether, "A minimum payment of .01 ether must be sent to enter the lottery");

    // As of Solidity 0.8.0 the global variable `msg.sender` has the type
    // `address` instead of `address payable`. So we must convert msg.sender
    // into `address payable` before we can add it to the players array.
    players.push(payable(msg.sender));
  }

  function random() private view returns (uint256) {
    // For an explanation of why `abi.encodePacked` is used here, see
    // https://github.com/owanhunte/ethereum-solidity-course-updated-code/issues/1
    return uint256(keccak256(abi.encodePacked(block.difficulty, block.number, players)));
  }

  function pickWinner() public onlyOwner {
    uint256 index = random() % players.length;

    // As of Solidity 0.4.24 at least, `this` is a deprecated way to get the address of the
    // contract. `address(this)` must be used instead.
    address contractAddress = address(this);

    players[index].transfer(contractAddress.balance);
    players = new address payable[](0);
  }

  function getPlayers() public view returns (address payable[] memory) {
    return players;
  }

  modifier onlyOwner() {
    require(msg.sender == manager, "Only owner can call this function.");
    _;
  }
}
```

If you haven't yet seen my explanations of the SPDX license identifier and pragma lines I'll explain them briefly now:

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
```

is an [SPDX license identifier](https://docs.soliditylang.org/en/latest/layout-of-source-files.html?highlight=spdx#spdx-license-identifier), _introduced from Solidity 0.6.8_, which allows developers to specify the [license](https://spdx.org/licenses) the smart contract uses. **Every Solidity source file should start with a comment indicating its license** and it should be one of the identifiers listed at https://spdx.org/licenses. In this case I've specified that the smart contract uses the [GNU General Public License v3.0 or later](https://spdx.org/licenses/GPL-3.0-or-later.html)

The line:

```solidity
pragma solidity >=0.5.0 <0.9.0;
```

specifies that this smart contract's source code is written for Solidity version 0.5.0 up to, but not including version 0.9.0. In the udemy.com course, the author uses a version pragma of ^0.4.17, so _the course's version of Lottery will not compile on a Solidity compiler earlier than version 0.4.17 nor will it compile on a compiler starting from version 0.5.0_.

<p align="center"><hr /></p>

## Compile Script

An up-to-date equivalent to the course's compile script for the Lottery contract can be found [here](./compile.js) and is shown immediately below:

```js
const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

/***
 * The recommended way to interface with the Solidity compiler, especially for more
 * complex and automated setups is the so-called JSON-input-output interface.
 *
 * See https://docs.soliditylang.org/en/latest/using-the-compiler.html#compiler-input-and-output-json-description
 * for more details.
 */
const input = {
  language: "Solidity",
  sources: {
    // Each Solidity source file to be compiled must be specified by defining either
    // a URL to the file or the literal file content.
    // See https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description
    "Lottery.sol": {
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

module.exports = output.contracts["Lottery.sol"].Lottery;
```

### Compiler Input and Output JSON Description

The recommended way to interface with the Solidity compiler, especially when developing more complex and automated setups is the so-called JSON-input-output interface. In summary, the compiler API expects a JSON formatted input and outputs the compilation result in a JSON formatted output. For details on this approach, including thorough descriptions of the input and output formats, check out the Solidity docs [here](https://docs.soliditylang.org/en/latest/using-the-compiler.html#compiler-input-and-output-json-description).

In our `compile.js` above, we create a JavaScript object representation of the input that will be passed to the compiler after it's JSON stringified. In this object we define the single Solidity source file that has to be compiled, `Lottery.sol`, passing the fully loaded source code of the contract as the content source of the contract.

The lines

```js
const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts["Lottery.sol"].Lottery;
```

parse the output returned by the call to `solc.compile(...)` and store it in the `output` variable. We then extract the `Lottery` contract object only and set that as the only export from `compile.js`.

<p align="center"><hr /></p>

## Update your package.json

Before I get into the unit tests and deploy script, I think it's important to first explain the updates that need to be made to this project's [package.json](./package.json), specificially the dependencies being used. **All** of the dependencies should be updated to their latest versions and the `ganache-cli` dependency replaced with `ganache`, since the `ganache-cli` package has been deprecated and is now just `ganache` (as explained [here](https://github.com/trufflesuite/ganache/blob/develop/UPGRADE-GUIDE.md)).

Here is what my package.json looks like:

```json
{
  "name": "lottery",
  "version": "2.0.2",
  "description": "Lottery smart contract Node.js project.",
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

Note that I installed the `ganache` and `mocha` packages as development dependencies since both are only used in the [unit tests](./test/Lottery.test.js).

<p align="center"><hr /></p>

## Unit Tests

An up-to-date equivalent to the course's unit tests (`Lottery.test.js`) can be found [here](./test/Lottery.test.js) and is shown immediately below:

```js
const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, evm } = require("../compile");
const { enterPlayerInLottery } = require("../util");

let lottery;
let accounts;

beforeEach(async () => {
  // Get a list of all accounts.
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract.
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await enterPlayerInLottery(lottery, accounts[1], web3, "0.02");

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.strictEqual(players[0], accounts[1]);
    assert.strictEqual(players.length, 1);
  });

  it("allows multiple accounts to enter", async () => {
    await enterPlayerInLottery(lottery, accounts[1], web3, "0.02");
    await enterPlayerInLottery(lottery, accounts[2], web3, "0.02");
    await enterPlayerInLottery(lottery, accounts[3], web3, "0.02");

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.strictEqual(players[0], accounts[1]);
    assert.strictEqual(players[1], accounts[2]);
    assert.strictEqual(players[2], accounts[3]);
    assert.strictEqual(players.length, 3);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await enterPlayerInLottery(lottery, accounts[4], web3, 0);
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("sends money to the winner and resets the players array", async () => {
    await enterPlayerInLottery(lottery, accounts[1], web3, "2");

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
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

imports the compiled `Lottery` contract object that the compile script exports and stores the `abi` and `evm` object values as variables. The import line which the course has, `const { interface, bytecode } = require("../compile");`, will not work with the latest Solidity compiler versions. The `abi` object replaces the `interface` object, and we can access the contract's bytecode object via `evm.bytecode.object`, as shown above.

<p align="center"><hr /></p>

## Deploy Script

An up-to-date equivalent to the course's deploy script for the Lottery contract can be found [here](./deploy.js) and is shown immediately below:

```js
// Load environment variables.
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

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object })
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
- The `dotenv` package is used to read these environment variables from a `.env` file. Create that file locally in the root of your lottery folder and copy the contents of [`.env.example`](./.env.example) into your `.env` file. Set `ACCOUNT_MNEMONIC` and `GOERLI_ENDPOINT` in your `.env` file appropriately. **DO NOT use a mnemonic for an account/wallet with real money or Ether associated with it!**
- To prevent the deployment from hanging, the statement `provider.engine.stop();` is added at the end of the `deploy` function definition.

## That's all for now

That about covers things where the updates to the Lottery smart contract and Node.js project are concerned. As always, I sincerely hope my contributions prove useful to all students of the course who find their way to this repository.
