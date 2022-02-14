const {ApartmentPrice,Op} = require('../models');
const request = require('request');
const {xmlToJson} = require('../module');

module.exports.getTrade = async (param)=>{
    //param : [[지역번호,지역이름],[지역번호,지역이름]...... ];
    const tradeSecretEnKey = 'CBTMH%2F%2F2byGmVDlIOfwujuFQDtX5a%2BYMzA%2BesYsZNzaKjctiVKg2XOONAJdDOlL%2FIPUnCEueAJGQejFQMqdovw%3D%3D';
    const tradeSecretDeKey = 'CBTMH//2byGmVDlIOfwujuFQDtX5a+YMzA+esYsZNzaKjctiVKg2XOONAJdDOlL/IPUnCEueAJGQejFQMqdovw==';
    const tradeUrl = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?type=xml';
    
    //LAWD_CD 5자리 분류 -247개  *4 하루에 전국 4개달 씩 가능

    //LAWD_CD : 11110 , DEAL_YMD : 201512 ,serviceKey :인코딩 or 디코딩 키 
    // let LAWD_CD = '';
    //let DEAL_YMD='';
    let LAWD_CD = param[0][0];         //테스트후 첫번쨰 배열자리 동적으로변경
    let DEAL_YMD='202112';
    // const serviceKey = '';
    let LAWD_NM = param[0][1];         //테스트후 첫번쨰 배열자리 동적으로변경

    // for()
    const option ={
        methods:'GET',
        url : `${tradeUrl}&LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&serviceKey=${tradeSecretEnKey}`
    }
    console.log(option);

    request(option, (err,res)=>{
        var jsonVal = xmlToJson(res.body);
        var result = jsonVal['response']['body']['items']['item'];
        console.log(result);
        
        for(var i  in result ){

            // if(result[i]['해제여부']===undefined) {result[i]['해제여부']={_text:'X'} }

            ApartmentPrice.create({
                dealAmount: result[i]['거래금액']['_text'].trim(),               //거래금액
                buildYear : result[i]['건축년도']['_text']  ,             //건축년도
                dong : result[i]['법정동']['_text']  ,                   //법정동
                aprtmentName : result[i]['아파트']['_text']  ,           //아파트명
                dealYear : result[i]['년']['_text'],                      //년
                dealMonth : result[i]['월']['_text'],                     //월
                dealDay : result[i]['일']['_text'],                       //일
                areaForExUse : result[i]['전용면적']['_text'],            //전용면적
                jibun : result[i]['지번']['_text'],                       //지번
                regionCd : result[i]['지역코드']['_text'],                //지역코드
                floor : result[i]['층']['_text'],                         //층
                cancelType : result[i]['해제여부']['_text'],              //해제여부 
                address : `${LAWD_NM} ${result[i]['법정동']['_text']} ${result[i]['지번']['_text']}`
            });
        }

        //시도 + 시군구 + 읍면동 _번지 검색하면 주소정확히나옴
    });

}   

module.exports.getNolocation =async ()=>{
    return await ApartmentPrice.findAll({
        attirbutes: ['address'],
        where : {
            xlocation : {[Op.eq]: null },
            ylocation : {[Op.eq]: null },    }
    });
}