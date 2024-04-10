import React, {useState, useEffect, Fragment} from 'react';
import API from '../../API_Interface/API_Interface'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const summaryTableAttributes = [
    {
        title: 'Account Name',
        attributeDBName: 'Account',
        align: 'left'
    },
    {
        title: 'Employee ID',
        attributeDBName: 'Employee',
        align: 'left'
    },
    {
        title: 'Market ID',
        attributeDBName: 'Market',
        align: 'left'
    },
    {
        title: 'Route ID',
        attributeDBName: 'Route',
        align: 'left'
    },
    {
        title: 'Number of Transactions',
        attributeDBName: 'Transactions',
        align: 'left'
    }
];

export default function SummaryTable(props) {


    const [summary, setSummary] = useState([]);
    console.log(`in summaryTable summary contains is ${JSON.stringify(summary)}`);


    useEffect(() => {
        const api = new API();

        async function getSummary() {
            const summaryJSONString = await api.summaryQ();
            console.log(`summary from the DB ${JSON.stringify(summaryJSONString)}`);
            setSummary(summaryJSONString.data);
        }

        getSummary();
    }, []);

    const TRow = ({routeObject}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                summaryTableAttributes.map((attr, idx) =>
                    <TableCell key={idx}
                               align={attr.align}>
                        {
                            routeObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }

    return <Fragment>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Draught Services!</p>
        <p>Draught Services aims to keep the data for your business secure and easy to access.
            Here is an example from our top clients.
        </p>
        {
            summary.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="summary table">
                        <TableHead>
                            <TableRow>
                                {
                                    summaryTableAttributes.map((attr, idx) =>
                                        <TableCell  key={idx}
                                                    align={attr.align}>
                                            {attr.title}
                                        </TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                summary.map((route, idx) => (
                                    <TRow routeObject={route} key={idx}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
    </Fragment>
}