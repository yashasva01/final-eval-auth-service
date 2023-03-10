const userServices = require('../services/userServices');

const registerNewUsers = async(req, res) => {
    const {userEmail, password} = req.body; 
    const response = await userServices.newUserHandler(userEmail, password);
    res.json(response.message).status(response.status);
};

const loginUsers = async(req, res) => {
    const {userEmail, password} = req.body;
    const {status, message} = await userServices.userLoginHandler(userEmail, password);
    res.json(message).status(status);
};

const validateToken = async (req, res) => {
    const token = req.headers['x-access-token'];
    console.log(token);
    const {status, message} = await userServices.validateTokenHandler(token);
    res.json(message).status(status);
};  

module.exports = {
    registerNewUsers,
    loginUsers,
    validateToken
}; 