/***
 * The following contract address and ABI are for a deployment of the Lottery contract made to the
 * Rinkeby Test Network. The contract itself was compiled using version 0.8.5 of the Solidity
 * compiler.
 *
 * NOTE: Update the contractAddress and abi variables to those for your own deployed contract.
 */

export const contractAddress = "0xB3493F8C137DaEb3A10bF99760AE2c574c375373";

export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
    signature: "constructor"
  },
  {
    inputs: [],
    name: "enter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
    signature: "0xe97dcb62"
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
    type: "function",
    constant: true,
    signature: "0x8b5b9ccc"
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
    type: "function",
    constant: true,
    signature: "0x481c6a75"
  },
  {
    inputs: [],
    name: "pickWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x5d495aea"
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
    type: "function",
    constant: true,
    signature: "0xf71d96cb"
  }
];
