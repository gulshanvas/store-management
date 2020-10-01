const { Sequelize } = require("sequelize");
const dbConfig = require('../database/dbConfig.json');

class Base {

  constructor() {
    this.sequelize = new Sequelize(
      dbConfig.db.db_name,
      dbConfig.db.db_user,
      dbConfig.db.db_password,
      {
        dialect: 'mysql',
      }
    );
    this.sequelize.sync().then(console.log('sequelize sync'));
    this.initOptions = {
      sequelize: this.sequelize,
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      typeValidation: true,
    }
  }

}

module.exports = Base;