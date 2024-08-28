const userController = require('../controller/user_controller')
const express = require('express')

const router = express.Router()

router.post('/login', userController.loginUserAccount)

router.get('/siswa', userController.getUserData)

router.post('/siswa/attendance', userController.addAttendanceStatus)

router.get('/siswa/getData/:date', userController.getDataByDate)

module.exports = router