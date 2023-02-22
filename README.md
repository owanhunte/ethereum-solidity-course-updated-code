# Ethereum and Solidity: The Complete Developer's Guide (Community Contributed Code Updates)

**Update In Progress...**
This repo is currently being brought up-to-date. So far, updates to the _Inbox_ and _Lottery_ smart contracts, Node.js compile and deploy scripts, unit tests and the Lotttery React web app have all been completed. Updates to the _Kickstart/CrowdCoin_ Next.js web app are in progress and should be completed over the coming week.

## Purpose of this Repo

Up-to-date Solidity/web3.js/Node.js/React/Next.js code for the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/).

## The Reason

Toward the end of 2019 I became very interested in entering the blockchain development space and so I embarked on a journey to learn as much as I can, as quickly as I can, within this ever-evolving tech space, and to be more specific, the **Ethereum ecosystem**. Of course, I quickly realised that the development tools and packages being used to build, develop and deploy dApps and tech within this ecosystem all share a common trend: **rapid change and evolution, sometimes introducing breaking changes through iterations of their releases**.

I make heavy use of the online learning website [udemy.com](https://www.udemy.com/) and find it to be a great supplementary learning tool. So naturally I bought a few courses on Ethereum and Solidity. The problem is, many of these courses target outdated versions of [Solidity](https://docs.soliditylang.org), [web3.js](https://web3js.readthedocs.io/) and [Truffle](https://www.trufflesuite.com/) in their course lessons and code examples. In the course creators' defense, remember, this is rapidly evolving tech we're dealing with here and the respective effort required to keep their video course content up-to-date with current software releases can be rather challenging.

_And so, that's where I decided to lend a bit of a helping hand_.

## Let the Code speak

I figured that if I wanted the online courses I enrolled in to provide up-to-date code then **other developers also had to want this**. So, I decided to take action and just write the updated code myself, starting with the Udemy course _Ethereum and Solidity: The Complete Developer's Guide_, the one I found most enjoyable and acceptable.

## Repository structure

This repository was setup as a monolithic repository (without the full monorepo structure so as not to introduce unnecessary extra complexity beyond the scope of the udemy.com course), allowing me to keep the updated versions of the isolated bits of the course's code and tests well organized all within a single repository.

### Smart Contracts

The smart contracts created in the course are:

- [The Inbox Contract](/inbox/contracts/Inbox.sol)
- [The Lottery Contract](/lottery/contracts/Lottery.sol)
- [The CampaignFactory and Campaign contracts](/kickstart/ethereum/contracts/Campaign.sol)

### Working with the latest React tooling

The course sections that cover building out a front-end application using React make use of outdated versions of [_Create React App_](https://create-react-app.dev) and [_Next.js_](https://nextjs.org).

For Create React App, the previous approach of installing globally via `npm install -g create-react-app` is no longer the recommended approach. As such if you have already used this command and installed create-react-app globally then you should uninstall the package using `npm uninstall -g create-react-app` or `yarn global remove create-react-app`. To create a new React app you may now use one of the following methods to ensure that you always use the latest React version:

- **npx**: `npx create-react-app my-app`
- **npm**: `npm init react-app my-app`
- **Yarn**: `yarn create react-app my-app`

For more details on the above methods, see [https://create-react-app.dev/docs/getting-started](https://create-react-app.dev/docs/getting-started).

**The Kickstart/CrowdCoin app implemented in this repo is itself currently being updated to the latest version of Next.js (v13).**

### The lottery-react App

To create the `lottery-react` app I chose to use the npx command option, as follows:

```bash
npx create-react-app lottery-react
```

- [Browse the lottery-react App code files](/lottery-react)
- [lottery-react App README](/lottery-react/README.md)
- [Live Demo of the app](https://lottery-react.onrender.com)

### The Kickstart/CrowdCoin App

- [Browse the app code files](/kickstart)
- Live Demo of the app (_update in progress_)

## Acknowledgement

I would like to give credit to [Stephen Grider](https://www.udemy.com/user/sgslo/) for creating the [excellent course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) for which I created this repository as my own personal add-on. If any mistakes or errors are found within any of this repository's content they should be attributed to an oversight on my part, and in no part should be deemed any fault of the Udemy course author, Stephen Grider.
