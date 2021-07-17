import React from 'react';

type WalletConnectProps = {
    onConnect: () => void,
}
export default function WalletConnect({ onConnect }: WalletConnectProps) {
    return (
        <p>
            <button type="button" onClick={onConnect}>
                Connect wallet
            </button>
        </p>
    );
}
