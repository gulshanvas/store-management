const TransactionRepository = require('../../models/Transaction');
const ProductStoreRepository = require('../../models/ProductStore');
const userRoleConstants = require('../../constants/userRole');
const AuthWrapper = require('../../wrapper/Auth');

/**
 * Facilitates return of the product
 */
class Returns {

  /**
   * Constructor
   * @param {*} params 
   */
  constructor(params) {
    this.orderId = params.orderId;
    this.productId = Number(params.productId);
    this.companyId = Number(params.companyId);
    this.count = Number(params.count);
    this.userRole = params.userRole;
    this.userId = params.userId;
    this.transactionOrderResponse = {};
  }

  /**
   * Main performer of class
   */
  async perform() {
    await this._validate();
    await this._returnProduct();
    await this._calculateRefund();
    await this._provideLoyaltyPoints();

    return this._prepareReponse();
  }

  /**
   * Validates the params
   */
  async _validate() {
    // TODO: remove it
    new TransactionRepository();

    this.transactionResponse = await TransactionRepository.get({
      orderId: this.orderId
    });

    this.productValidated = false;
    this.transactionResponse.every((element) => {
      console.log('element.dataValues.companyId: ', element.dataValues.companyId);
      if ((Number(element.dataValues.companyId) === this.companyId)
        && (Number(element.dataValues.productId) === this.productId)
        && !element.dataValues.refunded) {
        this.productValidated = true;
        this.transactionOrderResponse = element;
        return false;
      }
      return true;
    });

    if (!this.productValidated) {
      return Promise.reject({
        api_error_identifier: 's_o_r_v_1',
        error_msg: 'Invalid product to be returned',
        orderId: this.orderId,
        productId: this.productId,
        companyId: this.companyId
      });
    }
  }

  /**
   * Updates products store and transaction table.
   */
  async _returnProduct() {
    if (this.count > Number(this.transactionOrderResponse.count)) {
      return Promise.reject({
        api_error_identifier: 's_o_r_v_1',
        error_msg: 'Incorrect number of products is returned. ' +
          `Purchased count was ${oThis.transactionOrderResponse.count} and returned count is ${this.count}`,
        orderId: this.orderId,
        productId: this.productId,
        companyId: this.companyId
      });
    }

    if (this.count === Number(this.transactionOrderResponse.count)) {
      // set the refunded flag to true.
      await TransactionRepository.update({
        id: this.orderId,
        companyId: this.companyId,
        productId: this.productId
      });
    }

    // update store
    await ProductStoreRepository.updateStore({
      companyId: this.transactionOrderResponse.companyId,
      productId: this.transactionOrderResponse.productId,
      contractId: this.transactionOrderResponse.contractId
    });
  }

  /**
   * Calculates refund amount
   */
  async _calculateRefund() {

    if (this.transactionOrderResponse.discount) {
      const productStoreObj = await ProductStoreRepository.getProduct();

      const originalPrice = Number(productStoreObj.price);

      const discountAmount = originalPrice * (Number(this.transactionOrderResponse.discount) / 100);
      this.totalRefundAmount = this.count * (originalPrice - discountAmount);

    } else {
      const price = Number(this.transactionOrderResponse.price);

      this.totalRefundAmount = price * this.count;
    }

  }

  /**
   * Provide loyalty points
   */
  async _provideLoyaltyPoints() {
    const customerObj = await AuthWrapper.getBuyer({
      id: oThis.transactionOrderResponse.buyerId
    });

    const currentLoyaltyPoints = customerObj.loyaltyPoints || 0;

    const updateLoyaltyPoints = this.totalRefundAmount + Number(currentLoyaltyPoints); 

    await AuthWrapper.updateLoyaltyPoints(updateLoyaltyPoints);

  }

  /**
   * Prepares response
   */
  async _prepareReponse() {
    return {
      totalRefundAmount: this.totalRefundAmount
    }
  }
}

module.exports = Returns