import { useContext } from 'react';

import { authContext } from '../providers/auth';

export function useAuth() {
    return useContext(authContext);
}
