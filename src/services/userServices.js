const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const redis = require('redis');


const newUserHandler = async (username, password) => {
    if(!username && !password) {
        return {
            status: 400,
            message: 'Username and password are required'
        };
    }
    try{
        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) {
                return {
                    status: 500,
                    message: 'Something went wrong'
                };
            }
            const user = await db.User.findOne({
                where: {
                    username
                }
            });
            if(user) {
                return {
                    status: 400,
                    message: 'Username already exists'
                };
            }
            const newUser = await db.User.create({
                username,
                password: hash
            });
            return { status: 200, message: 'User created successfully' };
        });   
    } catch (error) {
        return {
            status: 500,
            message: 'Something went wrong'
        };
    }
};

const userLoginHandler = async (password, username) => {
    if(!username && !password) {
        return {
            status: 400,
            message: 'Username and password are required'
        };
    }
    try{
        const user = await db.User.findOne({
            where: {
                username
            }
        });
        if(!user) {
            return {
                status: 400,
                message: 'Username does not exist'
            };
        }
        const userPassword = user.password;
        const isMatch = await bcrypt.compare(password, userPassword, (err, result) => {
            if(err) {
                return {
                    status: 500,
                    message: 'Something went wrong'
                    };
            }
            return result;
            });
        if(isMatch instanceof Error) {
            return {
                status: 401,
                message: 'Password is incorrect'
            };
        }
        return {status: 200, message: 'User logged in successfully'};
    } catch (error) {
        return {
            status: 500,
            message: 'Something went wrong'
        };
    }
};

const validateTokenHandler = async () => {
};

module.exports = {
    newUserHandler,
    userLoginHandler,
    validateTokenHandler
};   