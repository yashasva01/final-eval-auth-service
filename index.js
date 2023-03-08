const express = require('express');
const router = require('./src/routes/routes');
const app = express();
const dotenv = require('dotenv');
const redis = require('redis');
dotenv.config();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is user auth service');
}
);

const config = {
    socket:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
};
global.redisClient = redis.createClient(config);

redisClient
.on('error', (err) => {
    console.log(`Redis error: ${err}`);
})
.connect().then(()=> {
    console.log('Redis connected');
});

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}
);
