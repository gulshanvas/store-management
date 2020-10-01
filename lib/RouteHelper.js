/**
 * Helper class which is the redirection point from route layer.
 * It calls the service, parse the response and returns it.
 */
class RouteHelper {

  /**
   * Main performer of the class.
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} service Service name to be called.
   */
  static async perform(req, res, service) {

    const Service = require('../service' + service);

    const serviceParams = Object.assign({}, req.internalDecodedParams, req.params, req.body, req.query, req.decodedParams);

    const serviceObj = new Service(serviceParams);

    try {
      const response = await serviceObj.perform();
      return res.status(200).json(response);
    } catch (err) {
      console.log('err : ', err);
      return res.status(400).send(err);
    }
  }
}

module.exports = RouteHelper;