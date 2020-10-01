const migration = require('mysql-migrations');

const { connectionPool } = require('./mysql');

migration.init(connectionPool, __dirname + '/migrations');