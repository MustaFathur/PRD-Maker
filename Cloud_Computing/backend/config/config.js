require('dotenv').config()
console.log("ENV Variables:", {
  NODE_ENV: process.env.NODE_ENV,
  DB_TEST_HOST: process.env.DB_TEST_HOST,
  DB_TEST_USERNAME: process.env.DB_TEST_USERNAME
});
module.exports = {
  "development": {
    "username": process.env.DB_DEV_USERNAME,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV_NAME,
    "host": process.env.DB_DEV_HOST,
    "dialect": process.env.DB_DEV_CONNECTION
  },
  "test": {
    "username": process.env.DB_TEST_USERNAME,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST_NAME,
    "host": process.env.DB_TEST_HOST,
    "dialect": process.env.DB_TEST_CONNECTION,
    "port": process.env.DB_TEST_PORT,
    "dialectOptions": {
      "host": process.env.DB_TEST_HOST,
    }
  },
  "production": {
    "username": process.env.DB_PROD_USERNAME,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD_NAME,
    "host": process.env.DB_PROD_HOST,
    "dialect": process.env.DB_PROD_CONNECTION
  }
}