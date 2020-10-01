const mysql = require('mysql2');
// const { Sequelize } = require('sequelize/types');
const dbConfig = require('./dbConfig.json');

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.db.db_host,
  user: dbConfig.db.db_user,
  password: dbConfig.db.db_password,
  database: dbConfig.db.db_name
});

module.exports = { connectionPool };

// class MySql {

//   constructor() {
//     this.connection = new Sequelize(dbConfig.db.db_name, dbConfig.db.db_user, dbConfig.db.db_password,
//       {
//         pool: {
//           max: 5,
//           min: 0,
//           idle: 10000
//         }
//       });
//   }
// }

// module.exports = new MySql();