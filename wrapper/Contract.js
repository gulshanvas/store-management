const fetch = require('node-fetch');

/**
 * Contract wrapper fetches information for a product contract.
 */
class Contract {

  static async getContractById(contractId) {

    const contractResponse = await fetch(`http://localhost:5000/contracts/${contractId}`);

    const contractsMap = await contractResponse.json();
    
    return contractsMap;

  }

}

module.exports = Contract;