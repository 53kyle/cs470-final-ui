import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    axios.defaults.baseURL = `http://localhost:8443/api/v1`;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


//    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

export default class APIInterface {

    async getUserInfo(user_id) {
        return axiosAgent.get(`login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                 }));
    }

    async summaryQ() {
        return axiosAgent.get(`summary/projectSummary`);
    }

    async allRoutes() {
        return axiosAgent.get(`routes/all-routes`);
    }

    async routesWithID(routeID) {
        return axiosAgent.get(`routes/${routeID}`);
    }

    async allAccounts() {
        return axiosAgent.get(`accounts/all-accounts`);
    }

    async accountsWithAccountID(accountID) {
        return axiosAgent.get(`accounts/${accountID}`);
    }

    async allMarkets() {
        return axiosAgent.get(`markets/all-markets`);
    }

    async marketWithID(marketID) {
        return axiosAgent.get(`markets/${marketID}`);
    }

    async allTransactions() {
        return axiosAgent.get(`transactions/all-transactions`);
    }
    
    async transactionWithID(transactionID) {
        return axiosAgent.get(`transactions/${transactionID}`);
    }

    async transactionsByAccount() {
        return axiosAgent.get(`transactions/account`);
    }
    
    async transactionsByMarket() {
        return axiosAgent.get(`transactions/market`);
    }
    
    async transactionsByEmployee() {
        return axiosAgent.get(`transactions/employee`);
    }
    
    async transactionsByRoute() {
        return axiosAgent.get(`transactions/route`);
    }

    async transactionByAccountID(accountID) {
        return axiosAgent.get(`transactions/account/ID/${accountID}`);
    }
    
    async transactionByMarketID(marketID) {
        return axiosAgent.get(`transactions/market/${marketID}`);
    }
    
    async transactionByEmployeeID(employeeID) {
        return axiosAgent.get(`transactions/employee/${employeeID}`);
    }
    
    async transactionByRouteID(routeID) {
        return axiosAgent.get(`transactions/route/${routeID}`);
    }

}