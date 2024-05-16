const bcrypt = require('bcrypt');
const User = require('../models/user');

const register = async (req, res) => {
    console.log(req.body)
    const usernames = await User.findAll({ where: { username: req.body.username } })
    if (usernames.length > 0) {
        return res.status(500).json({ message: 'Username already exists' })
    }
    if (req.body.password.length < 8 || req.body.password.length > 150 ) {
        return res.status(500).json({ message: 'Password must be between 8 and 150 characters long'})
    }   

    bcrypt.hash(req.body.password, 10, (error, cryptPassword) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: cryptPassword
        })
        .then((registered) => {
            req.session.user = {
                username: registered.username,
                user_id: registered.id,
            };
            console.log(req.session);
            res.json({
                message: 'New user is registered',
                user: registered,
                user_session: req.session.user
            })
        })
    })
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const users = await User.findAll({ where: { username } });

    if (users.length > 0) {
        const user = users[0];

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.user = {
                    username: user.username,
                    user_id: user.id
                };
                res.json({
                    message: 'User is logged in',
                    user,
                    user_session: req.session.user
                });
            } else {
                res.json({ message: 'Password is incorrect' });
            }
        });
    } else {
        res.json({ message: 'Username does not exist!' });
    }
};

module.exports = { register, login };