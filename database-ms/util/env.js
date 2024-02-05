const conf = {
    database_host: process.env.DATABASE_HOST,
    database_port: process.env.DATABASE_PORT,
    database_thumbnail_port: process.env.THUMBNAIL_PORT,
    webapp_url: process.env.WEBAPP_URI,
    thumbnail_uri: `${process.env.WEBAPP_URI}:${process.env.THUMBNAIL_PORT}`,

    mongo_uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_CHARTS}`,

    frontend_uri: `https://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    
    users_uri: `http://${process.env.USERS_HOST}:${process.env.USERS_PORT}`,
    quotas_uri: `http://${process.env.QUOTAS_HOST}:${process.env.QUOTAS_PORT}`,
    
    polar_area_uri: `http://${process.env.POLAR_AREA_HOST}:${process.env.POLAR_AREA_PORT}`,
    scatter_uri: `http://${process.env.SCATTER_HOST}:${process.env.SCATTER_PORT}`,
    bubble_uri: `http://${process.env.BUBBLE_HOST}:${process.env.BUBBLE_PORT}`,
    radar_uri: `http://${process.env.RADAR_HOST}:${process.env.RADAR_PORT}`,
    stacked_bar_uri: `http://${process.env.STACKED_BAR_HOST}:${process.env.STACKED_BAR_PORT}`,
    line_uri: `http://${process.env.LINE_HOST}:${process.env.LINE_PORT}`,

    https_certificate: process.env.HTTPS_CERTIFICATE,
    https_key: process.env.HTTPS_KEY,
    key: process.env.KEY,
    cert: process.env.CERT,
}

module.exports = conf;