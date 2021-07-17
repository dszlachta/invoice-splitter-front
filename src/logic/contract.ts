import Web3 from 'web3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbiItem } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';

import ContractAbi from '../abi/InvoiceSplitter.json';

type Address = string;
export function getContract(web3: Web3, from: Address) {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    if (!contractAddress) throw new Error('Contract address missing');

    return new web3.eth.Contract(
        ContractAbi as AbiItem[],
        contractAddress,
        {
            from,
        },
    );
}

export type AddProjectOptions = {
    total: string,
    shareholders: string[],
    shares: number[],
};
export function createAddProject(web3: Web3, contract: Contract) {
    const { toBN, toWei } = web3.utils;

    return function addProject(options: AddProjectOptions) {
        const { total, shareholders, shares } = options;

        return contract.methods.addProject(
            toWei(total),
            shareholders,
            shares.map((share) => toBN(share)),
        ).send();
    };
}

export type IsProjectPaid = ({ projectId }: { projectId: string }) => Promise<boolean>;
export function createIsProjectPaid(web3: Web3, contract: Contract) {
    const { toBN } = web3.utils;

    const isProjectPaid: IsProjectPaid = ({ projectId }) => contract
        .methods.isProjectPaid(
            toBN(projectId),
        ).call();

    return isProjectPaid;
}

export type GetProjectDueOptions = {
    projectId: string,
};
export type GetProjectDue = (options: GetProjectDueOptions) => Promise<string>;
export function createGetProjectDue(web3: Web3, contract: Contract) {
    const { toBN } = web3.utils;

    const getProjectDue: GetProjectDue = ({ projectId }: GetProjectDueOptions) => contract
        .methods.getProjectDueAmount(
            toBN(projectId),
        ).call();

    return getProjectDue;
}

export type PayProjectOptions = {
    projectId: string,
    amount: string,
};
export function createPayProject(web3: Web3, contract: Contract) {
    const { toBN } = web3.utils;

    return function payProject({ projectId, amount }: PayProjectOptions) {
        return contract.methods.payProject(
            toBN(projectId),
        ).send({ value: amount });
    };
}
