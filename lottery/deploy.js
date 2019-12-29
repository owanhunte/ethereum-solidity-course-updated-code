// Load environment variables.
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");
const mnemonic = process.env.ACCOUNT_MNEMONIC;
const network = process.env.RINKEBY_ENDPOINT;

const provider = new HDWalletProvider(mnemonic, network);
const web3 = new Web3(provider);
const message = "Hi there!";

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
