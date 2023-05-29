const express = require('express');
const router = express.Router();
const Administrator = require('../controller/admin.controller');

router.post("/registration", Administrator.handleAdminRegister)
router.post("/login", Administrator.handleAdminLogin)
router.get("/logout", Administrator.handleAdminLogout)

module.exports = router;