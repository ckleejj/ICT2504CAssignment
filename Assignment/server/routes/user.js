const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash passowrd
        data.password = await bcrypt.hash(data.password, 10);
        // Create user
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});

router.post("/profile", validateToken, async (req, res) => {
    // Check if user is in the Request object, if not return http status 401 and error message
    if (req.user) {
        // Check if the user has an id, if not return http status 402 and error message
        if (!req.user.id) {
            res.status(402)
            res.send('User has no user id')
            return;
        }
    } else {
        res.status(401)
        res.send('You are not authorized');
        return;
    }
    try {
        // Extract the email and name in the POST request body
        const { email, name } = req.body;
        // Select the row from the User table by priamry key id
        const userToUpdate = await User.findByPk(parseInt(req.user.id));
        // If the row exists, update the email if have, name if have and return HTTP 201 success.
        if (userToUpdate) {
            if (email)  userToUpdate.email = email;
            if (name)   userToUpdate.name = name;
            await userToUpdate.save({fields: ['email', 'name']});
            res.status(201);
            res.send('User updated');
        } else {
            // If not return HTTP status 404 and error message.
            res.status(404);
            res.send('No such user');
            return;
        }
    }
    catch(err) {
        // If all else fails, return HTTP status 503.
        console.error(err)
        res.status(503)
        res.send('Error change profile of user')
    }

})

module.exports = router;
