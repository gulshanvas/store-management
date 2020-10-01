const { Sequelize, Model } = require('sequelize');
const Base = require('./Base');

/**
 * Represents product store in db.
 */
class ProductStore extends Model {
}

/**
 * Repository class to interact with Product model
 */
class ProductStoreRepository extends Base {

  constructor() {
    super();
    ProductStore.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'id'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nature: {
        type: Sequelize.ENUM,
        values: ['PERISHABLE', 'NON-PERISHABLE']
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      refundAllowed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
      {
        ... this.initOptions,
        modelName: 'ProductStore',
        tableName: 'product_stores',
      }
    )
  }

  /**
   * Creates a new entry for product.
   * @param {*} params 
   */
  static async save(params) {

    // const productResponse = await ProductStore.getProduct({
    //   where: {
    //     companyId: params.companyId,
    //     productId: params.productId,
    //     contractId: params.contractId
    //   }
    // });
    // if(productResponse) { increase count and return}

    await ProductStore.create(
      params
    );

  }

  /**
   * Retrieves product store details based on product store id.
   * @param {number} params.id 
   */
  static async get(params) {

    const productStoreObj = await ProductStore.findOne({
      where: { id: params.productStoreId }
    });

    return productStoreObj;
  }

  /**
   * Gets product details.
   * @param {*} params 
   */
  static async getProduct(params) {

    const productStoreObj = await ProductStore.findOne({
      where: { 
        companyId: params.companyId,
        productId: params.productId,
        contractId: params.contractId 
      }
    });

    return productStoreObj;

  }

  /**
   * Updates product store count.
   * @param {*} params 
   */
  static async updateStore(params) {
    // TODO: validate before updating.
    await ProductStore.update({
      count: Sequelize.literal(`count - ${params.count}`)
    },
      {
        where: { id: params.id }
      }
    );

  }

  /**
   * Increase product count
   * @param {*} params 
   */
  static async increaseProductCount(params) {
    await ProductStore.update({
      count: Sequelize.literal(`count + ${params.count}`)
    },
      {
        where: {
          companyId: params.companyId,
          productId: params.productId,
          contractId: params.contractId
        }
      }
    );
  }

}

module.exports = ProductStoreRepository;