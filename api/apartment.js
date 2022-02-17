const request = require('request');
// const convert = require('xml-js');
const {Apartment,sequelize} = require('../models');
const {xmlToJson} = require('../module');
const res = require('express/lib/response');

// const ServiceKey = 'CBTMH%2F%2F2byGmVDlIOfwujuFQDtX5a%2BYMzA%2BesYsZNzaKjctiVKg2XOONAJdDOlL%2FIPUnCEueAJGQejFQMqdovw%3D%3D';
// const url = 'http://apis.data.go.kr/1613000/AptListService2/getTotalAptList?';
// const numOfRows = 20000
const reqUrl = 'http://apis.data.go.kr/1613000/AptListService2/getTotalAptList?ServiceKey=CBTMH%2F%2F2byGmVDlIOfwujuFQDtX5a%2BYMzA%2BesYsZNzaKjctiVKg2XOONAJdDOlL%2FIPUnCEueAJGQejFQMqdovw%3D%3D&numOfRows=';




  module.exports.getApartments = count=>{
    const option = {
        methods:'GET',
        url : reqUrl+count,
    }

    request(option, function(error,response,body){
    if(error) new Error('400');
    
    var jsonVal = xmlToJson(response.body);
    var result = jsonVal['response']['body']['items']['item'];
    // console.log(result);
    
    for(i in result){
      if(result[i]['as1']===undefined) {result[i]['as1']={_text:''} } 
      if(result[i]['as2']===undefined) {result[i]['as2']={_text:''} } 
      if(result[i]['as3']===undefined) {result[i]['as3']={_text:''} } 
      if(result[i]['as4']===undefined) {result[i]['as4']={_text:''} } 
 
        Apartment.create({
            bjdCode : result[i]['bjdCode']['_text'],
            kaptName: result[i]['kaptName']['_text'],
            // doroJuso : result[i]['doroJuso']['_text'],
            as1 : result[i]['as1']['_text'],
            as2 : result[i]['as2']['_text'],
            as3 : result[i]['as3']['_text'],
            as4 : result[i]['as4']['_text'] ,
            as5 : `${result[i]['as1']['_text']} ${result[i]['as2']['_text']} ${result[i]['as3']['_text']} ${result[i]['as4']['_text']} ${result[i]['kaptName']['_text']}`
            
        });
        }

})
  }

  //도로명 가져오는 함수 
  module.exports.getAddress = ()=>{

    const getAddressUrl = 'https://www.juso.go.kr/addrlink/addrLinkApi.do?&'
    const keyword = '';
    const confmKey = 'U01TX0FVVEgyMDIyMDIxNDE5MDMyNTExMjI0NDg=' ;
  }

  //아파트 앞자리 5개 리스트 

  module.exports.getBjdCdList =async ()=>{
    // 전국/
    // var query = "SELECT C.BJDCD ,CONCAT(C.AS1,' ',C.AS2) AS BJDNM FROM    (SELECT left(bjdcode,5)AS BJDCD ,AS1,AS2 FROM apartments  GROUP BY BJDCD ORDER BY AS1)AS C";
    
    
    //서울 //
    var query = "SELECT  C.BJDCD ,CONCAT(C.AS1,' ',C.AS2) AS BJDNM FROM    (SELECT left(bjdcode,5)AS BJDCD ,AS1,AS2 FROM apartments  WHERE LEFT(bjdCode,2) ='11' GROUP BY BJDCD ORDER BY AS1)AS C";
  
    try{

      var result = await  sequelize.query(query, { type:sequelize.QueryTypes.SELECT})
      
      return result.reduce((acc,obj)=>{
        let arr=[];
        
        arr.push(obj['BJDCD']);
        arr.push(obj['BJDNM']);
        acc.push(arr);
        return acc;
      },[]);

      
          // console.log(result.map(i=>i.BJD));
          // return result.map(i=>i.BJD);
      }catch(err){
        console.error(err);
      }
      
  }

  