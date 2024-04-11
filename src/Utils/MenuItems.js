import AdminEmployees from "../Components/Admin/Employees/AdminEmployees";
import AdminPunches from "../Components/Admin/Punches/AdminPunches";
import AdminRequests from "../Components/Admin/Requests/AdminRequests";
import AdminSchedules from "../Components/Admin/Schedules/AdminSchedules";
import AdminShifts from "../Components/Admin/Shifts/AdminShifts";
import AdminSummary from "../Components/Admin/Summary/AdminSummary";

import EmployeeRequests from "../Components/Employee/Requests/EmployeeRequests";
import EmployeeSchedule from "../Components/Employee/Schedule/EmployeeSchedule";
import EmployeeSummary from "../Components/Employee/Summary/EmployeeSummary";

import { FcCalendar } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcClock } from "react-icons/fc";
import { FcOvertime } from "react-icons/fc";
import { FcConferenceCall } from "react-icons/fc";
import { FcDataSheet } from "react-icons/fc"


const AdminMenuItems = (props) => {
    return [
        {
            title: 'Summary',
            component: <AdminSummary/>,
            icon: <FcHome size="30px"/>
        },
        {
            title: 'All Schedules',
            component: <AdminSchedules />,
            icon: <FcCalendar size="30px"/>
        },
        {
            title: 'Employees',
            component: <AdminEmployees/>,
            icon: <FcConferenceCall size="30px"/>
        },
        {
            title: 'Availability & Time Off Requests',
            component: <AdminRequests/>,
            icon: <FcOvertime size="30px"/>
        },
        {
            title: 'Shifts',
            component: <AdminShifts/>,
            icon: <FcDataSheet size="30px"/>
        },
        {
            title: 'Punches',
            component: <AdminPunches/>,
            icon: <FcClock size="30px"/>
        }
    ];
};

const EmployeeMenuItems = (props) => {
    return [
        {
            title: 'Summary',
            component: <EmployeeSummary/>,
            icon: <FcHome size="30px"/>
        },
        {
            title: 'Schedule',
            component: <EmployeeSchedule/>,
            icon: <FcCalendar size="30px"/>,
        },
        {
            title: 'Availability & Time Off',
            component: <EmployeeRequests/>,
            icon: <FcOvertime size="30px"/>
        }
    ];
};

export {AdminMenuItems, EmployeeMenuItems}