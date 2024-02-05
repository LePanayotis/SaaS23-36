const conf = {
    bubble_port: process.env.BUBBLE_PORT,
    bubble_host: process.env.BUBBLE_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;