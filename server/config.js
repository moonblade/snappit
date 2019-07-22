var config = {
    development: {
        dbHost: 'mongodb://mongo/snappit',
    },
    production: {
        dbHost: 'mongodb://localhost/snappit',
    }
}
exports.config = config;
