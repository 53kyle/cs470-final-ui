import React, { useState, useEffect, Fragment } from 'react';
import API from '../../API_Interface/API_Interface';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const marketsTableAttributes = [
    {
        title: 'Market Name',
        attributeDBName: 'marketName',
        align: 'left'
    },
    {
        title: 'Market ID',
        attributeDBName: 'marketID',
        align: 'left'
    },
    {
        title: 'City',
        attributeDBName: 'city',
        align: 'left'
    },
    {
        title: 'State',
        attributeDBName: 'state',
        align: 'left'
    },
    {
        title: 'Date Created',
        attributeDBName: 'dateCreated',
        align: 'left'
    }
];

const MarketsTable = () => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const api = new API();
                const marketsJSONString = await api.allMarkets();
                setMarkets(marketsJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchMarkets();
    }, []);

    const renderTableRow = (marketObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {marketsTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {marketObject[attr.attributeDBName]}
                </TableCell>
            ))}
        </TableRow>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="markets table">
                    <TableHead>
                        <TableRow>
                            {marketsTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {markets.map((market, idx) => renderTableRow(market, idx))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default MarketsTable;
