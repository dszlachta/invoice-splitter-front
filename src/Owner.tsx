import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
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
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'shareholders',
    });
    const [percentageInvalid, setPercentageInvalid] = useState(false);
    const addRow = () => {
        append({
            address: '',
            percentage: '',
        });
    };
    const deleteRow = (index: number) => {
        remove(index);
    };

    useEffect(() => {
        if (fields.length) return;

        addRow();
    }, []);

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
    const createErrorMessage = (name: string, className: string) => (
        <ErrorMessage
            errors={errors}
            name={name}
            as={<p className={`error-message ${className}`} />}
        />
    );

    return (
        <section className="owner-view">
            <p>
                New invoice
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="total-wrapper">
                    Request
                    <input
                        className="total"
                        type="number"
                        placeholder="Total due ETH"
                        step="any"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('total', totalInputValidation)}
                    />
                    ETH
                </div>
                {createErrorMessage('total', 'total')}

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

                {fields.map((field, index) => (
                    <div
                        key={field.id}
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
                            disabled={fields.length < 2}
                            onClick={() => deleteRow(index)}
                        >
                            Remove
                        </button>
                        {createErrorMessage(`shareholders.${index}.address`, 'address')}
                        {createErrorMessage(`shareholders.${index}.percentage`, 'percentage')}
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
