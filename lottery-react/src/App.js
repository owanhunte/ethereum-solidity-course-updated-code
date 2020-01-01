import React from "react";
import lotteryContract from "./utils/lottery";
import web3 from "./utils/web3";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      players: [],
      balance: "",
      value: "",
      message: ""
    };
  }

  async componentDidMount() {
    const manager = await lotteryContract.methods.manager().call();
    this.setState({ manager });
    await this.updatePlayersListAndBalance();
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.showMessage("Waiting on transaction success...");
    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.showMessage("You have been entered!");
    this.updatePlayersListAndBalance();
  };

  onClick = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.showMessage("Waiting on transaction success...");
    await lotteryContract.methods.pickWinner().send({
      from: accounts[0]
    });
    this.showMessage("A winner has been picked!");
    this.updatePlayersListAndBalance();
  };

  /**
   * Improvement to course version: Method to update players list and balance
   * in the page view without the user having to perform a manual page reload.
   */
  updatePlayersListAndBalance = async () => {
    const players = await lotteryContract.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lotteryContract.options.address);
    this.setState({ players, balance });
  };

  showMessage = async msg => {
    this.setState({ message: msg });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          {this.state.players.length === 1
            ? ` There is currently ${this.state.players.length} person entered, `
            : ` There are currently ${this.state.players.length} people entered, `}
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter:</label>{" "}
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />{" "}
            <button>Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
