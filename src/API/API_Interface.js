import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://blue.cs.sonoma.edu:8100/api/v1`;
    axios.defaults.baseURL = `http://blue.cs.sonoma.edu:8100/api/v1`;


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

    async mainSummaryWithID(employee_id) {
        return axiosAgent.get(`summary/main/${employee_id}`);
    }

    async trainedSummaryWithID(employee_id) {
        return axiosAgent.get(`summary/trained/${employee_id}`);
    }

    async availabilitySummaryWithID(employee_id) {
        return axiosAgent.get(`summary/availability/${employee_id}`);
    }

    async requestsSummaryWithID(employee_id) {
        return axiosAgent.get(`summary/requests/${employee_id}`);
    }

    async shiftsInRange(start_date, end_date) {
        return axiosAgent.get(`shifts/all-shifts/${start_date}/${end_date}`);
    }

    async shiftsForEmployeeInRange(start_date, end_date, employee_id) {
        return axiosAgent.get(`shifts/employee/${employee_id}/${start_date}/${end_date}`);
    }

    async allEmployees() {
        return axiosAgent.get(`employees/all-employees`);
    }

    async allPunches()
    {
        return axiosAgent.get(`employees/all-punches`);
    }

    async allRequests()
    {
        return axiosAgent.get(`employees/all-requests`);
    }

    async timeOffRequestByID(employee_id) {
        return axiosAgent.get(`employees/requests/time-off/${employee_id}`);
    }

    async availabilityRequestsByID(employee_id) {
        return axiosAgent.get(`employees/requests/availability/${employee_id}`);
    }
}