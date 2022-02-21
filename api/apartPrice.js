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
        // url : `${url}LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&serviceKey=${serviceKey}`
        url : `${url}LAWD_CD=11545&DEAL_YMD=202101&serviceKey=${serviceKey}`
    }

    request(option, function(error,response,body){
    if(error) new Error('400');
    
    var xmlToJson = convert.xml2json(response.body, {compact: true, spaces: 4});
    var jsonVal = JSON.parse(xmlToJson);
    var testVal = jsonVal['response']['body']['items']['item'];
    console.log(testVal);
    
    // for(i in testVal){
    //   if(testVal[i]['as1']===undefined) {testVal[i]['as1']={_text:''} } 
    //   if(testVal[i]['as2']===undefined) {testVal[i]['as2']={_text:''} } 
    //   if(testVal[i]['as3']===undefined) {testVal[i]['as3']={_text:''} } 
    //   if(testVal[i]['as4']===undefined) {testVal[i]['as4']={_text:''} } 
    //   // console.log(testVal[i]);

    //     // console.log(testVal[i]['kaptName']['_text'])
    //     // console.log(testVal[i]['as1']['_text']);
    //     // console.log(testVal[i]['as2']['_text']);
    //     // console.log(testVal[i]['as3']['_text']);
    //     // console.log(testVal[i].['as4'][._text]);
    //     Apartment.create({
    //         bjdCode : testVal[i]['bjdCode']['_text'],
    //         kaptName: testVal[i]['kaptName']['_text'],

    //         as1 : testVal[i]['as1']['_text'],
    //         as2 : testVal[i]['as2']['_text'],
    //         as3 : testVal[i]['as3']['_text'],
    //         as4 : testVal[i]['as4']['_text'] ,
            
    //     });
    //     }

   // console.log(jsonVal['response']['body']['items']['item']['kaptName'] );
})
  }


// const apartmentdata = ()