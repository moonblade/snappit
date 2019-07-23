const dotenv = require('dotenv');
dotenv.config();

const config = {
    development: {
        dbHost: process.env.MONGO_URL || 'mongodb://localhost/snappit',
        port: process.env.PORT || 3000
    },
    production: {
        dbHost: process.env.MONGO_URL,
        port: process.env.PORT || 3000
    }
}
exports.config = config;