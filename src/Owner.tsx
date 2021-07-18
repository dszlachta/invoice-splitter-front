import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { AddProjectOptions } from './logic/contract';
import {
    getShareholdersAndShares,
    validateShares,
    Shareholder,
    totalInputValidation,
    addressInputValidation,
    percentageInputValidation,
} from './logic/add_project_form';
import {
    NotificationData,
} from './logic/notification';
import { TransactionStatus } from './transaction_status';
import { AddProjectSuccess } from './AddProjectSuccess';

import './Owner.css';

type FormValues = {
    total: string,
    shareholders: Shareholder[],
};

function OwnerView(
    {
        createInvoice,
        transactionStatus,
        onNotification,
    }: {
        createInvoice: (options: AddProjectOptions) => void,
        transactionStatus: TransactionStatus<string>,
        onNotification: (notification: NotificationData) => void,
    },
) {
    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [inputs, setInputs] = useState([`0${Date.now()}`]);
    const [percentageInvalid, setPercentageInvalid] = useState(false);

    useEffect(() => {
        if (transactionStatus.status !== 'failed') return;

        onNotification({
            type: 'error',
            message: 'Adding the project has failed',
        });
    }, [transactionStatus]);

    if (transactionStatus.status === 'success') {
        return (
            <AddProjectSuccess projectId={transactionStatus.payload.projectId} />
        );
    }

    const addRow = () => setInputs([
        ...inputs,
        `${inputs.length - 1}${Date.now()}`,
    ]);
    const deleteRow = (rowId: string) => setInputs(
        inputs.filter((someId) => someId !== rowId),
    );
    const onSubmit: SubmitHandler<FormValues> = (formData) => {
        const [shareholders, shares] = getShareholdersAndShares(formData.shareholders);

        if (!validateShares(shares)) {
            setPercentageInvalid(true);
            return;
        }

        setPercentageInvalid(false);

        createInvoice({
            total: formData.total,
            shareholders,
            shares,
        });
    };
    const createErrorMessage = (name: string) => (
        <ErrorMessage
            errors={errors}
            name={name}
            as={<p className="error-message" />}
        />
    );

    return (
        <section className="owner-view">
            Create new invoice

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="total-wrapper">
                    Requesting
                    <input
                        className="total"
                        type="number"
                        placeholder="Total due ETH"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('total', totalInputValidation)}
                    />
                    ETH
                </div>
                {createErrorMessage('total')}

                <p>
                    and forward payment to:
                </p>

                {percentageInvalid && (
                    <p
                        className="error-message"
                    >
                        Shares should equal 100 in total
                    </p>
                )}

                {inputs.map((inputId, index) => (
                    <div
                        key={inputId}
                        className="form-row"
                    >
                        <input
                            className="address"
                            placeholder="Wallet address"
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...register(`shareholders.${index}.address`, addressInputValidation)}
                        />
                        <input
                            className="percentage"
                            type="number"
                            placeholder="%"
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...register(`shareholders.${index}.percentage`, percentageInputValidation)}
                        />
                        <button
                            type="button"
                            disabled={inputs.length < 2}
                            onClick={() => { unregister(`shareholders.${index}`); deleteRow(inputId); }}
                        >
                            Remove
                        </button>
                        {createErrorMessage(`shareholders.${index}.address`)}
                        {createErrorMessage(`shareholders.${index}.percentage`)}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addRow()}
                >
                    Add another
                </button>

                <div>
                    <button
                        type="submit"
                        className="primary"
                    >
                        Save
                    </button>
                </div>
            </form>
        </section>
    );
}

export default OwnerView;
