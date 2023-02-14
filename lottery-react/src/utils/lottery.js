/***
 * The following contract address and ABI are for a deployment of the Lottery contract made to the
 * Goerli Ethereum Test Network. The contract itself was compiled using version 0.8.18 of the Solidity
 * compiler.
 *
 * NOTE: Update the contractAddress and abi variables to those for your own deployed contract.
 */

export const contractAddress = "0x7d10af4B72A516767bCf171Cf99C39778fC62756";

export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "enter",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getPlayers",
    outputs: [
      {
        internalType: "address payable[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pickWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "players",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
