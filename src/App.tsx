import React from 'react';
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import logo from './logo.svg';
import './App.css';

if (!process.env.REACT_APP_NETWORK_ID) {
  throw new Error('No network id');
}

let web3;

const onboard = Onboard({
  dappId: process.env.REACT_APP_BN_API_KET,
  networkId: parseInt(process.env.REACT_APP_NETWORK_ID, 10),
  subscriptions: {
    wallet: wallet => {
      web3 = new Web3(wallet.provider)
    }
  }
});

function App() {
  const connect = async () => {
    const selection = await onboard.walletSelect();

    console.log({ walletSelected: selection });

    const check = await onboard.walletCheck();

    console.log({ check });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button onClick={connect}>
            Connect wallet
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
