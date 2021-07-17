import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';

function StartView(
    {
        ownerConnected,
        userConnected,
        onConnect,
    }
    : {
        ownerConnected: boolean,
        userConnected: boolean,
        onConnect: () => void
    },
) {
    const whenOwner = (
        <div>
            <Link to={{ pathname: '/new' }}>
                Add new invoice
            </Link>
        </div>
    );

    const whenUser = (
        <div>
            Please use the link provided to pay for the invoice.
        </div>
    );

    if (ownerConnected) return whenOwner;

    if (userConnected) return whenUser;

    return <WalletConnect onConnect={onConnect} />;
}

export default StartView;
