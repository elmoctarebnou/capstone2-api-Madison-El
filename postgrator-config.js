'use strict';
require('dotenv').config();

module.exports = {
  'connectionString': process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
  "migrationDirectory": "migrations",
  "driver": "pg",
};
