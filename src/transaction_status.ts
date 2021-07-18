type PristineTransactionStatus = {
    status: 'pristine',
};
type PendingTransactionStatus = {
    status: 'pending',
};
type FailedTransactionStatus = {
    status: 'failed',
    reason: Error,
}
type SuccessfulTransactionStatus<PayloadValue> = {
    status: 'success',
    payload: Record<string, PayloadValue>,
};

export type TransactionStatus<SuccessPayloadValue> =
    | PristineTransactionStatus
    | PendingTransactionStatus
    | FailedTransactionStatus
    | SuccessfulTransactionStatus<SuccessPayloadValue>;
