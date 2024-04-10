import React, { useState, useEffect, Fragment } from 'react';
import API from '../../API_Interface/API_Interface';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const baseTable = [
    {
        title: 'Transaction ID',
        attributeDBName: 'transactionID',
        align: 'left'
    },
    {
        title: 'Employee ID',
        attributeDBName: 'employeeID',
        align: 'left'
    },
    {
        title: 'Account ID',
        attributeDBName: 'accountID',
        align: 'left'
    },
    {
        title: 'Product ID',
        attributeDBName: 'productID',
        align: 'left'
    },
    {
        title: 'Market ID',
        attributeDBName: 'marketID',
        align: 'left'
    },
    {
        title: 'Route ID',
        attributeDBName: 'routeID',
        align: 'left'
    },
    {
        title: 'Transaction Date',
        attributeDBName: 'transactionDate',
        align: 'left'
    }
];

let transactionsTableAttributes = baseTable;
const api = new API();
let testTrans;

const TransactionsTable = () => {
    
    const [transactions, setTransactions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All Transactions');

    const setTable = () => {
        transactionsTableAttributes = [...baseTable];
        const moveAttributeToFront = (title) => {
            const index = transactionsTableAttributes.findIndex(item => item.title === title);
            if (index !== -1) {
                const removedElement = transactionsTableAttributes.splice(index, 1)[0];
                transactionsTableAttributes.unshift(removedElement);
            }
        };
    
        switch (selectedFilter) {
            case 'Accounts':
                moveAttributeToFront('Account ID');
                break;
            case 'Markets':
                moveAttributeToFront('Market ID');
                break;
            case 'Employees':
                moveAttributeToFront('Employee ID');
                break;
            case 'Routes':
                moveAttributeToFront('Route ID');
                break;
            default:
                transactionsTableAttributes = baseTable;
                break;
        }
    };

    useEffect(() => {
        let transactionsJSONString;
        setTable();
        async function getTransactions() {
            if (selectedFilter === 'All Transactions') {
                transactionsJSONString = await api.allTransactions();
            } else if (selectedFilter === 'Accounts') {
                transactionsJSONString = await api.transactionsByAccount();
            } else if (selectedFilter === 'Markets') {
                transactionsJSONString = await api.transactionsByMarket();
            } else if (selectedFilter === 'Employees') {
                transactionsJSONString = await api.transactionsByEmployee();
            } else if (selectedFilter === 'Routes') {
                transactionsJSONString = await api.transactionsByRoute();
            }
            console.log(`Transactions from the DB ${JSON.stringify(transactionsJSONString)}`);
            setTransactions(transactionsJSONString.data);
        }

        getTransactions();
    }, [selectedFilter]);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value); //Update selected filter when dropdown value changes
    };

    const fetchTransactionsByFilter = async (id) => {
        let transactionsJSONString;
        if (selectedFilter === 'Accounts') {
            transactionsJSONString = await api.transactionByAccountID(id);
        } else if (selectedFilter === 'Markets') {
            transactionsJSONString = await api.transactionByMarketID(id);
        } else if (selectedFilter === 'Employees') {
            transactionsJSONString = await api.transactionByEmployeeID(id);
        } else if (selectedFilter === 'Routes') {
            transactionsJSONString = await api.transactionByRouteID(id);
        }
        console.log(`Additional Transactions from the DB ${JSON.stringify(transactionsJSONString)}`);
        return transactionsJSONString.data;
    };

    const TRow = ({ transactionObject }) => {
        const [expanded, setExpanded] = useState(false);
        const [additionalTransactions, setAdditionalTransactions] = useState([]);

        const handleRowClick = async () => {
            if (!expanded) {
                setExpanded(true);
                const transactionsData = await fetchTransactionsByFilter(transactionObject[transactionsTableAttributes[0].attributeDBName]);
                setAdditionalTransactions(transactionsData);
            }
            else
            {
                setExpanded(!expanded);
            }
        };
    
        return (
            <>
            <TableRow onClick={handleRowClick} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {transactionsTableAttributes.map((attr, idx) => (
                    <TableCell key={idx} align={attr.align}>
                        {selectedFilter !== "All Transactions" && idx === 0 && (expanded ? <ExpandLessIcon style={{ color: 'blue' }} /> : <ExpandMoreIcon style={{ color: 'blue' }} />)}
                        {transactionObject[attr.attributeDBName]}
                    </TableCell>
                ))}
            </TableRow>
            {expanded && transactions.length > 0 && additionalTransactions.length > 0 && (
                <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="additional transactions table">
                    <TableHead>
                        <TableRow>
                            {baseTable.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {additionalTransactions.map((transaction, idx) => (
                            <TableRow key={idx}>
                                {baseTable.map((attr, idx) => (
                                    <TableCell key={idx} align={attr.align}>
                                        {transaction[attr.attributeDBName]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
        </>
        );
    };

    return (
        <Fragment>
            <div style={{ marginBottom: '10px' }}>
                <select value={selectedFilter} onChange={handleFilterChange} 
                style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '200px'
        }}>
                    <option value="All Transactions">All Transactions</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Markets">Markets</option>
                    <option value="Employees">Employees</option>
                    <option value="Routes">Routes</option>
                </select>
            </div>
            {transactions.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                        <TableHead>
                            <TableRow>
                                {transactionsTableAttributes.map((attr, idx) => (
                                    <TableCell key={idx} align={attr.align}>
                                        {attr.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction, idx) => (
                                <TRow transactionObject={transaction} key={idx} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Fragment>
    );
};

export default TransactionsTable;
