import { createContext } from 'react';

type AuthConnected = {
    walletState: 'connected',
    role: AuthRole,
}
type AuthNotConnected = {
    walletState: 'disconnected',
}
type AuthState =
    | AuthConnected
    | AuthNotConnected;
type AuthRole = 'owner' | 'notOwner';

function getDefaultState(): AuthState {
    return {
        walletState: 'disconnected',
    };
}

export const authContext = createContext(getDefaultState());

// export function ProvideAuth({ children }) {
//     const auth = usePro