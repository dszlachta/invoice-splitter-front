import React from 'react';

import Result from './Result';

type AddProjectSuccessProps = {
    projectId: string,
}
export function AddProjectSuccess({ projectId }: AddProjectSuccessProps) {
    return (
        <Result
            status="success"
            title="New project has been created"
        >
            Payment link (send it to the client):
            <div>
                {window.location.origin}
                /pay/
                {projectId}
            </div>
        </Result>
    );
}
