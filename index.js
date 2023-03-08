const express = require('express');
const router = express.Router();
const app = express();
const dotenv = require('dotenv');
const redis = require('redis');
dotenv.config();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is user auth service');
}
);

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}
);
