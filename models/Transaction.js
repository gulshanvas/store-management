const { Sequelize, Model } = require('sequelize');
const Base = require('./Base');

class Transaction extends Model { }

/**
 * Repository class to interact with Transaction model
 */
class TransactionModelRepository extends Base {

  constructor() {
    super();
    Transaction.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'id'
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 100
        }
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      refunded: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    },
      {
        ... this.initOptions,
        modelName: 'Transaction',
        tableName: 'transactions',
      }
    )
  }

  /**
   * Creates a new entry
   * @param {*} params 
   */
  static async save(params) {
    await Transaction.create(
      params
    );
  }

  /**
   * Get's transaction details based on id.
   * @param {*} params 
   */
  static async get(params) {
    const transactionResponse = await Transaction.findAll(
      {
        where: {
          orderId: params.orderId
        }
      }
    );

    return transactionResponse;
  }

  /**
   * Updates transaction model to make the product refundable.
   * @param {*} params 
   * @param {number} params.id 
   * @param {number} params.companyId 
   * @param {productId} params.productId
   */
  static async update(params) {

    await Transaction.update({
      refunded: true
    },
      {
        where: {
          id: params.id,
          companyId: params.companyId,
          productId: params.productId
        }
      }
    );

  }

}

module.exports = TransactionModelRepository;