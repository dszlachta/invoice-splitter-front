import {
    ConnectedState,
} from './state';

import {
    connectAndGetWeb3Instance,
} from './wallet';

import {
    getContract,
} from './contract';

type ConnectFailed = {
    success: false,
    reason: Error,
};
type ConnectSucceeded = {
    success: true,
    state: ConnectedState,
};
type ConnectResult =
    | ConnectFailed
    | ConnectSucceeded;

const WalletNotSelected = new Error('Wallet not selected');
const WalletNotChecked = new Error('Wallet not checked');

export async function connect(): Promise<ConnectResult> {
    const { web3Promise, onboard } = connectAndGetWeb3Instance();
    const walletSelected = await onboard.walletSelect();

    if (!walletSelected) {
        return {
            success: false,
            reason: WalletNotSelected,
        };
    }

    const walletChecked = await onboard.walletCheck();

    if (!walletChecked) {
        return {
            success: false,
            reason: WalletNotChecked,
        };
    }

    const web3 = await web3Promise;
    web3.eth.handleRevert = true;

    const { address: userWalletAddress } = await onboard.getState();
    const contractOwner = String(process.env.REACT_APP_OWNER_ADDRESS).toLowerCase();
    const contract = getContract(web3, userWalletAddress);

    const state: ConnectedState = {
        subscribed: true,
        web3,
        onboard,
        userWalletAddress,
        userIsContractOwner: contractOwner === userWalletAddress,
        contract,
    };

    return {
        success: true,
        state,
    };
}

export function hasConnected(result: ConnectResult): result is ConnectSucceeded {
    return result.success;
}
