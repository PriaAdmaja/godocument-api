const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDISPASSWORD,
    socket: {
        host: 'redis-13226.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 13226
    }
});

module.exports = client