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

    async nextShiftForEmployee(employee_id){
        return axiosAgent.get(`shifts/employee/${employee_id}/next`);
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

    async lastPunchForEmployee(employee_id) {
        return axiosAgent.get(`punchin/last-punch/${employee_id}`);
    }

    async allTimeoffRequests()
    {
        return axiosAgent.get(`employees/all-requests/timeoff`);
    }

    async allAvailabilityRequests()
    {
        return axiosAgent.get(`employees/all-requests/availability`);
    }

    async timeOffRequestByID(employee_id) {
        return axiosAgent.get(`employees/requests/time-off/${employee_id}`);
    }

    async availabilityRequestsByID(employee_id) {
        return axiosAgent.get(`employees/requests/availability/${employee_id}`);
    }

    async updateEmployee(employeeData) {
            return axiosAgent.put(`employees/update`, employeeData);
    }

    async updateShift(employee_id, shift_id) {
        return axiosAgent.put(`shifts/update/${employee_id}/${shift_id}`);
    }

    async postShift(shift_id) {
        return axiosAgent.put(`shifts/post/${shift_id}`);
    }

    async employeesTrainedInShift(shift_id) {
        return axiosAgent.get(`employees/trained/${shift_id}`);
    }

    async employeesAvailableForShift(shift_id) {
        return axiosAgent.get(`employees/available/${shift_id}`);
    }

    async employeeHoursInRange(start_date, end_date) {
        return axiosAgent.get(`employees/hours/${start_date}/${end_date}`);
    }

    async employeeShiftsInRange(start_date, end_date) {
        return axiosAgent.get(`employees/shifts/${start_date}/${end_date}`);
    }

    async employeeCountByShift(start_date, end_date) {
        return axiosAgent.get(`shifts/generator/${start_date}/${end_date}`);
    }

    async availabilityTimeOffPendingCount() {
        return axiosAgent.get(`notifications/pending-count`);
    }

    async punchInPendingCount() {
        return axiosAgent.get(`notifications/punch-pending-count`);
    }
    
    async deleteEmployee(employee_id) {
        return axiosAgent.delete(`employees/delete/${employee_id}`);
    }

    async fetchAvailabilityByID(employee_id) {
        return axiosAgent.get(`employees/availability/${employee_id}`);
    }

    async setPunchApproved( employee_id, punchin)
    {
        return axiosAgent.put(`punchin/set-approved/${employee_id}/${punchin}`);
    }

    async setPunchDenied( employee_id, punchin)
    {
        return axiosAgent.put(`punchin/set-denied/${employee_id}/${punchin}`);
    }

    async getNotificationsForEmployee(employee_id) {
        return axiosAgent.get(`notifications/all-notifications/${employee_id}`);
    }

    async setNotificationsReadForEmployee(employee_id) {
        return axiosAgent.put(`notifications/set-notifications-read/${employee_id}`)
    }

    async addShift(shiftData){
        return axiosAgent.post(`shifts/add-shift`, shiftData);
    }

    async editShift(shiftData){
        return axiosAgent.put(`shifts/edit-shift`, shiftData);
    }

    async deleteShift(shift_id){
        return axiosAgent.delete(`shifts/delete-shift/${shift_id}`);
    }

    async getTrained() {
        return axiosAgent.get(`shifts/trained-departments`);
    }
}