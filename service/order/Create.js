const TransactionRepository = require('../../models/Transaction');
const Auth = require('../../wrapper/Auth');
const ProductStoreRepository = require('../../models/ProductStore');
const userRoleConstants = require('../../constants/userRole');

/**
 * Creates order receipt
 */
class Create {

  /**
   * Constructor
   * @param {*} params 
   */
  constructor(params) {

    this.products = JSON.parse(params.products);

    this.buyerId = params.buyerId;
    this.currency = params.currency;
    this.userId = params.userId;
    this.userRole = params.userRole;
  }

  /**
   * Main performer of class
   */
  async perform() {
    // validate
    await this._validate();
    this._onlyManager();

    this._generateOrderNumber();
    await this._applyDiscount();
    await this._createOrder();

    return this._prepareResponse();

  }

  /**
   * Validates the buyer id.
   */
  async _validate() {
    console.log('in validate');
    const buyerInfo = await Auth.getBuyer({ id: this.buyerId });

    if (!buyerInfo.id) {
      return Promise.reject({
        api_error_identifier: 's_o_c_v_1',
        error_msg: 'Invalid buyer id',
        buyer_id: this.buyerId
      }
      );
    }
  }

  /**
   * Only manager is allowed to create order
   */
  _onlyManager() {

    if (this.userRole !== userRoleConstants.manager) {
      throw new Error({
        api_error_identifier: 's_o_c_om_1',
        error_msg: 'Only manager can create order',
        user_id: this.userId
      });
    }
  }

  /**
   * Generates order number
   */
  _generateOrderNumber() {
    console.log('in generate order');
    let now = Date.now().toString()
    // pad with extra random digit
    now += now + Math.floor(Math.random() * 10)
    // format
    this.orderId = [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('-')

  }

  /**
   * Applies discount if any
   */
  async _applyDiscount() {

    this.productStoreMap = {};
    this.totalOrderAmount = 0;
    new ProductStoreRepository();

    for (let key in this.products) {

      console.log('key : ',key);
      const productStoreObj = await ProductStoreRepository.get({
        productStoreId: key
      });

      this.productStoreMap[key] = productStoreObj;
      const price = this.productStoreMap[key].price;

      const count = this.products[key].count;
      const discount = this.products[key].discount;
      if (discount) {
        const discountAmount = price * (discount / 100);
        this.productStoreMap[key].total = count * (price - discountAmount);
        this.totalOrderAmount = this.totalOrderAmount + this.productStoreMap[key].total;
        continue;
      }

      this.productStoreMap[key].total = count * price;

      this.totalOrderAmount = this.totalOrderAmount + this.productStoreMap[key].total;

    }

  }

  /**
   * Creates order receipts and updates product count in the store
   */
  async _createOrder() {
    new TransactionRepository();

    // looping for multiple products
    for (let key in this.productStoreMap) {
      const productId = this.productStoreMap[key].productId;
      const companyId = this.productStoreMap[key].companyId;
      const contractId = this.productStoreMap[key].contractId;
      const discount = this.products[key].discount;
      const total = this.productStoreMap[key].total
      const count = this.products[key].count;

      await TransactionRepository.save(
        {
          orderId: this.orderId,
          buyerId: this.buyerId,
          userId: this.userId,
          productId: productId,
          companyId: companyId,
          discount: discount,
          contractId: contractId,
          count: count,
          currency: this.currency,
          total
        }
      );

      // update count for products in the store.
      await ProductStoreRepository.updateStore({
        id: key,
        count
      });
    }
  }

  /**
   * Response
   */
  _prepareResponse() {
    return {
      orderId: this.orderId,
      totalOrderAmount: this.totalOrderAmount
    };
  }
}

module.exports = Create