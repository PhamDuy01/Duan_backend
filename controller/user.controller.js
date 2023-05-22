const UserService = require ("../services/user.services");

exports.register = async(rep,res,next)=>{
    try {
        const {email,password} = rep.body;
        const successRes = await UserService.registerUser(email,password);
        res.json({
            status:true, success:"Đăng ký  thành công!!!"
        });
    } catch (err) {
        throw error
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(".......",password);

        const user = await UserService.checkUser(email);
        console.log("..............user..........", user);

        if(!user){
            throw new Error('User dont exist');
        }

        const isMatch = await user.comparePassword(password);

        if(isMatch === false){
            throw new Error('Password InValid');
        }

        let tokenData = {_id:user._id, email:user.email};

        const token = await UserService.generateAccessToken(tokenData,"secretKey",'1h')

        res.status(200).json({status: true, token: token})
    } catch (error) {
        throw error
    }
}



