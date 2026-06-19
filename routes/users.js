// this file will contain all the auth routes: register w login w logout w keda
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');

const users = require('../controllers/users');   //require the users controller

// Register form ; get
router.get('/register', users.renderRegister)

// Register post route after submitting the register form
router.post('/register', catchAsync(users.register));

// login route for the form
router.get('/login', users.renderLogin);

// login route to submit the form
// passport gives us a middleware that we can use for login: passport.authenticate() where local means local credentials 
// but we can also be authenticating google or twitter credentials w keda
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);   //if the login fails, we flash a message and redirect to the login page again; if the login is successful, we move on to the users.login controller function



// logout route, really easy with passport just add line: req.logout()
router.get('/logout', users.logout);


module.exports = router;