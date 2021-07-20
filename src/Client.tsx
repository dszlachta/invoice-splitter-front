import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';

import Result from './Result';

import {
    GetProjectDue,
    IsProjectPaid,
    PayProjectOptions,
} from './logic/contract';
import {
    NotificationData,
} from './logic/notification';

import {
    TransactionStatus,
} from './transaction_status';

import './Client.css';

type ClientProps = {
    onPay: (options: PayProjectOptions) => Promise<void>,
    getProjectDue: GetProjectDue,
    isProjectPaid: IsProjectPaid,
    transactionStatus: TransactionStatus<boolean>,
    onNotification: (notification: NotificationData) => void,
}
export default function Client({
    onPay,
    getProjectDue,
    isProjectPaid,
    transactionStatus,
    onNotification,
}: ClientProps) {
    const { projectId } = useParams<{ projectId: string }>();
    const [due, setDue] = useState('0');
    const [alreadyPaid, setAlreadyPaid] = useState(false);
    const { fromWei } = Web3.utils;

    useEffect(() => {
        if (transactionStatus.status === 'success') return;

        if (transactionStatus.status === 'failed') {
            onNotification({
                type: 'error',
                message: `Error while paying: ${transactionStatus.reason}`,
            });

            return;
        }

        (async () => {
            try {
                const paid = await isProjectPaid({ projectId });

                if (paid) {
                    setAlreadyPaid(true);
                    return;
                }

                const projectDue = await getProjectDue({ projectId });
                setDue(projectDue);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [transactionStatus, projectId]);

    if (transactionStatus.status === 'success') {
        return (
            <Result
                status="success"
                title="Payment successful"
            >
                Thank you!
            </Result>
        );
    }

    if (transactionStatus.status === 'pristine' && alreadyPaid) {
        return (
            <Result
                status="success"
                title="Already paid"
            >
                You have already paid for this project, thank you!
            </Result>
        );
    }

    return (
        <section>
            <h1>Pay project</h1>

            <table className="payment-details">
                <tbody>
                    <tr>
                        <th>
                            Project ID
                        </th>
                        <td>
                            <code>{projectId}</code>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Due
                        </th>
                        <td>
                            {fromWei(due)}
                            &nbsp;
                            ETH
                        </td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={() => onPay({ projectId, amount: due })}>
                Pay&nbsp;
                {fromWei(due)}
                &nbsp;
                ETH
            </button>
        </section>
    );
}
