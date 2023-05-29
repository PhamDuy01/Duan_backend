const UserService = require("../services/user.services");
const User = require("../model/user.model")

exports.register = async (rep, res, next) => {
    try {
        const { email, password } = rep.body;
        const successRes = await UserService.registerUser(email, password);
        res.json({
            status: true, success: "Đăng ký  thành công!!!"
        });
    } catch (err) {
        throw err
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(".......", password);

        const user = await UserService.checkUser(email);
        console.log("..............user..........", user);

        if (!user) {
            throw new Error('User dont exist');
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch === false) {
            throw new Error('Password InValid');
        }

        let tokenData = { _id: user._id, email: user.email };

        const token = await UserService.generateAccessToken(tokenData, "secretKey", '1h')

        res.status(200).json({ status: true, token: token })
    } catch (error) {
        throw error
    }
}

exports.getUserDetails = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).exec();
  
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, email, phoneNumber, address, fullName } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, phoneNumber, address, fullName },
        { new: true }
      ).exec();
  
      if (updatedUser) {
        res.status(200).json({ user: updatedUser });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



