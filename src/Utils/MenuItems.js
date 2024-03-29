import AdminEmployees from "../Components/Admin/Employees/AdminEmployees";
import AdminPunches from "../Components/Admin/Punches/AdminPunches";
import AdminRequests from "../Components/Admin/Requests/AdminRequests";
import AdminSchedules from "../Components/Admin/Schedules/AdminSchedules";
import AdminShifts from "../Components/Admin/Shifts/AdminShifts";
import AdminSummary from "../Components/Admin/Summary/AdminSummary";

import EmployeeRequests from "../Components/Employee/Requests/EmployeeRequests";
import EmployeeSchedule from "../Components/Employee/Schedule/EmployeeSchedule";
import EmployeeSummary from "../Components/Employee/Summary/EmployeeSummary";

import HomeIcon from '@mui/icons-material/Home'; // summary icon
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // schedule icon
import PeopleIcon from '@mui/icons-material/People'; // employees icon
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // requests icon
import EditCalendarIcon from '@mui/icons-material/EditCalendar'; // shifts icon
import PunchClockIcon from '@mui/icons-material/PunchClock'; // punch icon

const AdminMenuItems = (props) => {
    return [
        {
            title: 'Summary',
            component: <AdminSummary/>,
            icon: <HomeIcon/>
        },
        {
            title: 'All Schedules',
            component: <AdminSchedules/>,
            icon: <CalendarMonthIcon/>
        },
        {
            title: 'Employees',
            component: <AdminEmployees/>,
            icon: <PeopleIcon/>
        },
        {
            title: 'Availability & Time Off Requests',
            component: <AdminRequests/>,
            icon: <EventAvailableIcon/>
        },
        {
            title: 'Shifts',
            component: <AdminShifts/>,
            icon: <EditCalendarIcon/>
        },
        {
            title: 'Punches',
            component: <AdminPunches/>,
            icon: <PunchClockIcon/>
        }
    ];
};

const EmployeeMenuItems = (props) => {
    return [
        {
            title: 'Summary',
            component: <EmployeeSummary/>,
            icon: <HomeIcon/>
        },
        {
            title: 'Schedule',
            component: <EmployeeSchedule/>,
            icon: <CalendarMonthIcon/>
        },
        {
            title: 'Availability & Time Off',
            component: <EmployeeRequests/>,
            icon: <EventAvailableIcon/>
        }
    ];
};

export {AdminMenuItems, EmployeeMenuItems}