const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = Web3.givenProvider || ganache.provider();
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
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await enterPlayerInLottery(lottery, accounts[1], web3);

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(players[0], accounts[1]);
    assert.equal(players.length, 1);
  });

  it("allows multiple accounts to enter", async () => {
    await enterPlayerInLottery(lottery, accounts[1], web3);
    await enterPlayerInLottery(lottery, accounts[2], web3);
    await enterPlayerInLottery(lottery, accounts[3], web3);

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(players[0], accounts[1]);
    assert.equal(players[1], accounts[2]);
    assert.equal(players[2], accounts[3]);
    assert.equal(players.length, 3);
  });
});
