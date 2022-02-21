const express = require('express');
var path = require('path');
var behave = require('./behave');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');
const { sequelize} = require('./models');
let request = require('request');
const convert = require('xml-js');
const {Apartment} = require('./models');
const { resolve } = require('path');
const {makeMonthArr } =require('./module');


const app = express();

sequelize.sync({})
.then(()=>{console.log('데이터베이스 성공')
})
.catch((error)=>{
    console.log('에러')
});

var showLog = (req,res,next)=>{
    console.log("로그중");
    next();
}
//웬만한 미들웨어는 next가 내부적으로 존재 , express.static 파일이 존재할시 next x 없으면 next
app.use(morgan('dev'));
// app.use('/',
// (req,res,next)=>{

    // console.log("req.session값 ::::::::::" , req.session);
    // if(req.session.id){
        express.static(path.join(__dirname,'public'));
    // }else{
    //     next();
    // }
// }
// );


//운영용 app.use(morgan('combined'));
app.use(cookieParser('test'))
app.use(express.json()); //클라이언트에서 json 형식으로 데이터를 보내줬을때 req.body 로 받아서 바로쓸수있게 해줌
app.use(express.urlencoded({extend:true}));   //form데이터를 파싱해줌 , extend true면 qs ,false면 querystring
app.use(session({

    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly : true,
    },
}

));
app.use(multer().array());
//form데이터중 이미지를 urlencoded가 해결해줄수없어서 multer 사용



app.use('/showLog',showLog);
app.use('/behave',behave);

////////////라우터간에 데이터 공유할떄 ::: req.data (요청한번 다 훑고나면 메모리에서정리됨)  ,,, req.session.data(세션유지시 계속유지)
app.use((req,res,next)=>{
    console.log("테스트1");
    next();
},(req,res,next)=>{
    try{
        next();
        // console.log(aaaaaaaaaaaaaaa);
    }catch(error){
        next(error);
    }
})

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(404).send('404에러페이쥐');
})

app.get('/',(req,res)=>{
    console.log(req.session)   //사용자의 세션
    // res.cookie('name',encodeURIComponent('123'),{
    //     expires:new Date(),
    //     httpOnly : true,
    //     path:'/'
    // });
    // res.cookie('name','hi');

    res.sendFile(path.join(__dirname,'test.html'));

});
//전국아파트 api 호출 및 db저장 
app.get('/getApartments',async (req,res)=>{
    try{
         const {getApartments } = require('./api/apartment');
         getApartments(20000,req,res);
    }catch(err){
        console.log(err);
    }
});
//미정
// app.get('/getAddress',async (req,res)=>{
//     try{
//          const {getAddress} =  require('./api/apartment');
//         getAddress();
//     }catch(err){
//         console.log(err);
//     }
// });

//법정동 리스트를 가져와서 하루 트래픽 초과를 하지않는선에서 넣어줘야한다.
//( 배치작업 필요)
app.get('/getBjdCdList/:year',async (req,res,next)=>{
    
    try{

        const year = req.params.year;
         const {getBjdCdList} = require('./api/apartment');
         
         const result = await getBjdCdList() ;
        // const result = [[ '42150', '강원도 강릉시' ],[ '42110', '강원도 춘천시' ],[ '42130', '강원도 원주시' ]];
        const {getTrade} = require('./api/trade');


        let yymmList = makeMonthArr(year)
        
       
        
        var i = 0 ; var j = 0 ;
        var cnt = 0 ; 

            var run = setInterval(()=>{
                if(cnt ==result.length * yymmList.length) {
                    clearInterval(run);
                    console.log("수집종료");
                    return res.json(`${year}년도 수집완료`);
                }else{
                    if(i<result.length){

                        getTrade(result[i] , yymmList[j]);
                        cnt++; i++;
                    }else if( i >=result.length){
                        j++ ; i=0;
                    }
                }
            }, 10);

    }catch(err){
        console.log(err);
        next();
    }

});
//좌표설정이 안된 거래들 찾아서 좌표 넣어준다. 하루 10만건 , 한달 300만건제한있음 .
app.get('/setLocation',async (req,res,next)=>{

    const {getNolocation} =require('./api/trade');
    const locationList = await getNolocation();
    const {updateLocation} = require('./api/trade/location');

    var i = 0 ; 
    var run = setInterval(()=>{
         if(i ==locationList.length) {
             clearInterval(run);
             console.log("수집종료 ")
         }else{
             updateLocation(locationList[i]);
             i++
         }
    }, 10)
        // console.log(locationList[i])
        //     setTimeout(()=>{
        //     updateLocation(locationList[i]);    
        // } , 3000);

});




app.get('/addApart',async (req,res)=>{
    
    try{

         const addApart = require('./api/apartPrice');

        addApart();

    }catch(err){
        console.log(err);
    }


});

// app.get('/abc',(err,req,res,next)=>{
//     // res.send('hi');
//     console.error(err);
//     next(err);
// });


app.listen(3000,()=>{
    console.log("서버 실행")
});