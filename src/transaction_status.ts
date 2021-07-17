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
type SuccessfulTransactionStatus = {
    status: 'success',
    payload: Record<string, unknown>,
};

export type TransactionStatus =
    | PristineTransactionStatus
    | PendingTransactionStatus
    | FailedTransactionStatus
    | SuccessfulTransactionStatus;
