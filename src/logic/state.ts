import { API as OnboardAPI } from 'bnc-onboard/dist/src/interfaces.d';
import Web3 from 'web3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';

export type DisconnectedState = {
    subscribed: false,
};
export type ConnectedState = {
    subscribed: true,
    // onboardPromise: OnboardPromise,
    web3: Web3,
    onboard: OnboardAPI,
    userWalletAddress: string,
    userIsContractOwner: boolean,
    contract: Contract,
};
export type State =
    | DisconnectedState
    | ConnectedState;

export type OnboardPromise = Promise<{ web3: Web3, onboard: OnboardAPI }>;

let currentState: State = {
    subscribed: false,
};

export function isConnected(state: State): state is ConnectedState {
    return state.subscribed;
}

export function updateState([previousState, nextState]: [State, State]) {
    currentState = {
        ...previousState,
        ...nextState,
    };

    return currentState;
}

export function getState() {
    return currentState;
}
