import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

/**
 * IMPORTANT!! My implementation here is somewhat different from what is given
 * in the course code. Students attempting to learn from my solution should
 * take note of the following:
 *
 * 1) I'm making use of the @metamask/detect-provider utility for detecting
 *    the MetaMask Ethereum provider and enforcing that MetaMask be used, as
 *    opposed to some other ethereum-compatible browser (via options.mustBeMetaMask).
 *
 *    See https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
 *    for more details on using the Ethereum Provider API.
 *
 * 2) Even if MetaMask is installed and the Ethereum provider detected, App.js
 *    enforces a requirement that the user MUST be on the Goerli testnet network.
 *
 * 3) Unlike the approach the course takes where it automatically initiates a
 *    connection request to access the user's Ethereum account(s) when the app
 *    is loaded, I take the recommended approach to only initiate a connection
 *    request in response to direct user action, such as clicking a button.
 *
 *    See https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
 *
 * 4) MetaMask provides the Ethereum Provider API (window.ethereum) for developers
 *    to work with. Note that in January 2021 the former window.web3 API was
 *    removed in favor of the window.ethereum API.
 *
 * 5) This file exports an async function instead of an actual web3 reference to
 *    allow the web3 instance to be created asynchronously and stored in React state.
 */
const initWeb3 = async () => {
  let web3 = null;

  // Get the provider, or null if it couldn't be detected.
  const provider = await detectEthereumProvider({
    mustBeMetaMask: true
  });

  if (provider) {
    console.log("MetaMask Ethereum provider successfully detected!");

    const { ethereum } = window;
    web3 = new Web3(provider);

    // Reload the page when the currently connected chain changes.
    ethereum.on("chainChanged", _chainId => {
      window.location.reload();
    });

    ethereum.on("disconnect", _error => {
      window.location.reload();
    });

    // Code to initiate connection request to user's Ethereum account(s) moved
    // to `src/App.js`, and only run in response to direct user action.
  } else {
    console.log("Please install MetaMask!");
  }

  return web3;
};

export default initWeb3;
