const router = require ('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registration', UserController.register);
router.post('/login',UserController.login)
router.get('/detail/:userId',UserController.getUserDetails)
router.put('/update/:userId',UserController.updateUser)

module.exports = router;