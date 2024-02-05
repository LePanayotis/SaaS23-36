const conf = {
    radar_port: process.env.RADAR_PORT,
    radar_host: process.env.RADAR_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;