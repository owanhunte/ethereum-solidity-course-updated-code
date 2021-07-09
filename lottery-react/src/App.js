import { useEffect, useRef, useState } from "react";
import initWeb3 from "./utils/web3";
import { abi, contractAddress } from "./utils/lottery";
import "./App.css";

const { ethereum } = window;

function App() {
  const lotteryContract = useRef(null);
  const [web3, setWeb3] = useState(null);
  const [doneCheckingForMetaMask, setDoneCheckingForMetaMask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isRinkebyChain, setIsRinkebyChain] = useState(false);

  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const [enteringLottery, setEnteringLottery] = useState(false);
  const [pickingWinner, setPickingWinner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initWeb3WithProvider() {
      if (web3 === null) {
        if (!cancelled) {
          setDoneCheckingForMetaMask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);

          // Transactions done in this app must be done on the Rinkeby test network.
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId === "0x4") {
            setIsRinkebyChain(true);
          }

          setDoneCheckingForMetaMask(true);

          if (web3Instance !== null) {
            // Create Contract JS object.
            lotteryContract.current = new web3Instance.eth.Contract(abi, contractAddress);

            // Check to see if user is already connected.
            try {
              const accounts = await ethereum.request({ method: "eth_accounts" });
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true);
              }
            } catch (error) {
              console.error(error);
            }

            // Implement `accountsChanged` event handler.
            ethereum.on("accountsChanged", handleAccountsChanged);
          }
        }
      }
    }

    initWeb3WithProvider();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (connected) {
      async function handler() {
        const manager = await lotteryContract.current.methods.manager().call();
        if (!cancelled) {
          setManager(manager);
          await updatePlayersListAndBalance();
        }
      }
      handler();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const getAccount = async (_event) => {
    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {}
    setConnecting(false);
  };

  const handleAccountsChanged = (_accounts) => {
    window.location.reload();
  };

  /**
   * Define a function to update players list and balance in the page view
   * without the user having to perform a manual page reload.
   */
  const updatePlayersListAndBalance = async () => {
    const players = await lotteryContract.current.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lotteryContract.current.options.address);
    setPlayers(players);
    setBalance(balance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setEnteringLottery(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether")
    });
    showMessage("You have been entered!");
    updatePlayersListAndBalance();
    setEnteringLottery(false);
  };

  const pickWinner = async (event) => {
    event.preventDefault();
    setPickingWinner(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods.pickWinner().send({
      from: accounts[0]
    });
    showMessage("A winner has been picked!");
    updatePlayersListAndBalance();
    setPickingWinner(false);
  };

  const showMessage = async (msg) => {
    setMessage(msg);
  };

  return (
    <div className="App">
      {web3 === null && !doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert info">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">Checking for MetaMask Ethereum Provider...</p>
          </div>
        </div>
      )}

      {web3 === null && doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              MetaMask is required to run this app! Please install MetaMask and then refresh this
              page.
            </p>
          </div>
        </div>
      )}

      {web3 !== null && doneCheckingForMetaMask && !isRinkebyChain && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              You must be connected to the <strong>Rinkeby test network</strong> for Ether
              transactions made via this app.
            </p>
          </div>
        </div>
      )}

      {web3 !== null && !connected && isRinkebyChain && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p>
              Want to try your luck in the lottery? Connect with MetaMask and start competing right
              away!
            </p>
            <div className="center">
              <button
                className="btn primaryBtn"
                type="button"
                onClick={getAccount}
                disabled={connecting}
              >
                Connect with MetaMask
              </button>
            </div>
          </section>
        </div>
      )}

      {web3 !== null && connected && isRinkebyChain && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p>
              This contract is managed by {manager}.
              {players.length === 1
                ? ` There is currently ${players.length} person entered, `
                : ` There are currently ${players.length} people entered, `}
              competing to win {web3.utils.fromWei(balance, "ether")} ether!
            </p>

            <hr />

            <form onSubmit={onSubmit}>
              <h4>Want to try your luck?</h4>
              <div>
                <label>Amount of ether to enter:</label>{" "}
                <input value={value} onChange={(event) => setValue(event.target.value)} />{" "}
                <button className="btn primaryBtn" type="submit" disabled={enteringLottery}>
                  Enter
                </button>
              </div>
            </form>

            {manager.toLowerCase() === ethereum.selectedAddress && (
              <>
                <hr />

                <h4>Ready to pick a winner?</h4>
                <button
                  className="btn primaryBtn"
                  type="button"
                  onClick={pickWinner}
                  disabled={pickingWinner}
                >
                  Pick a winner!
                </button>
              </>
            )}

            <hr className="spacey" />

            <h2>{message}</h2>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
