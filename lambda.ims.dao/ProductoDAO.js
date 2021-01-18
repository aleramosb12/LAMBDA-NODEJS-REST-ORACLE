const Config = require('../ripley.ims.config/Config');
const oracledb = require('oracledb');
const Constantes = require('../ripley.ims.util/Constantes');

module.exports = {
  getProductoStockIncremental,
  rollbackProductosStockIncremental
};

async function getProductoStockIncremental() {

  console.info("Inicio de ejecucion del metodo getProductoStockIncremental del objeto ProductoDAO");

  let connection;
  let resultSet;
  let i = 1;
  let row;
  let rs = Constantes.CONST_VACIO;
  let id_proceso;

  try {


    connection = await oracledb.getConnection(Config.DBconfig);
    const result = await connection.execute(

      `begin
          `+ process.env.db_ims_procedure_incremental + `(
             :in_origen, 
             :in_usuario, 
             :in_version, 
             :in_lista_sku, 
             :out_error_num, 
             :out_error_msg, 
             :out_cursor, 
             :out_id_proceso
             );
         end;
        `, {
      in_origen: process.env.db_ims_procedure_incremental_in_origen,
      in_usuario: process.env.db_ims_procedure_incremental_in_usuario,
      in_version: process.env.db_ims_procedure_incremental_in_version,
      in_lista_sku: Constantes.CONST_VACIO,
      out_error_num: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      out_error_msg: { val: Constantes.CONST_VACIO, dir: oracledb.BIND_INOUT },
      out_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      out_id_proceso: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    }
    );

    resultSet = result.outBinds.out_cursor;
    id_proceso = result.outBinds.out_id_proceso;

    while ((row = await resultSet.getRow())) {
      rs = rs + row[0] + Constantes.CONST_COMA + row[1] + Constantes.CONST_COMA + row[2] + Constantes.CONST_SALTO_LINEA
      i++
    }
    console.info("Se ejecuto correctamente el procedure " + process.env.db_ims_procedure_incremental + " con id de proceso " + id_proceso);

    return { statusCode: Constantes.CONST_COD_OK, result: rs, idProceso: id_proceso };

  } catch (error) {

    console.error("Se presento un error en el procedure " + process.env.db_ims_procedure_incremental, error);
    return { statusCode: Constantes.CONST_COD_ERROR, result: rs, idProceso: id_proceso };

  } finally {
    try {

      console.info("Fin de ejecucion del metodo getProductoStockIncremental del objeto ProductoDAO");
      await connection.close();

    } catch (error) {

      console.error("Se presento un error al cerrar la BD del procedure " + process.env.db_ims_procedure_incremental, error);
      console.info("Fin de ejecucion del metodo getProductoStockIncremental del objeto ProductoDAO");
      return { statusCode: Constantes.CONST_COD_ERROR, result: rs, idProceso: id_proceso };

    }
  }
}

async function rollbackProductosStockIncremental(id_proceso) {

  console.info("Inicio de ejecucion del metodo rollbackProductosStockIncremental del objeto ProductoDAO");

  let connection;
  let resultSet;

  try {

    connection = await oracledb.getConnection(Config.DBconfig);
    const result = await connection.execute(

      `begin
          :out_result := `+ process.env.db_ims_procedure_incremental_rollback + `(
             :in_id_proceso
             );
         end;
        `, {
      in_id_proceso: id_proceso,
      out_result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    }
    );

    console.info("Se ejecuto correctamente el procedure " + process.env.db_ims_procedure_incremental_rollback);

    return Constantes.CONST_COD_OK;

  } catch (error) {

    console.error("Se presento un error en el procedure " + process.env.db_ims_procedure_incremental_rollback, error);
    console.info("Fin de ejecucion del metodo rollbackProductosStockIncremental del objeto ProductoDAO");

    return Constantes.CONST_COD_ERROR;

  } finally {
    try {

      console.info("Fin de ejecucion del metodo rollbackProductosStockIncremental del objeto ProductoDAO");
      await connection.close();

    } catch (error) {

      console.error("Se presento un error al cerrar la BD del procedure " + process.env.db_ims_procedure_incremental_rollbackF, error);
      console.info("Fin de ejecucion del metodo rollbackProductosStockIncremental del objeto ProductoDAO");
      return { statusCode: Constantes.CONST_COD_ERROR };

    }
  }
}