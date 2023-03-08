const userServices = require('../services/userServices');

const registerNewUsers = async(req, res) => {
    const {username, password} = req.body; 
    const {status, message} = await userServices.newUserHandler(username, password);
    res.json(message).status(status);
};

const loginUsers = async(req, res) => {
    const {username, password} = req.body;
    const {status, message} = await userServices.userLoginHandler(username, password);
    res.json(message).status(status);
};

const validateToken = async (req, res) => {
    const token = req.headers('x-access-token');
    const {status, message} = await userServices.validateTokenHandler(token);
    res.json(message).status(status);
};  

module.exports = {
    registerNewUsers,
    loginUsers,
    validateToken
}; 