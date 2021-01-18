const Constantes = require('../ripley.ims.util/Constantes');
const Config = require('../ripley.ims.config/Config');
var https = require('https');
var AWS = require('aws-sdk');
var moment = require('moment');

module.exports = {
    httpsPost,
    uploadS3
};

async function httpsPost(data) {

    console.info("Inicio de ejecucion del servicio de " + Config.APIconfig.path);
    try {
        await doRequest(data)
        console.info("Fin de ejecucion del servicio de " + Config.APIconfig.path);
        return Constantes.CONST_COD_OK
    } catch (error) {
        console.error("Se presento un problema al ejecutar el servicio de " + Config.APIconfig.path, error);
        console.info("Fin de ejecucion del servicio de " + Config.APIconfig.path);
        return Constantes.CONST_COD_ERROR

    }

};

async function uploadS3(data) {

    console.info("Inicio de ejecucion del metodo uploadS3");

    try {
        await doS3(data)
        console.info("Fin de ejecucion del metodo uploadS3");
        return Constantes.CONST_COD_OK
    } catch (error) {

        console.error("Se presento un problema al realizar la carga en el S3 " + process.env.bucket_host, error);
        console.info("Fin de ejecucion del metodo uploadS3");
        return Constantes.CONST_COD_ERROR
    }


};

function doRequest(data) {
    return new Promise((resolve, reject) => {
        const req = https.request(Config.APIconfig, (res) => {
            res.setEncoding(Config.APIconfig.api_Encoding);
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                resolve(responseBody);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data)
        req.end();

    });
}

function doS3(data) {

    return new Promise((resolve, reject) => {

        const accessKeyId = process.env.bucket_key_id;
        const secretAccessKey = process.env.bucket_access_key;
        const region = process.env.bucket_region

        AWS.config.update(
            {
                accessKeyId,
                secretAccessKey,
                region
            }
        );

        var s3 = new AWS.S3();

        var params = {
            Bucket: process.env.bucket_host,
            Key: process.env.bucket_name + moment().format(Constantes.CONST_FORMATO_FECHA_S3) + process.env.bucket_extencion,
            Body: data
        };

        s3.createBucket({ Bucket: process.env.bucket_host }, function () {

            s3.putObject(params, function (err) {
                if (err) {
                    console.error("No se pudo realizar la carga en S3 ", error);
                    reject(Constantes.CONST_COD_ERROR);
                } else {
                    console.info("Se realizo la carga en S3 correctamente.");
                    resolve(Constantes.CONST_COD_OK);
                }

            });
        });
    });

};