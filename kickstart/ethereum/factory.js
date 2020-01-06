import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xe345a38A0274B5E89E4e0275B78D49b24644Edc2"
);

export default instance;
