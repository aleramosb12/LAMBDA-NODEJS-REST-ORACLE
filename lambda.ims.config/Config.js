const Constantes = require('../ripley.ims.util/Constantes');

let DBconfig = {
  user: process.env.db_user,
  password: process.env.db_password,
  connectString: process.env.db_ip + Constantes.CONST_PUNTOS + process.env.db_port + Constantes.CONST_ESLASH + process.env.db_instance,
};

let APIconfig = {
  host: process.env.api_host,
  port: process.env.api_port,
  path: process.env.api_path,
  method: process.env.api_method,
  headers: {
    'Content-Type': process.env.api_context_type,
    'Authorization': process.env.api_Authorization
  },
  api_Encoding: process.env.api_Encoding,
};

module.exports = {
  DBconfig,
  APIconfig
};