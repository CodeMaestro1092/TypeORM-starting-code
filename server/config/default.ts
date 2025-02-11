export default {
    port: process.env.PORT,
    database:{
        port: process.env.DATABASE_PORT,
        name: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        anon: process.env.DB_ANON,
        url: process.env.DB_URL
    },
    jwtSecret: process.env.JWT_SECRET
}