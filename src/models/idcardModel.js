import rp from 'request-promise';
import request from 'request';
import fs from 'fs';
import configurator from '../config/configurator';
let config = configurator.get();

const options = {
            method: 'GET',
            url: "",
            agentOptions: {
                pfx: fs.readFileSync(__dirname + "/../" + config.certificate),
                passphrase: config.passphrase,
                securityOptions: 'SSL_OP_NO_SSLv3'
            }
        };

export default {
    get: (cardnum) => {
        config = configurator.get();
        let magstrip = "", rfid = "";
        if(cardnum.length === 16) {
            if(cardnum[0] !== ';') {
                rfid = cardnum;
            } else if(cardnum[0] === ';') {
                magstrip = cardnum.slice(1,14);
            } else {
                throw new IDCardFormatError("Invalid Card Number");
            }
        } else if(cardnum.length === 14) {
            magstrip = cardnum;
        } else {
            throw new IDCardFormatError("Invalid Card Number");
        }
        let opts = Object.assign({}, options, { 
            url: config.idcardBaseUrl +  "?mag_strip_code=" + magstrip + "&prox_rfid=" + rfid,
            json: true
        });

        return rp(opts)
          .then((parsedBody) => {
            return parsedBody.Cards[0].RegID;
          })
          .catch((err) => {
              throw err;
          });
    },
    getPhoto: (regId) => {
        config = configurator.get();
        let opts = Object.assign({}, options, { 
            url: config.photoBaseUrl + regId + '-large.jpg',
            encoding: null
        });
        return new Promise(function(resolve, reject) {
            // Have to use request instead of request-promise as we need a buffer to convert to base64
            request.get(opts, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                    resolve(data);
                } else {
                    reject(new IDCardFormatError("Photo not found", 404));
                }
            });
        });
    }
}

function IDCardFormatError(message, code = 400) {
   this.message = message;
   this.statusCode = code;
   this.toString = function() {
      return this.message;
   };
}