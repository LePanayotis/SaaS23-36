const conf = {
    polar_area_port: process.env.POLAR_AREA_PORT,
    polar_area_host: process.env.POLAR_AREA_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;