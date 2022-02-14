const convert = require('xml-js');


module.exports.xmlToJson = param => {
    var xmlToJsonVal = convert.xml2json(param, {compact: true, spaces: 4});
    return JSON.parse(xmlToJsonVal);

}