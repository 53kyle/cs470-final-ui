import React, { useState, useEffect, Fragment } from 'react';
import API from '../../API_Interface/API_Interface';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const accountsTableAttributes = [
    {
        title: 'Account Name',
        attributeDBName: 'accountName',
        align: 'left'
    },
    {
        title: 'Account ID',
        attributeDBName: 'accountID',
        align: 'left'
    },
    {
        title: 'Route ID',
        attributeDBName: 'routeID',
        align: 'left'
    },
    {
        title: 'Market ID',
        attributeDBName: 'marketID',
        align: 'left'
    },
    {
        title: 'Date Created',
        attributeDBName: 'dateCreated',
        align: 'left'
    }
];

export default function AccountsTable(props) {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const api = new API();

        async function getAccounts() {
            const accountsJSONString = await api.allAccounts();
            console.log(`accounts from the DB ${JSON.stringify(accountsJSONString)}`);
            setAccounts(accountsJSONString.data);
        }

        getAccounts();
    }, []);

    const TRow = ({ accountObject }) => {
        return (
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {accountsTableAttributes.map((attr, idx) => (
                    <TableCell key={idx} align={attr.align}>
                        {accountObject[attr.attributeDBName]}
                    </TableCell>
                ))}
            </TableRow>
        );
    };

    return (
        <Fragment>
            {accounts.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="accounts table">
                        <TableHead>
                            <TableRow>
                                {accountsTableAttributes.map((attr, idx) => (
                                    <TableCell key={idx} align={attr.align}>
                                        {attr.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((account, idx) => (
                                <TRow accountObject={account} key={idx} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Fragment>
    );
}