const request = require('request');
const {ApartmentPrice,Op} = require('../../models');

module.exports.updateLocation = async (noLocationList) =>{
    console.log("확인")
    // try{
        
        
        // for(var i in noLocationList){
            const option = {
                url: `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(noLocationList[1]['address'])}`,
                methods: 'GET',
                headers : {
                    Authorization : 'KakaoAK 064940e08c54717d89d8728298c08b71'
                },
                // query : noLocationList[0]['address']
            }
            request(option, async (error,response) =>{
                
                console.log("에러내용",error);
                console.log(response);
                if(error) new Error('400');
                // console.log("===========몇번쨰리퀘스트???",i);
                var result = JSON.parse(response.body);
                
                //  result.documents[0].x   // result.documents[0].y 
                // var jsonVal = xmlToJson(response.body);
                // console.log(jsonVal);
                
                await ApartmentPrice.update({
                    xlocation :  result.documents[0].x ,
                    ylocation : result.documents[0].y 
                },
                {where : {id: noLocationList[1]['id']}})
            }) 
        // }
        // return Promise.resolve("complete");
    // }catch(err){
    //     console.log(err);
    //     new Error('getNOlocation 에러')
    // }
    return ;
}