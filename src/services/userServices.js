const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();


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
        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1h'});
        redisClient.set(token, 1, 'EX', 3600);
        return {status: 200, message: 'User logged in successfully'};
    } catch (error) {
        return {
            status: 500,
            message: 'Something went wrong'
        };
    }
};

const validateTokenHandler = async (token) => {
    if(!token) {
        return {
            status: 400,
            message: 'Token is required'
        };
    }
    try{
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const username = decode.username;
        const user = await db.User.findOne({
            where: {
                username
            }});
        if(!user) {
            return {
                status: 400,
                message: 'Un authorized user'
            };
        }
        const redisUserToken = redisClient.get(token, (err, reply) => {
            if(err) {
                return {
                    status: 500,
                    message: 'Something went wrong'
                };
            }
            if(reply === null) {
                return {
                    status: 401,
                    message: 'Token is invalid'
                };
            }
        });
        if(redisUserToken === token) {
            return {
                status: 200,
                message: 'Token is valid'
            };
        }else {
            return {
                status: 401,
                message: 'Token is invalid'
            };
        }
    } catch (error) {
        return {
            status: 500,
            message: 'Something went wrong'
        };
    }
};

module.exports = {
    newUserHandler,
    userLoginHandler,
    validateTokenHandler
};   