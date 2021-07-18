export type Shareholder = {
    address: string,
    percentage: string
}

const requiredMessage = 'This field is required';
export const totalInputValidation = {
    required: requiredMessage,
};
export const addressInputValidation = {
    required: requiredMessage,
    pattern: {
        value: /^0x[A-z0-9]{40}/,
        message: 'Addresses start 0x and have 42 characters',
    },
};
export const percentageInputValidation = {
    required: requiredMessage,
    validate: (value: number) => ((value > 0 && value < 100) || 'Incorrect value'),
};

export function getShareholdersAndShares(shareholders: Shareholder[]): [string[], number[]] {
    const [addresses, shares] = shareholders
        .reduce<[string[], number[]]>((tuples, current) => (
            [
                [
                    ...tuples[0],
                    current.address,
                ],
                [
                    ...tuples[1],
                    parseInt(current.percentage, 10),
                ],
            ]), [[], []]);

    return [
        addresses,
        shares,
    ];
}

export function validateShares(allShares: number[]) {
    const sharesTotal = allShares
        .reduce((total, share) => total + share, 0);

    return sharesTotal === 100;
}
