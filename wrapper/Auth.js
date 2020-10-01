const jwtDecode = require('jwt-decode');
const fetch = require('node-fetch');

/**
 * Auth wrapper interacts with auth module.
 */
class Auth {
  static async getUser(req, res, next) {

    const jwtDecodedObj = extractReqParams(req);

    const id = jwtDecodedObj.sub;

    // api call
    const response = await fetch(`http://localhost:3000/userDetails/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.token}`
      },
    }
    );


    const user = await response.json();

    req.decodedParams = user;

    next();
  }

  /**
   * Get customer information
   * @param {*} params 
   * @param {number} params.id 
   */
  static async getBuyer(params) {
    const apiResponse = await fetch(`http://localhost:3000/customers/${params.id}`, {
      method: 'get'
    }
    );

    return apiResponse.json();

  }

  /**
   * Update loyalty points
   * 
   * @param {number} loyaltyPoints 
   */
  static async updateLoyaltyPoints(loyaltyPoints) {

    const apiResponse = await fetch(`http://localhost:3000/customers/${params.id}`, {
      method: 'PATCH',
      body: {
        loyaltyPoints
      }
    }
    );

    return apiResponse.json();
  }
}

/**
 * Extract request params
 * 
 * @param {*} req 
 */
function extractReqParams(req) {

  const loginCookie = req.token;

  // decode jwt token
  const jwtObj = jwtDecode(loginCookie);

  return jwtObj;

}

module.exports = Auth;