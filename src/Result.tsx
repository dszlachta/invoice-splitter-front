import React, { ReactNode } from 'react';

type ResultProps = {
    status: 'success' | 'failure',
    title: string,
    children: ReactNode,
}

const statusToIcon = new Map([
    ['success', '👍'],
    ['failure', '👎'],
]);

export default function Result({ status, title, children }: ResultProps) {
    return (
        <section className="result">
            <header>
                <h1>
                    <span>
                        {statusToIcon.get(status)}
                    </span>

                    {title}
                </h1>
            </header>
            {children}
        </section>
    );
}
