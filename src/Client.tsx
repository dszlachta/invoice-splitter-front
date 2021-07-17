import { notification, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';

import {
    GetProjectDue,
    IsProjectPaid,
    PayProjectOptions,
} from './logic/contract';

import {
    TransactionStatus,
} from './transaction_status';

type ClientProps = {
    // projectDue: string,
    // projectId: string,
    onPay: (options: PayProjectOptions) => Promise<void>,
    getProjectDue: GetProjectDue,
    isProjectPaid: IsProjectPaid,
    transactionStatus: TransactionStatus,
}
export default function Client({
    onPay,
    getProjectDue,
    isProjectPaid,
    transactionStatus,
}: ClientProps) {
    const { projectId } = useParams<{ projectId: string }>();
    const [due, setDue] = useState('0');
    const [alreadyPaid, setAlreadyPaid] = useState(false);
    const { fromWei } = Web3.utils;

    useEffect(() => {
        if (transactionStatus.status === 'success') return;

        if (transactionStatus.status === 'failed') {
            notification.error({
                message: 'Error',
                description: `Error while paying: ${transactionStatus.reason}`,
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
                title="Paid. Thank you"
            />
        );
    }

    if (transactionStatus.status === 'pristine' && alreadyPaid) {
        return (
            <Result
                status="success"
                title="Already paid"
                subTitle="You have already paid for this project, thank you!"
            />
        );
    }

    return (
        <section>
            <h1>Pay project</h1>
            <span>
                projectId:
                {projectId}
            </span>

            <div>
                Due:
                <span>
                    ETH &nbsp;
                    {fromWei(due)}
                </span>
            </div>

            <button type="button" onClick={() => onPay({ projectId, amount: due })}>
                Pay ETH &nbsp;
                {fromWei(due)}
            </button>
        </section>
    );
}
