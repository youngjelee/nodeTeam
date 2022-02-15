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
    //     express.static(path.join(__dirname,'public'))(req,res,next)
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
app.get('/getApartments',async (req,res)=>{
    try{
         const {getApartments } = require('./api/apartment');
         getApartments(20000);
    }catch(err){
        console.log(err);
    }
});
//미정
app.get('/getAddress',async (req,res)=>{
    try{
         const {getAddress} =  require('./api/apartment');
        getAddress();
    }catch(err){
        console.log(err);
    }
});

//법정동 리스트를 가져와서 하루 트래픽 초과를 하지않는선에서 넣어준다 
//( 배치작업 필요)
app.get('/getBjdCdList',async (req,re,next)=>{
    
    try{
         const {getBjdCdList} = require('./api/apartment');
        const result = await getBjdCdList() ;
        
        //  return res.send(result);

        //리스트로  하루에 4개월치 데이터 저장하기 
        const {getTrade} = require('./api/trade');
        getTrade(result);

    }catch(err){
        console.log(err);
        next();
    }

});
//좌표설정이 안된 거래들 찾아서 좌표 넣어준다.
app.get('/setLocation',async (req,res,next)=>{

    const {getNolocation} =require('./api/trade');
    var noLocationList = await getNolocation();
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