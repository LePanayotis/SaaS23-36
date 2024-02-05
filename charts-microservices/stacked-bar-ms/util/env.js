const conf = {
    stacked_bar_port: process.env.STACKED_BAR_PORT,
    stacked_bar_host: process.env.STACKED_BAR_HOST,
    database_uri: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
}

module.exports = conf;