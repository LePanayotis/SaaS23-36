const conf = {
    mongo_uri: `mongodb://${process.env.MONGO_HOST}:${(process.env.MONGO_PORT)}/${(process.env.MONGO_DB_USERS)}`, 
    users_host: process.env.USERS_HOST,
    users_port: process.env.USERS_PORT,
    quotas_uri: `http://${process.env.QUOTAS_HOST}:${process.env.QUOTAS_PORT}`,
    
    secretKey: (process.env.SECRET_KEY || 'mykey'),
    secretKeyTempUser: (process.env.SECRET_KEY_TEMP_USER || 'tempuser'),
    CLIENT_ID: process.env.CLIENT_ID || '1088226481644-j4153fvd7dvok187pqa19ss0nkecvkbi.apps.googleusercontent.com'
}

module.exports = conf;
