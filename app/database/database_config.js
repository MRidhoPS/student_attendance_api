const mysql = require('mysql2')

const dbpool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'absensi_siswa',
    password: '',
})

module.exports = dbpool.promise()