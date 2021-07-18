import React, { useCallback, useEffect, useState } from 'react';
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

import './App.css';
import StartView from './StartView';
import { isConnected, State } from './logic/state';
import { TransactionStatus } from './transaction_status';
import WalletConnect from './WalletConnect';
import { useNotifications } from './hooks/useNotifications';
import { Notifications } from './Notifications';

function App() {
    const [notifications, addNotification] = useNotifications();
    const [appState, setAppState] = useState<State>({ subscribed: false });
    const [walletConnected, setWalletConnected] = useState(false);
    const [ownerConnected, setOwnerConnected] = useState(false);
    const [addTransactionStatus, setAddTransactionStatus] = useState<TransactionStatus<string>>({ status: 'pristine' });
    const [paymentTransactionStatus, setPaymentTransactionStatus] = useState<TransactionStatus<boolean>>({ status: 'pristine' });

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

    const onAddProject = useCallback(async (options: AddProjectOptions) => {
        if (!isConnected(appState)) throw new Error('Not initialized');

        try {
            setAddTransactionStatus({ status: 'pending' });

            const receipt = await createAddProject(appState.web3, appState.contract)(options);
            const { projectId } = receipt.events.ProjectAdded.returnValues;

            setAddTransactionStatus({
                status: 'success',
                payload: { projectId },
            });
        } catch (error) {
            setAddTransactionStatus({
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

    useEffect(() => {
        if (process.env.REACT_APP_NETWORK_ID === '1') return;

        addNotification({
            type: 'warning',
            message: 'Using a different network than mainnet!',
        });
    }, [process.env.REACT_APP_NETWORK_ID]);

    return (
        <div className="App">
            <Notifications notifications={notifications} />
            <header>
                Invoice splitter
            </header>

            <main>
                <Route
                    path="/new"
                    render={() => (walletConnected && ownerConnected
                        ? (
                            <OwnerView
                                createInvoice={onAddProject}
                                transactionStatus={addTransactionStatus}
                                onNotification={addNotification}
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
                                onNotification={addNotification}
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
            </main>
        </div>
    );
}

export default App;
