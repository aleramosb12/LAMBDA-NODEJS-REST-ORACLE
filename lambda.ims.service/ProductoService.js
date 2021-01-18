const ProductoDAO = require('../ripley.ims.dao/ProductoDAO');
const Util = require('../ripley.ims.util/Util');
const Constantes = require('../ripley.ims.util/Constantes');


module.exports = {
  getProductoStockIncremental
};

async function getProductoStockIncremental() {

  let resultDB;
  let resultS3;
  let resultHttp;
  let resultRollbackDB;
  let resultResponse;


  console.info("Ejecucion del metodo getProductosStockIncremental del objeto ProductoService");
  resultDB = await ProductoDAO.getProductoStockIncremental();

  if (resultDB.result !== Constantes.CONST_COD_OK && resultDB.result !== Constantes.CONST_VACIO) {

    resultS3 = await Util.uploadS3(resultDB.result);
    resultHttp = await Util.httpsPost(resultDB.result);
    
    if (resultHttp == Constantes.CONST_COD_ERROR) {
      resultRollbackDB = await ProductoDAO.rollbackProductosStockIncremental(resultDB.id_proceso);
      if (Constantes.CONST_COD_OK == resultRollbackDB) {
        resultResponse = { statusCode: Constantes.CONST_MSG_OK, messageStatus: "Se realizo el rollback correctamente." }
      } else {
        resultResponse = { statusCode: Constantes.CONST_MSG_ERROR, messageStatus: "El rollback no se realizo correctamente.." }
      }
    } else {
      resultResponse = { statusCode: Constantes.CONST_MSG_OK, messageStatus: "Se realizo la carga correctamente en IMS" }
    }

  } else {

    resultResponse = { statusCode: Constantes.CONST_MSG_OK, messageStatus: "No se movio stock en IMS" }

  }

  return resultResponse;

}
