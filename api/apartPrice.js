const request = require('request');
const convert = require('xml-js');
const {Apartment} = require('../models');

const serviceKey = 'CBTMH%2F%2F2byGmVDlIOfwujuFQDtX5a%2BYMzA%2BesYsZNzaKjctiVKg2XOONAJdDOlL%2FIPUnCEueAJGQejFQMqdovw%3D%3D';
const url = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?type=xml&';
let LAWD_CD = ''
let DEAL_YMD = '';




  module.exports = ()=>{

 
    
    const option = {
        methods:'GET',
        url : `${url}LAWD_CD=11545&DEAL_YMD=202101&serviceKey=${serviceKey}`
    }

    request(option, function(error,response,body){
    if(error) new Error('400');
    
    var xmlToJson = convert.xml2json(response.body, {compact: true, spaces: 4});
    var jsonVal = JSON.parse(xmlToJson);
    var testVal = jsonVal['response']['body']['items']['item'];
    console.log(testVal);
    

})
  }


// const apartmentdata = ()