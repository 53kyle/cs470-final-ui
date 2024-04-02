const sampleEmployees = () => {
    return [
        {
            id: 0,
            first_name: "Chris",
            last_name: "Johnson",
            position: "Produce Clerk"
        },
        {
            id: 1,
            first_name: "Jack",
            last_name: "Mauro-Brown",
            position: "Produce Clerk"
        },
        {
            id: 2,
            first_name: "Jose",
            last_name: "Avalos",
            position: "Produce Clerk"
        },
        {
            id: 3,
            first_name: "Kyle",
            last_name: "Pallo",
            position: "Produce Team Lead"
        },
        {
            id: 4,
            first_name: "Ryan",
            last_name: "Capurro",
            position: "Produce Clerk"
        },
        {
            id: 5,
            first_name: "Zachary",
            last_name: "Britton",
            position: "Assistant Produce Team Lead"
        }
    ];
}

const simpleSampleSchedule = (currentWeek) => {
    return currentWeek.map((date, idx) => ({
        date: date,
        start_time: idx > 1 ? 6 : -1,
        end_time: idx > 1 ? 15 : -1,
        meal_time: idx > 1 ? 10 : -1,
        meal_length: idx > 1 ? 1 : 0,
        position: "Produce Team Lead"
    }))
};

const complexSampleSchedule = (currentWeek) => {
    return [
        {
            employee_id: 0,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: 10,
                    end_time: 14,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[1],
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[2],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[3],
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[4],
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[5],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[6],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            employee_id: 1,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[1],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[2],
                    start_time: 17,
                    end_time: 21,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[3],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[4],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[5],
                    start_time: 10,
                    end_time: 19,
                    meal_time: 14,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[6],
                    start_time: 10,
                    end_time: 19,
                    meal_time: 14,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            employee_id: 2,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[1],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[2],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[3],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[4],
                    start_time: 10,
                    end_time: 14,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[5],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[6],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            employee_id: 3,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[1],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[2],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[3],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[4],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[5],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    date: currentWeek[6],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                }
            ]
        },
        {
            employee_id: 4,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[1],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[2],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[3],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[4],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[5],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    date: currentWeek[6],
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            employee_id: 5,
            schedule: [
                {
                    date: currentWeek[0],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[1],
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[2],
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[3],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[4],
                    start_time: -1,
                    end_time: -1,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[5],
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    date: currentWeek[6],
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                }
            ]
        }
    ];
};

const sampleShifts = (currentWeek) => {
    return [
        {
            date: currentWeek[0],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 10,
                    end_time: 14,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[1],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[2],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 17,
                    end_time: 21,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[3],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[4],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 9,
                    end_time: 18,
                    meal_time: 13,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 10,
                    end_time: 14,
                    meal_time: -1,
                    meal_length: 0,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[5],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 10,
                    end_time: 19,
                    meal_time: 14,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        },
        {
            date: currentWeek[6],
            shifts: [
                {
                    employee_id: -1,
                    start_time: 6,
                    end_time: 15,
                    meal_time: 10,
                    meal_length: 1,
                    position: "Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 8,
                    end_time: 17,
                    meal_time: 12,
                    meal_length: 1,
                    position: "Assistant Produce Team Lead"
                },
                {
                    employee_id: -1,
                    start_time: 10,
                    end_time: 19,
                    meal_time: 14,
                    meal_length: 1,
                    position: "Produce Clerk"
                },
                {
                    employee_id: -1,
                    start_time: 12,
                    end_time: 21,
                    meal_time: 16,
                    meal_length: 1,
                    position: "Produce Clerk"
                }
            ]
        }
    ];
};

export default {
    sampleEmployees: sampleEmployees,
    simpleSampleSchedule: simpleSampleSchedule,
    complexSampleSchedule: complexSampleSchedule,
    sampleShifts: sampleShifts
}