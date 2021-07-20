# Ethereum Invoice Splitter

This is a front-end for Invoice Splitter ([smart contract repository here](https://github.com/dszlachta/invoice-splitter-contract)), a tool that allows one party (a client) to send payment, which is instantly divided and sent to shareholders.

## Usage

### As an owner
Connect with your wallet and add a new project, providing shareholders' addresses and how many shares each of them has. After the data is saved to the smart contract, you will be present with a payment link. Send it to the client.

### As a client
Open the app with the payment link, review transaction details and click *Pay X ETH* to initiate the payment. Then confirm the transaction in your wallet.

### Available wallets

This app uses Onboard to integrate with the most popular wallets.

## Available Scripts
- `yarn start`
- `yarn build`
- `yarn eject`
