import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xB5b2924fe935Cc3E7DFd8FCC613A29796814405a"
);

export default instance;
