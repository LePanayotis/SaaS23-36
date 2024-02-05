const conf = {
    mongo_uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_QUOTAS}`, 
    quotas_port: process.env.QUOTAS_PORT,
    quotas_host: process.env.QUOTAS_HOST,
}

module.exports = conf;
