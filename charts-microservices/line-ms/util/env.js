const conf = {
    line_port: process.env.LINE_PORT,
    line_host: process.env.LINE_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;