const Joi = require('joi');

/**
 * Contains various validator method to validate the input object to service.
 */
class Validators {

  /**
   * Validates input object to Create product service.
   * @param {object} params 
   */
  static validateCreateObject(params) {

    const schema = Joi.object({
      companyId: Joi.number().min(1)
        .required(),

      productId: Joi.number().min(1)
        .required(),

      price: Joi.number().min(1)
        .required(),
        
      contractId: Joi.number().min(1)
        .required(),

      totalBoxes: Joi.number().min(1)
        .required()
    });

    let obj = schema.validate(params);

    return obj;

  }

}

module.exports = Validators;
