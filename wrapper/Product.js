const fetch = require('node-fetch');

/**
 * Product wrapper interacts with centralized inventory module.
 */

class Product {

  static async getProduct(params) {

    const productsResponse = await fetch(`http://localhost:5000/products/${params.productId}`);

    const companyResponse = await fetch(`http://localhost:5000/companies/${params.companyId}`);

    const companiesMap = await companyResponse.json();

    const productsMap = await productsResponse.json();
    console.log('productsMap : ',productsMap);

    if (!companiesMap.id === params.companyId) {
      return Promise.reject({
        error_identifer: "w_p_vp_1",
        error_msg: "Invalid company id",
        companyId: params.companyId
      });
    }

    if (!productsMap.id === params.productId) {
      return Promise.reject({
        error_identifer: "w_p_vp_2",
        error_msg: "Invalid product id",
        companyId: params.companyId
      });
    }
    console.log('productsMap[params.productId] : ',productsMap);
    return productsMap;

  }

}

module.exports = Product;