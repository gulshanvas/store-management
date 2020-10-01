const Validator = require('../../lib/Validator');
const userRoleConstants = require('../../constants/userRole');
const ProductStoreRepository = require('../../models/ProductStore');
const ProductWrapper = require('../../wrapper/Product');
const ContractWrapper = require('../../wrapper/Contract');

/**
 * Create a new product into store inventory.
 */
class CreateProduct {

  constructor(params) {
    console.log('params in create product: ', params);
    this.companyId = params.companyId;
    this.productId = params.productId;
    this.price = params.price;
    this.totalBoxes = params.totalBoxes;
    this.userRole = params.userRole;
    this.userId = params.userId;
    this.contractId = params.contractId;
  }

  /**
   * 
   */
  async perform() {
    await this._validate();
    this._onlyManager();

    await this._fetchProductDetails();
    await this._fetchContractDetails();
    await this._createProduct();
  }

  /**
   * Validates input params
   */
  async _validate() {

    const validateObj = Validator.validateCreateObject({
      companyId: this.companyId,
      productId: this.productId,
      price: this.price,
      contractId: this.contractId,
      totalBoxes: this.totalBoxes
    });

    if (validateObj.error) {

      throw new Error(JSON.stringify(validateObj.error));
    }

  }

  /**
   * Only manager is allowed to create product
   */
  _onlyManager() {
    if (this.userRole !== userRoleConstants.manager) {
      throw new Error({
        api_error_identifier: 's_p_c_om_1',
        error_msg: 'Only manager can create product',
        user_id: this.userId
      });
    }
  }

  async _fetchProductDetails() {

    this.productDetail = await ProductWrapper.getProduct({
      companyId: this.companyId,
      productId: this.productId
    }
    );

  }

  /**
   * Fetches contract details.
   */
  async _fetchContractDetails() {

    this.contractDetail = await ContractWrapper.getContractById(this.contractId);
    console.log('contractDetail  ', this.contractDetail);
    if (!this.contractDetail.piecePerBox) {
      return Promise.reject({
        api_error_identifier: 's_c_fcd_1',
        error_msg: 'Invalid contract id',
        contractId: this.contractId
      });
    }
  }

  /**
   * Creates a new product entry in ProductStore
   */
  async _createProduct() {
    // TODO: initialize it at start of application
    new ProductStoreRepository();

    await ProductStoreRepository.save({
      companyId: this.companyId,
      productId: this.productId,
      price: this.price,
      count: Number(this.totalBoxes) * this.contractDetail.piecePerBox,
      contractId: this.contractId,
      nature: this.productDetail.nature,
      createdById: this.userId,
      refundAllowed: this.contractDetail.refundAllowed === 'YES' ? true : false
    });
  }

}

module.exports = CreateProduct;