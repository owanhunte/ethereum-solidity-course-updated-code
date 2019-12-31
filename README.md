# Ethereum and Solidity: The Complete Developer's Guide (Community Contributed Code Updates)

Up-to-date Solidity/web3.js/Truffle/React code for the udemy.com course [Ethereum and Solidity: The Complete Developer's Guide](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/).

**Note**: This is a work-in-progress as I have enrolled in but have not yet completed the abovementioned course.

## The Reason

Earlier this year I became very interested in entering the blockchain development space and so I embarked on a journey to learn as much as I can, as quickly as I can, within this ever-evolving tech space we refer to as _Blockchain_, and to be more specific, the **Ethereum ecosystem**. Of course, I quickly realised that the development tools and packages being used to build, develop and deploy dApps and tech within this ecosystem all share a common trend: **rapid change and evolution, often introducing breaking changes through iterations of their releases**.

For instance, _Solidity_ states the following on it's [official docs site](https://solidity.readthedocs.io/):

> When deploying contracts, you should use the latest released version of Solidity. This is because breaking changes as well as new features and bug fixes are introduced regularly. We currently use a 0.x version number [to indicate this fast pace of change](https://semver.org/#spec-item-4).

I make heavy use of the online learning website [udemy.com](https://www.udemy.com/) and find it to be a great supplementary learning tool. So naturally I bought a few courses on Ethereum and Solidity. The problem is, each of these courses target outdated versions of [Solidity](https://solidity.readthedocs.io/), [web3.js](https://web3js.readthedocs.io/) and [Truffle](https://www.trufflesuite.com/) in their course lessons and code examples. In the course creators' defense, remember, this is rapidly evolving tech we're dealing with here and the respective effort required to keep their video course content up-to-date with current software releases can be rather challenging.

_And so, that's where I decided to lend a bit of a helping hand_.

## Let the Code speak

I figured that if I wanted the online courses I enrolled in to provide up-to-date code then **other developers also had to want this**. So, I decided to take action and just write the updated code myself, starting with the Udemy course _Ethereum and Solidity: The Complete Developer's Guide_, the one I am finding most enjoyable and acceptable so far.

## Repository structure

This repository is being setup as a monorepo, so as to keep the updated versions of the isolated bits of the course's code and tests well organized all within a single repository.

### Smart Contracts

The smart contracts created in the course are:

- [The Inbox Contract](/inbox)
- [The Lottery Contract](/lottery)

### Working with the latest React tooling

The course sections that cover building out a front-end application using React make use of the previous approach of installing `create-react-app` globally via `npm install -g create-react-app`. This is no longer the recommended approach. As such if you have already used this command and installed `create-react-app` globally then you should uninstall the package using `npm uninstall -g create-react-app`. To create a new React app you may now use one of the following methods to ensure that you always use the latest React version:

- **npx**: `npx create-react-app my-app`
- **npm**: `npm init react-app my-app`
- **Yarn**: `yarn create react-app my-app`

For more details on the above methods, see [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app).

### The lottery-react App

To create the `lottery-react` app I chose the yarn command option, as follows:

```bash
`yarn create react-app lottery-react`
```

[Browse the lottery-react App code files](/lottery-react)

## Acknowledgement

I would like to give credit to [Stephen Grider](https://www.udemy.com/user/sgslo/) for creating the [excellent course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/) for which I created this repository as my own personal add-on. If any mistakes or errors are found within any of this repository's content they should be attributed to an oversight on my part, and in no part should be deemed any fault of the Udemy course author, Stephen Grider.
