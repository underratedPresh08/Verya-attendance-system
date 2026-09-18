/* =====================================================
   VEYRA — JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       STORAGE HELPERS
       ================================================= */

    function getStaff() {
        return JSON.parse(
            localStorage.getItem("veyraStaff")
        ) || [];
    }


    function saveStaff(staff) {
        localStorage.setItem(
            "veyraStaff",
            JSON.stringify(staff)
        );
    }


    function getAttendance() {
        return JSON.parse(
            localStorage.getItem("veyraAttendance")
        ) || [];
    }


    function saveAttendance(records) {
        localStorage.setItem(
            "veyraAttendance",
            JSON.stringify(records)
        );
    }


    function getLoggedInStaffId() {
        return localStorage.getItem(
            "veyraLoggedInStaffId"
        );
    }


    function getLoggedInStaff() {
        const staffId = getLoggedInStaffId();

        if (!staffId) return null;

        return getStaff().find(
            staff => staff.staffId === staffId
        ) || null;
    }


    /* =================================================
       PAGE ACCESS PROTECTION
       ================================================= */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const staffPages = [
        "staff-dashboard.html",
        "attendance.html",
        "history.html",
        "setting.html"
    ];


    const adminPages = [
        "admin-dashboard.html",
        "admin-staff.html",
        "admin-attendance.html",
        "admin-reports.html",
        "admin-settings.html"
    ];


    const staffLoggedIn =
        !!localStorage.getItem(
            "veyraLoggedInStaffId"
        );


    const adminLoggedIn =
        localStorage.getItem(
            "veyraAdminLoggedIn"
        ) === "true";


    if (
        staffPages.includes(currentPage) &&
        !staffLoggedIn
    ) {

        window.location.href =
            "login.html";

        return;
    }


    if (
        adminPages.includes(currentPage) &&
        !adminLoggedIn
    ) {

        window.location.href =
            "login.html";

        return;
    }


    if (
        currentPage === "staff-login.html" &&
        staffLoggedIn
    ) {

        window.location.href =
            "staff-dashboard.html";

        return;
    }


    if (
        currentPage === "admin-login.html" &&
        adminLoggedIn
    ) {

        window.location.href =
            "admin-dashboard.html";

        return;
    }


    /* =================================================
       DATE / TIME HELPERS
       ================================================= */

    function getToday() {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function formatDate(dateString) {
        if (!dateString) return "-";

        const date = new Date(
            dateString + "T00:00:00"
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }


    function formatTime(timestamp) {
        if (!timestamp) return "-";

        return new Date(
            timestamp
        ).toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function calculateHours(
        clockIn,
        clockOut
    ) {
        if (!clockIn) return "0h 00m";

        const end =
            clockOut || Date.now();

        const minutes = Math.max(
            0,
            Math.floor(
                (end - clockIn) / 60000
            )
        );

        const hours =
            Math.floor(minutes / 60);

        const mins =
            minutes % 60;

        return `${hours}h ${String(
            mins
        ).padStart(2, "0")}m`;
    }


    function getAttendanceForToday(
        staffId
    ) {
        return getAttendance().find(
            record =>
                record.staffId === staffId &&
                record.date === getToday()
        ) || null;
    }


    function getRequiredWorkHours() {
        return Number(
            localStorage.getItem(
                "veyraWorkHours"
            )
        ) || 8;
    }


    function getRequiredWorkMinutes() {
        return getRequiredWorkHours() * 60;
    }


    /* =================================================
       CURRENT DATE
       ================================================= */

    function displayCurrentDate(
        elementId
    ) {
        const element =
            document.getElementById(
                elementId
            );

        if (!element) return;

        element.textContent =
            new Date().toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );
    }


    displayCurrentDate("currentDate");
    displayCurrentDate("adminCurrentDate");
    displayCurrentDate("attendanceCurrentDate");
    displayCurrentDate("reportsCurrentDate");
    displayCurrentDate("settingsCurrentDate");


    /* =================================================
       STAFF LOGIN
       ================================================= */

    const staffLoginForm =
        document.getElementById(
            "staffLoginForm"
        );


    if (staffLoginForm) {

        staffLoginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const staffId =
                    document
                        .getElementById("staffId")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById(
                            "staffPassword"
                        )
                        .value;

                const loginMessage =
                    document.getElementById(
                        "loginMessage"
                    );


                const staff =
                    getStaff().find(
                        person =>
                            person.staffId ===
                                staffId &&
                            person.password ===
                                password
                    );


                if (!staff) {

                    loginMessage.textContent =
                        "Incorrect Staff ID or password.";

                    loginMessage.style.color =
                        "#dc2626";

                    return;
                }


                localStorage.setItem(
                    "veyraLoggedInStaffId",
                    staff.staffId
                );


                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "#16a34a";


                setTimeout(function () {

                    window.location.href =
                        "staff-dashboard.html";

                }, 700);

            }
        );

    }


    /* =================================================
       ADMIN LOGIN
       ================================================= */

    const adminLoginForm =
        document.getElementById(
            "adminLoginForm"
        );


    if (adminLoginForm) {

        adminLoginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const adminId =
                    document
                        .getElementById(
                            "adminId"
                        )
                        .value
                        .trim();

                const password =
                    document
                        .getElementById(
                            "adminPassword"
                        )
                        .value;

                const adminLoginMessage =
                    document.getElementById(
                        "adminLoginMessage"
                    );


                const savedAdminPassword =
                    localStorage.getItem(
                        "veyraAdminPassword"
                    ) || "123456";


                if (
                    adminId === "ADMIN-001" &&
                    password === savedAdminPassword
                ) {

                    localStorage.setItem(
                        "veyraAdminLoggedIn",
                        "true"
                    );


                    adminLoginMessage.textContent =
                        "Login successful!";

                    adminLoginMessage.style.color =
                        "#16a34a";


                    setTimeout(function () {

                        window.location.href =
                            "admin-dashboard.html";

                    }, 700);

                } else {

                    adminLoginMessage.textContent =
                        "Incorrect Admin ID or password.";

                    adminLoginMessage.style.color =
                        "#dc2626";

                }

            }
        );

    }


    /* =================================================
       STAFF DASHBOARD — GREETING
       ================================================= */

    const loggedInStaff =
        getLoggedInStaff();


    const dashboardHeading =
        document.getElementById(
            "greetingText"
        );


    if (
        dashboardHeading &&
        loggedInStaff
    ) {

        const firstName =
            loggedInStaff.fullName
                .split(" ")[0];


        const hour =
            new Date().getHours();


        let greeting = "Good morning";


        if (hour >= 12 && hour < 17) {

            greeting =
                "Good afternoon";

        } else if (hour >= 17) {

            greeting =
                "Good evening";

        }


        dashboardHeading.textContent =
            `${greeting}, ${firstName}`;

    }


    /* =================================================
       STAFF DASHBOARD — CURRENT TIME
       ================================================= */

    const currentTime =
        document.getElementById(
            "currentTime"
        );


    function updateCurrentTime() {

        if (!currentTime) return;

        currentTime.textContent =
            new Date().toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }


    if (currentTime) {

        updateCurrentTime();

        setInterval(
            updateCurrentTime,
            1000
        );

    }


    /* =================================================
       STAFF DASHBOARD — ATTENDANCE ELEMENTS
       ================================================= */

    const clockInButton =
        document.getElementById(
            "clockInButton"
        );

    const clockOutButton =
        document.getElementById(
            "clockOutButton"
        );

    const clockMessage =
        document.getElementById(
            "clockMessage"
        );

    const hoursWorkedElement =
        document.getElementById(
            "hoursWorked"
        );

    const workProgress =
        document.getElementById(
            "workProgress"
        );

    const workProgressText =
        document.getElementById(
            "workProgressText"
        );

    const requiredWorkHoursText =
        document.getElementById(
            "requiredWorkHoursText"
        );


    function updateStatus(
        text,
        color
    ) {

        const status =
            document.querySelector(
                ".attendance-info h2 span"
            );

        if (!status) return;

        status.textContent =
            text;

        status.style.color =
            color;

    }


    /* =================================================
       STAFF DASHBOARD — STATS
       ================================================= */

    function updateDashboardStats() {

        const staff =
            getLoggedInStaff();


        if (!staff) return;


        const records =
            getAttendance().filter(
                record =>
                    record.staffId ===
                    staff.staffId
            );


        const daysPresentElement =
            document.getElementById(
                "daysPresent"
            );


        const lateDaysElement =
            document.getElementById(
                "lateDays"
            );


        const attendanceRateElement =
            document.getElementById(
                "attendanceRate"
            );


        const daysPresent =
            records.filter(
                record =>
                    record.status === "Present" ||
                    record.status === "Late"
            ).length;


        const lateDays =
            records.filter(
                record =>
                    record.status === "Late"
            ).length;


        /*
           Since the prototype only stores days
           on which attendance was recorded,
           the attendance rate represents the
           percentage of recorded attendance days
           that were successfully attended.
        */

        const attendanceRate =
            records.length
                ? Math.round(
                    (daysPresent /
                        records.length) *
                    100
                )
                : 0;


        if (daysPresentElement) {

            daysPresentElement.textContent =
                daysPresent;

        }


        if (lateDaysElement) {

            lateDaysElement.textContent =
                lateDays;

        }


        if (attendanceRateElement) {

            attendanceRateElement.textContent =
                `${attendanceRate}%`;

        }

    }


    /* =================================================
       STAFF DASHBOARD — RECENT ACTIVITY
       ================================================= */

    function updateDashboardHistory() {

        const rows =
            document.getElementById(
                "recentActivityRows"
            );


        if (!rows) return;


        const staff =
            getLoggedInStaff();


        if (!staff) return;


        const records =
            getAttendance()
                .filter(
                    record =>
                        record.staffId ===
                        staff.staffId
                )
                .sort(
                    (a, b) =>
                        b.date.localeCompare(
                            a.date
                        )
                )
                .slice(0, 5);


        if (!records.length) {

            rows.innerHTML = `
                <div class="table-row">
                    <span colspan="5">
                        No attendance history yet.
                    </span>
                </div>
            `;

            return;
        }


        rows.innerHTML =
            records.map(
                record => `
                    <div class="table-row">

                        <span>
                            ${formatDate(
                                record.date
                            )}
                        </span>

                        <span>
                            ${formatTime(
                                record.clockIn
                            )}
                        </span>

                        <span>
                            ${formatTime(
                                record.clockOut
                            )}
                        </span>

                        <span>
                            ${calculateHours(
                                record.clockIn,
                                record.clockOut
                            )}
                        </span>

                        <span>
                            ${record.status}
                        </span>

                    </div>
                `
            ).join("");

    }


    /* =================================================
       STAFF DASHBOARD — ATTENDANCE
       ================================================= */

    function updateAttendanceDisplay() {

        if (!clockInButton) return;


        const staff =
            getLoggedInStaff();


        if (!staff) {

            clockInButton.disabled =
                true;

            if (clockMessage) {

                clockMessage.textContent =
                    "Please log in as a staff member.";

            }

            return;
        }


        const record =
            getAttendanceForToday(
                staff.staffId
            );


        const requiredHours =
            getRequiredWorkHours();

        const requiredMinutes =
            getRequiredWorkMinutes();


        if (requiredWorkHoursText) {

            requiredWorkHoursText.textContent =
                `${requiredHours} ${
                    requiredHours === 1
                        ? "hour"
                        : "hours"
                }`;

        }


        /* ==========================
           NO RECORD
           ========================== */

        if (!record) {

            clockInButton.disabled =
                false;

            clockInButton.textContent =
                "Clock In";


            if (clockOutButton) {

                clockOutButton.disabled =
                    true;

                clockOutButton.textContent =
                    "Clock Out";

            }


            if (hoursWorkedElement) {

                hoursWorkedElement.textContent =
                    "0h 00m";

            }


            if (workProgress) {

                workProgress.style.width =
                    "0%";

            }


            if (workProgressText) {

                workProgressText.textContent =
                    `0h 00m / ${requiredHours}h`;

            }


            if (clockMessage) {

                clockMessage.textContent =
                    "You have not started today's shift.";

            }


            updateStatus(
                "Not Clocked In",
                "#77798a"
            );

            return;
        }


        /* ==========================
           CLOCKED OUT
           ========================== */

        if (record.clockOut) {

            clockInButton.disabled =
                true;

            clockInButton.textContent =
                "Clocked In";


            if (clockOutButton) {

                clockOutButton.disabled =
                    true;

                clockOutButton.textContent =
                    "Clocked Out";

            }


            const worked =
                calculateHours(
                    record.clockIn,
                    record.clockOut
                );


            if (hoursWorkedElement) {

                hoursWorkedElement.textContent =
                    worked;

            }


            if (workProgress) {

                workProgress.style.width =
                    "100%";

            }


            if (workProgressText) {

                workProgressText.textContent =
                    `${worked} / ${requiredHours}h`;

            }


            if (clockMessage) {

                clockMessage.textContent =
                    "Your workday has been completed.";

            }


            updateStatus(
                "Clocked Out",
                "#6366f1"
            );

            return;
        }


        /* ==========================
           CLOCKED IN
           ========================== */

        clockInButton.disabled =
            true;

        clockInButton.textContent =
            "Clocked In";


        const elapsed =
            Date.now() -
            record.clockIn;


        const totalMinutes =
            Math.floor(
                elapsed / 60000
            );


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            totalMinutes % 60;


        const formattedWorked =
            `${hours}h ${String(
                minutes
            ).padStart(2, "0")}m`;


        if (hoursWorkedElement) {

            hoursWorkedElement.textContent =
                formattedWorked;

        }


        const progress =
            Math.min(
                (totalMinutes /
                    requiredMinutes) *
                100,
                100
            );


        if (workProgress) {

            workProgress.style.width =
                `${progress}%`;

        }


        if (workProgressText) {

            workProgressText.textContent =
                `${formattedWorked} / ${requiredHours}h`;

        }


        if (clockOutButton) {

            if (
                totalMinutes >=
                requiredMinutes
            ) {

                clockOutButton.disabled =
                    false;

                clockOutButton.textContent =
                    "Clock Out";


                if (clockMessage) {

                    clockMessage.textContent =
                        `You have completed ${requiredHours} hours. You can now clock out.`;

                }

            } else {

                clockOutButton.disabled =
                    true;

                const remaining =
                    requiredMinutes -
                    totalMinutes;


                const remainingHours =
                    Math.floor(
                        remaining / 60
                    );


                const remainingMinutes =
                    remaining % 60;


                if (clockMessage) {

                    clockMessage.textContent =
                        `Clock Out available in ${remainingHours}h ${String(
                            remainingMinutes
                        ).padStart(
                            2,
                            "0"
                        )}m.`;

                }

            }

        }


        updateStatus(
            "Clocked In",
            "#16a34a"
        );

    }


    /* =================================================
       CLOCK IN
       ================================================= */

    if (clockInButton) {

        clockInButton.addEventListener(
            "click",
            function () {

                const staff =
                    getLoggedInStaff();


                if (!staff) {

                    if (clockMessage) {

                        clockMessage.textContent =
                            "Please log in first.";

                    }

                    return;

                }


                const existing =
                    getAttendanceForToday(
                        staff.staffId
                    );


                if (existing) return;


                const now =
                    Date.now();


                const startTime =
                    localStorage.getItem(
                        "veyraWorkStartTime"
                    ) || "08:00";


                const [startHour, startMinute] =
                    startTime
                        .split(":")
                        .map(Number);


                const current =
                    new Date();


                const start =
                    new Date();


                start.setHours(
                    startHour,
                    startMinute,
                    0,
                    0
                );


                const late =
                    current.getTime() >
                    start.getTime();


                const record = {

                    staffId:
                        staff.staffId,

                    staffName:
                        staff.fullName,

                    department:
                        staff.department,

                    date:
                        getToday(),

                    clockIn:
                        now,

                    clockOut:
                        null,

                    status:
                        late
                            ? "Late"
                            : "Present"

                };


                const records =
                    getAttendance();


                records.push(record);

                saveAttendance(records);


                updateAttendanceDisplay();
                updateDashboardStats();
                updateDashboardHistory();
                updateStaffAttendancePage();
                updateStaffHistory();
                updateAdminDashboard();
                updateAdminAttendancePage();
                updateReports();

            }
        );

    }


    /* =================================================
       CLOCK OUT
       ================================================= */

    if (clockOutButton) {

        clockOutButton.addEventListener(
            "click",
            function () {

                const staff =
                    getLoggedInStaff();


                if (!staff) return;


                const records =
                    getAttendance();


                const index =
                    records.findIndex(
                        record =>
                            record.staffId ===
                                staff.staffId &&
                            record.date ===
                                getToday()
                    );


                if (index === -1) return;


                const record =
                    records[index];


                if (!record.clockIn) return;


                const workedMinutes =
                    Math.floor(
                        (
                            Date.now() -
                            record.clockIn
                        ) / 60000
                    );


                const requiredMinutes =
                    getRequiredWorkMinutes();


                const requiredHours =
                    getRequiredWorkHours();


                if (
                    workedMinutes <
                    requiredMinutes
                ) {

                    if (clockMessage) {

                        clockMessage.textContent =
                            `You must complete ${requiredHours} hours before clocking out.`;

                    }

                    return;

                }


                record.clockOut =
                    Date.now();


                records[index] =
                    record;


                saveAttendance(
                    records
                );


                updateAttendanceDisplay();
                updateDashboardStats();
                updateDashboardHistory();
                updateStaffAttendancePage();
                updateStaffHistory();
                updateAdminDashboard();
                updateAdminAttendancePage();
                updateReports();

            }
        );

    }


    if (clockInButton) {

        updateAttendanceDisplay();
        updateDashboardStats();
        updateDashboardHistory();

        setInterval(
            function () {

                updateAttendanceDisplay();
                updateDashboardStats();
                updateDashboardHistory();

            },
            1000
        );

    }


    /* =================================================
       STAFF ATTENDANCE PAGE
       ================================================= */

    function updateStaffAttendancePage() {

        const statusElement =
            document.getElementById(
                "attendanceStatus"
            );


        if (!statusElement) return;


        const staff =
            getLoggedInStaff();


        if (!staff) return;


        const record =
            getAttendanceForToday(
                staff.staffId
            );


        const timeElement =
            document.getElementById(
                "attendanceCurrentTime"
            );


        const clockInElement =
            document.getElementById(
                "attendanceClockIn"
            );


        const clockOutElement =
            document.getElementById(
                "attendanceClockOut"
            );


        const messageElement =
            document.getElementById(
                "attendanceMessage"
            );


        if (timeElement) {

            timeElement.textContent =
                new Date().toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );

        }


        if (!record) {

            statusElement.textContent =
                "Not Clocked In";

            if (clockInElement)
                clockInElement.textContent =
                    "-";

            if (clockOutElement)
                clockOutElement.textContent =
                    "-";

            if (messageElement)
                messageElement.textContent =
                    "You have not started today's shift.";

            return;
        }


        statusElement.textContent =
            record.status;


        if (clockInElement)
            clockInElement.textContent =
                formatTime(
                    record.clockIn
                );


        if (clockOutElement)
            clockOutElement.textContent =
                formatTime(
                    record.clockOut
                );


        if (messageElement) {

            messageElement.textContent =
                record.clockOut
                    ? "Today's attendance has been completed."
                    : "You are currently clocked in.";

        }

    }


    updateStaffAttendancePage();


    setInterval(
        updateStaffAttendancePage,
        1000
    );


    /* =================================================
       STAFF HISTORY
       ================================================= */

    function updateStaffHistory() {

        const tableBody =
            document.getElementById(
                "staffHistoryTableBody"
            );


        if (!tableBody) return;


        const staff =
            getLoggedInStaff();


        if (!staff) return;


        const records =
            getAttendance()
                .filter(
                    record =>
                        record.staffId ===
                        staff.staffId
                )
                .sort(
                    (a, b) =>
                        b.date.localeCompare(
                            a.date
                        )
                );


        const daysPresent =
            document.getElementById(
                "historyDaysPresent"
            );


        const daysLate =
            document.getElementById(
                "historyDaysLate"
            );


        const hoursWorked =
            document.getElementById(
                "historyHoursWorked"
            );


        const totalRecords =
            document.getElementById(
                "historyTotalRecords"
            );


        if (daysPresent) {

            daysPresent.textContent =
                records.filter(
                    record =>
                        record.status ===
                            "Present" ||
                        record.status ===
                            "Late"
                ).length;

        }


        if (daysLate) {

            daysLate.textContent =
                records.filter(
                    record =>
                        record.status ===
                        "Late"
                ).length;

        }


        if (totalRecords) {

            totalRecords.textContent =
                records.length;

        }


        let totalMinutes = 0;


        records.forEach(
            record => {

                if (
                    record.clockIn &&
                    record.clockOut
                ) {

                    totalMinutes +=
                        Math.floor(
                            (
                                record.clockOut -
                                record.clockIn
                            ) / 60000
                        );

                }

            }
        );


        if (hoursWorked) {

            const hours =
                Math.floor(
                    totalMinutes / 60
                );

            const minutes =
                totalMinutes % 60;


            hoursWorked.textContent =
                `${hours}h ${String(
                    minutes
                ).padStart(
                    2,
                    "0"
                )}m`;

        }


        if (!records.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No attendance history yet.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            records.map(
                record => `
                    <tr>
                        <td>
                            ${formatDate(
                                record.date
                            )}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockIn
                            )}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockOut
                            )}
                        </td>

                        <td>
                            ${calculateHours(
                                record.clockIn,
                                record.clockOut
                            )}
                        </td>

                        <td>
                            ${record.status}
                        </td>
                    </tr>
                `
            ).join("");

    }


    updateStaffHistory();


    /* =================================================
       STAFF REGISTRATION — ADMIN
       ================================================= */

    const staffRegistrationForm =
        document.getElementById(
            "staffRegistrationForm"
        );


    if (staffRegistrationForm) {

        staffRegistrationForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const fullName =
                    document.getElementById(
                        "staffFullName"
                    ).value.trim();


                const staffId =
                    document.getElementById(
                        "newStaffId"
                    ).value.trim();


                const department =
                    document.getElementById(
                        "staffDepartment"
                    ).value;


                const role =
                    document.getElementById(
                        "staffRole"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "newStaffPassword"
                    ).value;


                const message =
                    document.getElementById(
                        "staffRegistrationMessage"
                    );


                if (
                    !fullName ||
                    !staffId ||
                    !department ||
                    !role ||
                    !password
                ) {

                    message.textContent =
                        "Please complete all fields.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                const staff =
                    getStaff();


                const exists = staff.some(
                    person =>
                        String(person.staffId || "")
                            .trim()
                            .toLowerCase() ===
                        String(staffId || "")
                            .trim()
                            .toLowerCase()
                );


                if (exists) {

                    message.textContent =
                        "That Staff ID is already registered.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                staff.push({

                    fullName:
                        fullName,

                    staffId:
                        staffId,

                    department:
                        department,

                    role:
                        role,

                    password:
                        password

                });


                saveStaff(staff);


                message.textContent =
                    "Staff member registered successfully.";

                message.style.color =
                    "#16a34a";


                staffRegistrationForm.reset();


                displayStaff();

                updateAdminDashboard();

            }
        );

    }


    /* =================================================
       DISPLAY REGISTERED STAFF
       ================================================= */

    function displayStaff() {

        const tableBody =
            document.getElementById(
                "staffTableBody"
            );


        if (!tableBody) return;


        const staff =
            getStaff();


        const count =
            document.getElementById(
                "staffCount"
            );


        if (count) {

            count.textContent =
                `${staff.length} ${
                    staff.length === 1
                        ? "staff member"
                        : "staff members"
                }`;

        }


        if (!staff.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No staff members registered yet.
                    </td>
                </tr>
            `;

            return;

        }


        tableBody.innerHTML =
            staff.map(
                person => `
                    <tr>
                        <td>
                            ${person.fullName}
                        </td>

                        <td>
                            ${person.staffId}
                        </td>

                        <td>
                            ${person.department}
                        </td>

                        <td>
                            ${person.role}
                        </td>

                        <td>
                            Active
                        </td>

                        <td>
                            <button
                                type="button"
                                class="staff-action-button"
                                data-staff-id="${person.staffId}"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                `
            ).join("");


        document
            .querySelectorAll(
                ".staff-action-button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            const staffId =
                                this.dataset.staffId;


                            const confirmed =
                                confirm(
                                    "Are you sure you want to delete this staff member?"
                                );


                            if (!confirmed)
                                return;


                            const updatedStaff =
                                getStaff().filter(
                                    person =>
                                        person.staffId !==
                                        staffId
                                );


                            saveStaff(
                                updatedStaff
                            );


                            displayStaff();

                            updateAdminDashboard();

                        }
                    );

                }
            );

    }


    displayStaff();


    /* =================================================
       ADMIN DASHBOARD
       ================================================= */

    function updateAdminDashboard() {

        const totalStaffElement =
            document.getElementById(
                "totalStaff"
            );


        if (!totalStaffElement)
            return;


        const staff =
            getStaff();


        const records =
            getAttendance();


        const today =
            getToday();


        const todayRecords =
            records.filter(
                record =>
                    record.date === today
            );


        const present =
            todayRecords.filter(
                record =>
                    record.status ===
                    "Present"
            ).length;


        const late =
            todayRecords.filter(
                record =>
                    record.status ===
                    "Late"
            ).length;


        const absent =
            Math.max(
                staff.length -
                todayRecords.length,
                0
            );


        totalStaffElement.textContent =
            staff.length;


        const presentElement =
            document.getElementById(
                "presentToday"
            );


        const absentElement =
            document.getElementById(
                "absentToday"
            );


        const lateElement =
            document.getElementById(
                "lateToday"
            );


        if (presentElement)
            presentElement.textContent =
                present;


        if (absentElement)
            absentElement.textContent =
                absent;


        if (lateElement)
            lateElement.textContent =
                late;


        const table =
            document.getElementById(
                "adminAttendanceTable"
            );


        if (!table) return;


        if (!todayRecords.length) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        No attendance records for today.
                    </td>
                </tr>
            `;

            return;

        }


        table.innerHTML =
            todayRecords.map(
                record => `
                    <tr>
                        <td>
                            ${record.staffName}
                        </td>

                        <td>
                            ${record.staffId}
                        </td>

                        <td>
                            ${record.department}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockIn
                            )}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockOut
                            )}
                        </td>

                        <td>
                            ${record.status}
                        </td>
                    </tr>
                `
            ).join("");

    }


    updateAdminDashboard();


    /* =================================================
       ADMIN ATTENDANCE PAGE
       ================================================= */

    function updateAdminAttendancePage() {

        const table =
            document.getElementById(
                "adminAttendanceRecordsTable"
            );


        if (!table) return;


        const records =
            getAttendance().sort(
                (a, b) =>
                    b.date.localeCompare(
                        a.date
                    )
            );


        const total =
            document.getElementById(
                "attendanceTotalRecords"
            );


        const present =
            document.getElementById(
                "attendancePresent"
            );


        const late =
            document.getElementById(
                "attendanceLate"
            );


        const completed =
            document.getElementById(
                "attendanceCompleted"
            );


        if (total)
            total.textContent =
                records.length;


        if (present)
            present.textContent =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


        if (late)
            late.textContent =
                records.filter(
                    record =>
                        record.status ===
                        "Late"
                ).length;


        if (completed)
            completed.textContent =
                records.filter(
                    record =>
                        record.clockOut
                ).length;


        if (!records.length) {

            table.innerHTML = `
                <tr>
                    <td colspan="7">
                        No attendance records yet.
                    </td>
                </tr>
            `;

            return;

        }


        table.innerHTML =
            records.map(
                record => `
                    <tr>

                        <td>
                            ${record.staffName}
                        </td>

                        <td>
                            ${record.staffId}
                        </td>

                        <td>
                            ${record.department}
                        </td>

                        <td>
                            ${formatDate(
                                record.date
                            )}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockIn
                            )}
                        </td>

                        <td>
                            ${formatTime(
                                record.clockOut
                            )}
                        </td>

                        <td>
                            ${record.status}
                        </td>

                    </tr>
                `
            ).join("");

    }


    updateAdminAttendancePage();


    /* =================================================
       ADMIN REPORTS
       ================================================= */

    function updateReports() {

        const table =
            document.getElementById(
                "reportsTableBody"
            );


        if (!table) return;


        const staff =
            getStaff();


        const records =
            getAttendance();


        const totalStaff =
            document.getElementById(
                "reportTotalStaff"
            );


        const totalRecords =
            document.getElementById(
                "reportTotalRecords"
            );


        const presentRecords =
            document.getElementById(
                "reportPresentRecords"
            );


        const lateRecords =
            document.getElementById(
                "reportLateRecords"
            );


        if (totalStaff)
            totalStaff.textContent =
                staff.length;


        if (totalRecords)
            totalRecords.textContent =
                records.length;


        if (presentRecords)
            presentRecords.textContent =
                records.filter(
                    record =>
                        record.status ===
                        "Present"
                ).length;


        if (lateRecords)
            lateRecords.textContent =
                records.filter(
                    record =>
                        record.status ===
                        "Late"
                ).length;


        if (!staff.length) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No staff members registered yet.
                    </td>
                </tr>
            `;

            return;

        }


        table.innerHTML =
            staff.map(
                person => {

                    const personRecords =
                        records.filter(
                            record =>
                                record.staffId ===
                                person.staffId
                        );


                    const daysPresent =
                        personRecords.filter(
                            record =>
                                record.status ===
                                    "Present" ||
                                record.status ===
                                    "Late"
                        ).length;


                    const lateDays =
                        personRecords.filter(
                            record =>
                                record.status ===
                                "Late"
                        ).length;


                    return `
                        <tr>

                            <td>
                                ${person.fullName}
                            </td>

                            <td>
                                ${person.staffId}
                            </td>

                            <td>
                                ${person.department}
                            </td>

                            <td>
                                ${daysPresent}
                            </td>

                            <td>
                                ${lateDays}
                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    updateReports();


    /* =================================================
       STAFF SETTINGS — PROFILE
       ================================================= */

    const profileName =
        document.getElementById(
            "staffProfileName"
        );


    const profileId =
        document.getElementById(
            "staffProfileId"
        );


    const profileDepartment =
        document.getElementById(
            "staffProfileDepartment"
        );


    const profileRole =
        document.getElementById(
            "staffProfileRole"
        );


    if (profileName) {

        const staff =
            getLoggedInStaff();


        if (staff) {

            profileName.textContent =
                staff.fullName;

            if (profileId)
                profileId.textContent =
                    staff.staffId;

            if (profileDepartment)
                profileDepartment.textContent =
                    staff.department;

            if (profileRole)
                profileRole.textContent =
                    staff.role;

        } else {

            profileName.textContent =
                "Not logged in";

        }

    }


    /* =================================================
       STAFF SETTINGS — CHANGE PASSWORD
       ================================================= */

    const staffPasswordForm =
        document.getElementById(
            "staffPasswordForm"
        );


    if (staffPasswordForm) {

        staffPasswordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const staff =
                    getLoggedInStaff();


                const message =
                    document.getElementById(
                        "staffPasswordMessage"
                    );


                if (!staff) {

                    message.textContent =
                        "You are not logged in.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                const currentPassword =
                    document.getElementById(
                        "currentStaffPassword"
                    ).value;


                const newPassword =
                    document.getElementById(
                        "newStaffPassword"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "confirmStaffPassword"
                    ).value;


                if (
                    currentPassword !==
                    staff.password
                ) {

                    message.textContent =
                        "Current password is incorrect.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    message.textContent =
                        "New passwords do not match.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                if (
                    newPassword.length < 6
                ) {

                    message.textContent =
                        "Password must be at least 6 characters.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                const staffList =
                    getStaff();


                const index =
                    staffList.findIndex(
                        person =>
                            person.staffId ===
                            staff.staffId
                    );


                if (index === -1) return;


                staffList[index].password =
                    newPassword;


                saveStaff(
                    staffList
                );


                message.textContent =
                    "Password changed successfully.";

                message.style.color =
                    "#16a34a";


                staffPasswordForm.reset();

            }
        );

    }


    /* =================================================
       STAFF SETTINGS — THEME
       ================================================= */

    const staffThemeLight =
        document.getElementById(
            "staffThemeLight"
        );


    const staffThemeDark =
        document.getElementById(
            "staffThemeDark"
        );


    function applyStaffTheme(
        theme
    ) {

        document.body.classList.toggle(
            "dark-theme",
            theme === "dark"
        );


        localStorage.setItem(
            "veyraStaffTheme",
            theme
        );

    }


    const savedStaffTheme =
        localStorage.getItem(
            "veyraStaffTheme"
        ) || "light";


    if (staffThemeLight) {

        staffThemeLight.checked =
            savedStaffTheme === "light";


        staffThemeLight.addEventListener(
            "change",
            function () {

                if (this.checked) {

                    applyStaffTheme(
                        "light"
                    );

                }

            }
        );

    }


    if (staffThemeDark) {

        staffThemeDark.checked =
            savedStaffTheme === "dark";


        staffThemeDark.addEventListener(
            "change",
            function () {

                if (this.checked) {

                    applyStaffTheme(
                        "dark"
                    );

                }

            }
        );

    }


    applyStaffTheme(
        savedStaffTheme
    );


    /* =================================================
       ADMIN SETTINGS — PROFILE
       ================================================= */

    const saveAdminProfile =
        document.getElementById(
            "saveAdminProfile"
        );


    if (saveAdminProfile) {

        saveAdminProfile.addEventListener(
            "click",
            function () {

                const name =
                    document.getElementById(
                        "adminName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "adminEmail"
                    ).value.trim();


                localStorage.setItem(
                    "veyraAdminProfile",
                    JSON.stringify({
                        name: name,
                        email: email
                    })
                );


                const message =
                    document.getElementById(
                        "adminProfileMessage"
                    );


                if (message) {

                    message.textContent =
                        "Profile saved successfully.";

                    message.style.color =
                        "#16a34a";

                }

            }
        );

    }


    /* =================================================
       ADMIN SETTINGS — ATTENDANCE RULES
       ================================================= */

    const saveAttendanceSettings =
        document.getElementById(
            "saveAttendanceSettings"
        );


    if (saveAttendanceSettings) {

        saveAttendanceSettings.addEventListener(
            "click",
            function () {

                const startTime =
                    document.getElementById(
                        "workStartTime"
                    ).value;


                const workHours =
                    Number(
                        document.getElementById(
                            "workHours"
                        ).value
                    );


                const safeWorkHours =
                    Math.min(
                        Math.max(
                            workHours || 8,
                            1
                        ),
                        24
                    );


                localStorage.setItem(
                    "veyraWorkStartTime",
                    startTime
                );


                localStorage.setItem(
                    "veyraWorkHours",
                    safeWorkHours
                );


                const message =
                    document.getElementById(
                        "attendanceSettingsMessage"
                    );


                if (message) {

                    message.textContent =
                        "Attendance settings saved.";

                    message.style.color =
                        "#16a34a";

                }


                updateAttendanceDisplay();
                updateDashboardHistory();

            }
        );

    }


    /* =================================================
       ADMIN SETTINGS — CHANGE PASSWORD
       ================================================= */

    const changeAdminPassword =
        document.getElementById(
            "changeAdminPassword"
        );


    if (changeAdminPassword) {

        changeAdminPassword.addEventListener(
            "click",
            function () {

                const currentPassword =
                    document.getElementById(
                        "currentAdminPassword"
                    ).value;


                const newPassword =
                    document.getElementById(
                        "newAdminPassword"
                    ).value;


                const message =
                    document.getElementById(
                        "adminPasswordMessage"
                    );


                const savedAdminPassword =
                    localStorage.getItem(
                        "veyraAdminPassword"
                    ) || "123456";


                if (
                    currentPassword !==
                    savedAdminPassword
                ) {

                    message.textContent =
                        "Current password is incorrect.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                if (
                    newPassword.length < 6
                ) {

                    message.textContent =
                        "Password must be at least 6 characters.";

                    message.style.color =
                        "#dc2626";

                    return;

                }


                localStorage.setItem(
                    "veyraAdminPassword",
                    newPassword
                );


                message.textContent =
                    "Admin password changed successfully.";

                message.style.color =
                    "#16a34a";

            }
        );

    }


    /* =================================================
       LOAD ADMIN SETTINGS
       ================================================= */

    const savedAdminProfile =
        JSON.parse(
            localStorage.getItem(
                "veyraAdminProfile"
            )
        );


    if (savedAdminProfile) {

        const adminName =
            document.getElementById(
                "adminName"
            );


        const adminEmail =
            document.getElementById(
                "adminEmail"
            );


        if (adminName)
            adminName.value =
                savedAdminProfile.name || "";


        if (adminEmail)
            adminEmail.value =
                savedAdminProfile.email || "";

    }


    /* =================================================
       LOAD ATTENDANCE SETTINGS
       ================================================= */

    const savedStartTime =
        localStorage.getItem(
            "veyraWorkStartTime"
        );


    const savedWorkHours =
        localStorage.getItem(
            "veyraWorkHours"
        );


    const workStartTime =
        document.getElementById(
            "workStartTime"
        );


    const workHours =
        document.getElementById(
            "workHours"
        );


    if (
        workStartTime &&
        savedStartTime
    ) {

        workStartTime.value =
            savedStartTime;

    }


    if (
        workHours &&
        savedWorkHours
    ) {

        workHours.value =
            savedWorkHours;

    }


    /* =================================================
       LOGOUT
       ================================================= */

    document
        .querySelectorAll(
            ".logout-link, .admin-logout"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function () {

                        localStorage.removeItem(
                            "veyraLoggedInStaffId"
                        );

                        localStorage.removeItem(
                            "veyraAdminLoggedIn"
                        );

                    }
                );

            }
        );


});