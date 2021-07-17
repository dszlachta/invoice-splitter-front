import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    notification,
    Result,
} from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';

import { AddProjectOptions } from './logic/contract';
import { TransactionStatus } from './transaction_status';

export type SplitForm = {
    total: string,
    token: 'eth' | 'dai' | 'tusd',
    shareholders: Shareholder[],
};
export type Shareholder = {
    person: string,
    percentage: string
}

function OwnerView(
    {
        createInvoice,
        transactionStatus,
    }: {
        createInvoice: (options: AddProjectOptions) => void,
        transactionStatus: TransactionStatus
    },
) {
    const [percentageTotal, setPercentageTotal] = useState(0);

    useEffect(() => {
        if (transactionStatus.status !== 'failed') return;

        notification.error({
            message: 'Error',
            description: 'Adding the project has failed',
        });
    }, [transactionStatus]);

    const addressRules = [
        { required: true, message: 'Address is required' },
        { pattern: /^0x/, message: 'Address should start with \'0x\'' },
        { len: 42, message: 'Address should have 42 characters' },
    ];
    const percentageRules = [
        { required: true, message: 'Percentage is required' },
        {
            async validator(rule: unknown, value: string) {
                const valueAsNumber = parseInt(value, 10);

                if (valueAsNumber < 0 || valueAsNumber > 100) {
                    return Promise.reject(new Error('Percentage should be a value between 0-100'));
                }

                return Promise.resolve();
            },
        },
    ];
    const onFormChange = (...args: unknown[]) => console.log(args);
    const onFormFinish = (values: SplitForm) => {
        const [walletAddresses, shares] = values
            .shareholders
            .reduce<[string[], number[]]>((tuples, current) => (
                [
                    [
                        ...tuples[0],
                        current.person,
                    ],
                    [
                        ...tuples[1],
                        parseInt(current.percentage, 10),
                    ],
                ]), [[], []]);

        const t = shares.reduce((total, share) => total + share, 0);
        setPercentageTotal(t);

        if (t !== 100) {
            console.log('invalid percentage', percentageTotal);
        }

        createInvoice({
            total: values.total,
            shareholders: walletAddresses,
            shares,
        });
    };

    if (transactionStatus.status === 'success') {
        return (
            <Result
                status="success"
                title="New project has been created"
                subTitle={`Project ID is ${transactionStatus.payload.projectId}`}
            />
        );
    }

    return (
        <section>
            <h1>Owner</h1>

            <Form<SplitForm>
                onFinish={onFormFinish}
                onFinishFailed={() => console.log('Finish failed')}
                onChange={onFormChange}
            >
                <Form.Item
                    label="Total"
                >
                    <Input.Group compact>
                        <Form.Item
                            name="total"
                            hasFeedback
                            rules={[{ required: true, message: 'This field is required' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="token"
                        >
                            <Select>
                                <Select.Option value="eth">ETH</Select.Option>
                                <Select.Option value="dai">DAI</Select.Option>
                                <Select.Option value="tusd">TUSD</Select.Option>
                            </Select>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.List name="shareholders">
                    {(
                        fields: FormListFieldData[],
                        { add, remove }: FormListOperation,
                        { errors },
                    ) => (
                        <>
                            {fields.map((field) => (
                                <Input.Group
                                    compact
                                    key={field.key}
                                >
                                    <Form.Item
                                        name={[field.name, 'person']}
                                        required
                                        hasFeedback
                                        rules={addressRules}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'percentage']}
                                        required
                                        hasFeedback
                                        rules={percentageRules}
                                    >
                                        <Input
                                            type="number"
                                            required
                                        />
                                    </Form.Item>
                                    <Button
                                        onClick={() => remove(field.name)}
                                    >
                                        Remove
                                    </Button>
                                </Input.Group>
                            ))}
                            <Form.ErrorList errors={errors} />
                            <Button
                                onClick={() => add()}
                            >
                                Add another address
                            </Button>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
}

export default OwnerView;
