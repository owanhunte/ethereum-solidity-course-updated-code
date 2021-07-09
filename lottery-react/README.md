# Lottery React App

This README is for my version of the lottery-react app developed in the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/). In the course the instructor makes use of the previous approach of installing `create-react-app` globally via `npm install -g create-react-app`. This is no longer the recommended approach. As such, I bootstrapped my setup of the project using one of the new recommended methods, specifically, I used the Yarn command:

```bash
yarn create react-app lottery-react
```

## Update `lottery-react/src/utils/lottery.js`

Before running this app you should deploy the [Lottery smart contract](/lottery/contracts/Lottery.sol) to the Rinkeby Test Network and update the `contractAddress` and `abi` variables in your **lottery-react/src/utils/lottery.js** file with the blockchain address and ABI of your deployed contract on the Rinkeby Test Network.

## MetaMask browser plugin required

As covered in the course, the app expects that you have the MetaMask web browser plugin installed since it makes use of the Ethereum Provider API that MetaMask injects into the web page.

## Final Note

My implementation of the Lottery React app is somewhat different from what is given in the course code. Students attempting to learn from my solution should take note of the following:

- I'm making use of the [@metamask/detect-provider](https://github.com/MetaMask/detect-provider) utility for detecting the MetaMask Ethereum provider and enforcing that MetaMask be used, as opposed to some other ethereum-compatible browser (via options.mustBeMetaMask). See https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider for more details on using the Ethereum Provider API.
- Even if MetaMask is installed and the Ethereum provider detected, [App.js enforces a requirement](/lottery-react/src/App.js#L35) that the user MUST be connected the Rinkeby test network and not any other Ethereum network.
- Unlike the approach the course takes where it automatically initiates a connection request to access the user's Ethereum account(s) when the app is loaded, I take the recommended approach to only initiate a connection request in response to direct user action, such as clicking a button. See https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
- The [src/utils/web3.js](/lottery-react/src/utils/web3.js) file exports an async function instead of an actual web3 reference to allow the web3 instance to be created asynchronously and stored in React state.
- I defined [App.js](/lottery-react/src/App.js) as a functional component instead of a class component.
- I gave the app a bit of styling.

## Live Demo

I have deployed a live version of this app to [Render](https://render.com) at https://lottery-react.onrender.com.