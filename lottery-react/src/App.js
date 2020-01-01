import React from "react";
import "./App.css";
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
    const players = await lotteryContract.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lotteryContract.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({ message: "You have been entered!" });
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          {this.state.players.length === 1
            ? ` There is currently ${this.state.players.length} person entered, `
            : ` There are currently ${this.state.players.length} people entered, `}
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}
          ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>

        <hr />

        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
