const Administrator = require('../model/admin.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')
 
const handleAdminRegister = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            'message': "Email and password are required!",
        })
    }

    if (req.body?.password.length < 8) {
        return res.send({ message: 'Password must be at least 8 characters!', status: 400 });
    }

    const foundUser = await User.findOne({ email: email }).exec();
    const foundEmail = await Administrator.findOne({ email: email }).exec();
    if (foundEmail || foundUser) {
        return res.send({ message: "Email address already exists!", status: 400 });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 8);

        const result = await Administrator.create({
            email, fullName, "password": hashedPassword,
        })

        console.log(result)
        res.status(201).send({ message: `Create admin account ${email} successfully!` })
    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }
}

const handleAdminLogin = async (req, res) => {
    const cookies = req.cookies

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ "message": "Email and password are required" })
    const foundAdmin = await Administrator.findOne({ email: email }).exec()
    if (!foundAdmin) {
        res.status(401).send({ message: 'Incorrect username or password!!' }) //Incorrect username or password!
        return
    }
    const match = await bcrypt.compare(password, foundAdmin.password);
    if (!match) {
        res.status(401).send({ message: 'Incorrect username or password!!' }) //Incorrect username or password!
        return
    }
    if (match) {
        const roles = foundAdmin.roles
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundAdmin.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET || 'access-token-secret',
            { expiresIn: '10s' }
        );
        const newRefreshToken = jwt.sign(
            { "email": foundAdmin.email },
            process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
            { expiresIn: '15s' }
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundAdmin.refreshToken
                : foundAdmin.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {

            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await Administrator.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Saving refreshToken with current user
        foundAdmin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        // const result = await foundAdmin.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ accessToken, email, roles });

    } else {
        res.sendStatus(401);
    }
}

const handleAdminLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const foundAdmin = await Administrator.findOne({ refreshToken }).exec()
    if (!foundAdmin) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }

    foundAdmin.refreshToken = foundAdmin.refreshToken.filter(rt => rt !== refreshToken)
    const result = await foundAdmin.save()
    console.log(result);
    console.log("Logout successfully!");

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204)
}

module.exports = {
    handleAdminLogout,
    handleAdminRegister,
    handleAdminLogin,
}