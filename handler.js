'use strict';
const ProductoDAO = require('./ripley.ims.dao/ProductoDAO');
const ProductoService = require('./ripley.ims.service/ProductoService');

module.exports.hello = async event => {

  let resultResponse = await  ProductoService.getProductoStockIncremental()
  return {
    statusCode: resultResponse.statusCode,
    body: JSON.stringify(
      {
        message: resultResponse.messageStatus,
      },
      null,
      2
    ),
  };



   
 

};