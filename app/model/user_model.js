const dbpool = require('../database/database_config');

const loginUser = async (username, password) => {
    try {
        const sqlQuery = 'SELECT * FROM teachers WHERE username = ?';
        const [rows] = await dbpool.execute(sqlQuery, [username]);

        if (rows.length === 0) {
            // Pengguna tidak ditemukan
            return { success: false, message: 'User not found' };
        }

        const user = rows[0];

        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            }
        };
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Lempar ulang kesalahan agar bisa ditangani di handler
    }
};



const getUsers = () => {
    const SQLQUERY = 'SELECT * from students'

    return dbpool.execute(SQLQUERY);

}

const AddAttendance = async (student_id, date, status) => {


    try {
        const checkQuery = `
            SELECT * FROM attendance
            WHERE student_id = ? AND date = ?
        `;
        const [existingRecords] = await dbpool.execute(checkQuery, [student_id, date]);

        if (existingRecords.length > 0) {
            return { success: false, message: 'Attendance already exists for this date' };
        }

        const sqlQuery = `
            INSERT INTO attendance (student_id, date, status)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                status = VALUES(status);
        `;

        const [result] = await dbpool.execute(sqlQuery, [student_id, date, status]);

        if (result.affectedRows > 0) {
            return { success: true, message: 'Attendance added successfully' };
        } else {
            return { success: false, message: 'No rows affected' };
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
    }
};

const getStudentAttendanceByDate = (date) => {
    const SQLQUERY = `
        SELECT students.name, students.nim, attendance.status
        FROM students 
        INNER JOIN attendance ON students.id = attendance.student_id
        WHERE DATE(attendance.date) = ?
    `;

    return dbpool.execute(SQLQUERY, [date]);
};


module.exports = {
    loginUser,
    getUsers,
    AddAttendance, getStudentAttendanceByDate
};
