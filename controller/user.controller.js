const UserService = require("../services/user.services");
const User = require("../model/user.model")
const Admin = require("../model/admin.model")

exports.register = async (rep, res, next) => {
  try {
    const { email, password } = rep.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const foundUser = await User.findOne({ email: email }).exec();
    const foundAdmin = await Admin.findOne({ email: email }).exec();
    if (foundUser || foundAdmin) {
      return res.status(400).json({ message: "Email address already exits" });
    }

    const successRes = await UserService.registerUser(email, password);
    res.json({
      status: true, success: "Đăng ký thành công!!!"
    });
  } catch (err) {
    throw err
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserService.checkUser(email);

    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password!' });
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch === false) {
      return res.status(401).json({ message: 'Incorrect email or password!' });
    }

    let tokenData = { _id: user._id, email: user.email };

    const token = await UserService.generateAccessToken(tokenData, "secretKey", '1h');

    res.status(200).json({ email: email, token: token, userId: user._id });
  } catch (error) {
    throw error;
  }
};

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



