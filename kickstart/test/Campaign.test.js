const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = Web3.givenProvider || ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  /***
   * NOTE: In the Udemy course code for this test file, the instructor sets
   * gas to a value of 1000000 (1 million). That does not work here. My tests
   * result in a 'VM Exception while processing transaction: out of gas'
   * being generated when using that value.
   *
   * However, when I set gas to 1500000 (1.5 million) the tests passed.
   */
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1500000"
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1]
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1500000"
      });

    const request = await campaign.methods.requests(0).call();
    assert("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    // Let accounts[1] contribute 10 ether to the campaign.
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[1]
    });

    // Create a spend request for 5 ether to go to accounts[2].
    await campaign.methods
      .createRequest(
        "A cool spend request",
        web3.utils.toWei("5", "ether"),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: "1500000"
      });

    // Approve the spend request.
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1500000"
    });

    // Finalize the request.
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1500000"
    });

    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
