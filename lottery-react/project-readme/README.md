# Lottery React App

This is a project-specific README I created for the lottery-react app developed in the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/). In the course the instructor makes use of the previous approach of installing `create-react-app` globally via `npm install -g create-react-app`. This is no longer the recommended approach. As such, I bootstrapped my setup of the project using one of the new recommended methods, specifically, I used the Yarn command:

```bash
yarn create react-app lottery-react
```

## Rename lottery-react/src/utils/lottery.js.example

Before running this app you will need to rename the file [lottery-react/src/utils/lottery.js.example](/lottery-react/src/utils/lottery.js.example) to **lottery-react/src/utils/lottery.js**. You should also compile the [Lottery smart contract](/lottery/contracts/Lottery.sol) and update the `contractAddress` and `abi` variables in your **lottery.js** file with the blockchain address and ABI of your deployed contract on the Rinkeby Test Network.

## MetaMask browser plugin required

As covered in the course, the app expects that you have the MetaMask web browser plugin installed since it makes use of the Ethereum Provider API that MetaMask injects into the web page.
