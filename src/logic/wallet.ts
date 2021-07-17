import Onboard from 'bnc-onboard';
import Web3 from 'web3';
import { API as OnboardAPI } from 'bnc-onboard/dist/src/interfaces.d';

type ConnectResult = {
    web3Promise: Promise<Web3>,
    onboard: OnboardAPI,
};

export function connectAndGetWeb3Instance(): ConnectResult {
    if (!process.env.REACT_APP_NETWORK_ID) {
        throw new Error('No network id');
    }

    if (!process.env.REACT_APP_BN_API_KEY) {
        throw new Error('No Blocknative API key');
    }

    let onboard = null;
    const providerPromise: Promise<Web3> = new Promise((resolve) => {
        onboard = Onboard({
            dappId: process.env.REACT_APP_BN_API_KET,
            networkId: parseInt(process.env.REACT_APP_NETWORK_ID as string, 10),
            subscriptions: {
                wallet: (wallet) => {
                    const web3 = new Web3(wallet.provider);

                    resolve(web3);
                },
            },
        });
    });

    return {
        onboard: (onboard as unknown) as OnboardAPI,
        web3Promise: providerPromise,
    };
}
