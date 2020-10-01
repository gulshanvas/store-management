const TransactionRepository = require('./models/Transaction');
const ProductStoreRepository = require('./models/ProductStore');

/**
 * Initial setup
 */
class Setup {

async perform() {

  new TransactionRepository();
  new ProductStoreRepository();
}

}

new Setup().perform().then(() => {
  console.log('setup done succesfully');
});