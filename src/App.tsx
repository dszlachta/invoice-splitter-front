import React, { useCallback, useState } from 'react';
import { Route } from 'react-router-dom';

import {
    connect,
    hasConnected,
} from './logic/actions';
import {
    createAddProject,
    AddProjectOptions,
    GetProjectDueOptions,
    createGetProjectDue,
    createPayProject,
    PayProjectOptions,
    createIsProjectPaid,
} from './logic/contract';
import OwnerView from './Owner';
import ClientView from './Client';
// import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import StartView from './StartView';
import { isConnected, State } from './logic/state';
import { TransactionStatus } from './transaction_status';
import WalletConnect from './WalletConnect';

function App() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [appState, setAppState] = useState<State>({ subscribed: false });
    const [walletConnected, setWalletConnected] = useState(false);
    const [ownerConnected, setOwnerConnected] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({ status: 'pristine' });
    const [paymentTransactionStatus, setPaymentTransactionStatus] = useState<TransactionStatus>({ status: 'pristine' });

    const onConnectClick = async () => {
        const result = await connect();

        if (!hasConnected(result)) {
            console.error(result.reason);
            return;
        }

        const { state } = result;
        setAppState(state);

        setWalletConnected(true);

        setOwnerConnected(
            state.userIsContractOwner,
        );
    };

    // const sendAddProject = useMemo(() => {
    //     if (!isConnected(appState)) return () => { };

    //     createAddProject(appState.web3, appState.contract);
    // }, [appState]);
    // const callGetProjectDue = useMemo(() => {
    //     if (!isConnected(appState)) return () => Promise.reject(new Error('uninitialized'));

    //     return createGetProjectDue(appState.web3, appState.contract);
    // }, [appState]);
    // const sendPayProject = useMemo(() => {
    //     if (!isConnected(appState)) return () => { };

    //     return createPayProject(appState.web3, appState.contract);
    // }, [appState]);

    const onAddProject = useCallback(async (options: AddProjectOptions) => {
        if (!isConnected(appState)) throw new Error('Not initialized');

        try {
            setTransactionStatus({ status: 'pending' });

            const receipt = await createAddProject(appState.web3, appState.contract)(options);
            const { projectId } = receipt.events.ProjectAdded.returnValues;

            setTransactionStatus({
                status: 'success',
                payload: { projectId },
            });
        } catch (error) {
            setTransactionStatus({
                status: 'failed',
                reason: error,
            });
            console.error(error);
        }
    }, [appState]);

    const isProjectPaid = useCallback(async ({ projectId }: { projectId: string }) => {
        if (!isConnected(appState)) throw new Error('Not initialized');

        const result = await createIsProjectPaid(appState.web3, appState.contract)({ projectId });

        return result;
    }, [appState]);

    const getProjectDue = useCallback(async (options: GetProjectDueOptions) => {
        if (!isConnected(appState)) throw new Error('Not initialized');

        const result = await createGetProjectDue(appState.web3, appState.contract)(options);

        return result;
    }, [appState]);

    const onPayProject = useCallback(async (options: PayProjectOptions) => {
        if (!isConnected(appState)) throw new Error('Not initialized');

        const result = await createPayProject(appState.web3, appState.contract)(options);

        if (result?.events.PaymentReceived) {
            setPaymentTransactionStatus({
                status: 'success',
                payload: { paid: true },
            });

            return;
        }

        setPaymentTransactionStatus({
            status: 'failed',
            reason: new Error('Payment event not emitted'),
        });
    }, [appState]);

    return (
        <div className="App">
            <header className="App-header">
                Invoice splitter
            </header>

            <Route
                path="/new"
                render={() => (walletConnected && ownerConnected
                    ? (
                        <OwnerView
                            createInvoice={onAddProject}
                            transactionStatus={transactionStatus}
                        />
                    )
                    : (
                        <WalletConnect
                            onConnect={onConnectClick}
                        />
                    )
                )}
            />
            <Route
                path="/pay/:projectId"
                render={() => (walletConnected && !ownerConnected
                    ? (
                        <ClientView
                            onPay={onPayProject}
                            getProjectDue={getProjectDue}
                            isProjectPaid={isProjectPaid}
                            transactionStatus={paymentTransactionStatus}
                        />
                    )
                    : (
                        <WalletConnect
                            onConnect={onConnectClick}
                        />
                    )
                )}
            />
            <Route
                path="/"
                exact
            >
                <StartView
                    userConnected={walletConnected}
                    ownerConnected={ownerConnected}
                    onConnect={onConnectClick}
                />
            </Route>
        </div>
    );
}

export default App;
