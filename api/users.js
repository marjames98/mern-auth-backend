// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const passport = require('passport');
const { JWT_SECRET } = require('../config/keys')
console.log(JWT_SECRET);


// Models
const db = require('../models');

// GET api/users/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'User endpoint OK!'});
});

// POST api/users/register (Public)
router.post('/register', (req, res) => {
    console.log('inside of register')
    console.log(req.body);

    console.log(db);
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exits, send a 400 response
        console.log(user);
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        } else {
            // Create a new user
            console.log('else statement');
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Salt and hash the password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                // if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    // if (error) throw Error;
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.User.findOne({ email })
    .then(user => {
        if (!user) {
            res.status(400).json({ msg: 'User not found'});
        } else {
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ${token}' 
                        });
                    }); 
                } else {
                    return res.status(400).json({ msg: 'Email or password is incorrect' });
                }
            })
        }
    })
})

router.get('/curret', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;