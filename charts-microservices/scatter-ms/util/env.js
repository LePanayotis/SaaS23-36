const conf = {
    scatter_port: process.env.SCATTER_PORT,
    scatter_host: process.env.SCATTER_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;