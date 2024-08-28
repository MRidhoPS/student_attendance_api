const userModels = require('../model/user_model');
const dbpool = require('../database/database_config')

const loginUserAccount = async (req, res, next) => {
    // Cek apakah req.body ada
    if (!req.body) {
        return res.status(400).json({
            message: 'Bad Request',
            error: 'Request body is missing.'
        });
    }

    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({
            message: 'Bad Request',
            error: 'Username and password are required.'
        });
    }

    try {
        // Panggil fungsi login dari userModels
        const result = await userModels.loginUser(username, password);

        // Cek hasil login
        if (result.success) {
            res.status(200).json({
                message: result.message,
                user: result.user // Mengembalikan ID pengguna dan informasi lainnya
            });
        } else {
            res.status(401).json({
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message || error
        });
    }
};

const getUserData = async (req, res, next) => {

    try {
        const [data] = await userModels.getUsers()

        if (!data || data.length === 0) {
            return res.status(200).json({
                message: 'Data Belum ada',
            });
        }

        res.status(200).json({
            message: 'Get Data Success',
            data: data,
        })


    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error,
        })
    }
}
const CheckAttendance = async (student_id, date) => {
    try {
        const sqlQuery = `
            SELECT * FROM attendance
            WHERE student_id = ? AND date = ?
        `;

        const [rows] = await dbpool.execute(sqlQuery, [student_id, date]);
        return rows.length > 0 ? true : false;
    } catch (error) {
        console.error('Error checking attendance:', error);
        throw error;
    }
};

const addAttendanceStatus = async (req, res) => {
    console.log(req.body);
    const { student_id, date, status } = req.body;

    // Validasi input
    if (!student_id || !date || !status) {
        return res.status(400).json({
            message: 'Bad Request',
            error: 'student_id, date, and status are required.'
        });
    }

    try {
        // Cek apakah attendance sudah ada pada tanggal yang sama
        const existingAttendance = await CheckAttendance(student_id, date);

        if (existingAttendance) {
            return res.status(409).json({
                message: 'Attendance already exists for this date'
            });
        }

        // Tambahkan atau perbarui data attendance
        const result = await userModels.AddAttendance(student_id, date, status);

        if (result.success) {
            res.status(200).json({
                message: result.message
            });
        } else {
            res.status(500).json({
                message: 'Failed to add attendance',
                error: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message || error
        });
    }
};

const getDataByDate = async (req, res) => {
    const { date } = req.params; // Mengambil tanggal dari URL parameter

    // Validasi input tanggal
    if (!date) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: 'Date parameter is required.',
        });
    }

    try {
        // Query database dengan tanggal sebagai parameter
        const [rows] = await dbpool.execute(
            'SELECT students.name, students.nim, attendance.status FROM students INNER JOIN attendance ON students.id = attendance.student_id WHERE attendance.date = ?',
            [date]
        );

        // Menangani hasil query
        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                data: rows,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No attendance data found for the given date.',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message || error,
        });
    }
};




module.exports = {
    loginUserAccount,
    getUserData,
    addAttendanceStatus,
    // getDatabyDate,
    getDataByDate,
};
