const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

// Delete the current build folder.
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

/***
 * Note: This part is a significant difference from what is shown in the Udemy course.
 * The approach here is the current recommended way to interface with the Solidity compiler,
 * which uses the so-called JSON-input-output interface.
 *
 * See https://solidity.readthedocs.io/en/v0.5.15/using-the-compiler.html#compiler-input-and-output-json-description
 * for more details.
 */
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts["Campaign.sol"];

// Create the build folder.
fs.ensureDirSync(buildPath);

// Extract and write the JSON representations of the contracts to the build folder.
for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    const element = contracts[contract];
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract}.json`),
      contracts[contract]
    );
  }
}
