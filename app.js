var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hummus  = require('hummus');
var tmp = require('tmp');
var {exec} = require('child_process')
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ticket', function(req, res){
console.log('hi');
  /* GET users listing. */
    var pdfWriter = hummus.createWriterToModify('tickets.pdf', {
        modifiedFilePath: './ab.pdf'
    });

    var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');

pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');
pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');
pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');
pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');
    let axis = {
        seat_class:{x:270,y:230,size:15},
        date:{x:312, y:210,size:15},
        time:{x:320, y:198,size:11},
        leftBase:{x:10, y:195, size:9},
        rightBase:{x:150, y:195, size:9}
    };
    let n=0;
    console.log(n++);
     if(!req.body || !req.body.data) {
        req.body.data = [{
            show_date:new Date(2017,7,20,3,50),
            seat_class:'R',
            seat_price:50000,
            seat_position:{
                col:'가',
                num:5
            }
        },{
            show_date:new Date(2017,7,20,3,50),
            seat_class:'R',
            seat_price:50000,
            seat_position:{
                col:'가',
                num:5
            }
        },{
            show_date:new Date(2017,7,20,3,50),
            seat_class:'R',
            seat_price:50000,
            seat_position:{
                col:'가',
                num:5
            }
        },{
            show_date:new Date(2017,7,20,3,50),
            seat_class:'R',
            seat_price:50000,
            seat_position:{
                col:'가',
                num:5
            }
        },{
            show_date:new Date(2017,7,20,3,50),
            seat_class:'R',
            seat_price:50000,
            seat_position:{
                col:'가',
                num:5
            }
        }]
     }
    console.log(n++);

    const days=['일','월','화','수','목','금','토'];
    let dateObj = new Date(req.body.data[0].show_date);
    let month =(dateObj.getMonth()+1) ;
    let date =dateObj.getDate() ;
    let day =dateObj.getDay() ;
    let hours =dateObj.getHours() ;
    let minutes =dateObj.getMinutes();

    console.log(n++);

    let data = {
        seat_class:req.body.data[0].seat_class,
        date: month+'/'+date+'·'+days[day],
        time: hours+'시'+minutes+'분',
        datetime:'공연시간 : '+month+'.'+date+'.'+days[day]+' / '+ hours+'시 '+minutes+'분',
        seat_price:req.body.data[0].seat_price,
        number : req.body.data.length,
        seats_picked: []
    };

    console.log(n++);

    
    for(let d of req.body.data) {
        data.seats_picked.push({
            col:d.seat_position.col,
            num:d.seat_position.num
        })
    }

    console.log(n++);

    
    if(data.seat_class==='VIP')
        axis.seat_class.x=263;
    if(data.date.length===5)
        axis.date.x = 317;
    if(data.date.length===7)
        axis.date.size=13;
    if(data.time.length===5)
        axis.time.x=317;
    if(data.time.length===6){
        axis.time.size=10;
        axis.time.x=315;
    }
    if(data.seats_picked.length<6) {
        axis.leftBase.y -= (axis.leftBase.size + 2);
        axis.rightBase.y -= (axis.rightBase.size + 2);
    }


    console.log(n++);

    
    pageModifier.startContext().getContext()
        .writeText(
            data.seat_class,
            axis.seat_class.x, axis.seat_class.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.seat_class.size,color:'white'}
        )
        .writeText(
            '석',
            270, 220,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:10,color:'white'}
        )
        .writeText(
            data.seat_class,
            axis.seat_class.x-260, axis.seat_class.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.seat_class.size,color:'white'}
        )
        .writeText(
            '석',
            10, 220,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:10,color:'white'}
        )
        .writeText(
            '소월아트홀',
            315,225,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:9,color:'white'}
        )
        .writeText(
            data.date,
            axis.date.x,axis.date.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.date.size,color:'white'}
        )
        .writeText(
            data.time,
            axis.time.x,axis.time.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.time.size,color:'white'}
        )
        .writeText(
            data.datetime,
            axis.leftBase.x, axis.leftBase.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
        .writeText(
            '인원 : '+data.number+' 명',
            axis.leftBase.x, axis.leftBase.y-(axis.leftBase.size+2),
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
        .writeText(
            '좌석 : '+data.seat_class+'석 '+data.seat_price+'원',
            axis.leftBase.x, axis.leftBase.y-(axis.leftBase.size+2)*2,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
        .writeText(
            '소월아트홀',
            axis.leftBase.x, 90,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
        .writeText(
            data.datetime,
            axis.rightBase.x, axis.rightBase.y,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.rightBase.size,color:'black'}
        )
        .writeText(
            '인원 : '+data.number+' 명',
            axis.rightBase.x, axis.rightBase.y-(axis.rightBase.size+2),
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.rightBase.size,color:'black'}
        )
        .writeText(
            '좌석 : '+data.seat_class+'석 '+data.seat_price+'원',
            axis.rightBase.x, axis.rightBase.y-(axis.rightBase.size+2)*2,
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.rightBase.size,color:'black'}
        );

    console.log(n++);

    
    for(let i=0;i<Math.ceil(data.seats_picked.length/2);i++) {
        let con = pageModifier.startContext().getContext();
        let index = i*2;
        let str = data.seats_picked[index].col+'-열 '+data.seats_picked[index].num+'번 ';
        if(data.seats_picked[index+1]){
            index++;
            str += data.seats_picked[index].col+'-열 '+data.seats_picked[index].num+'번';
        }
        con.writeText(
            str,
            axis.leftBase.x, axis.leftBase.y-(axis.leftBase.size+2)*(3+i),
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
    }
    for(let i=0;i<Math.ceil(data.seats_picked.length/5);i++) {
        let con = pageModifier.startContext().getContext();
        let index = i*5;
        let str = '';
        for(let j=0;data.seats_picked[index+j] && j<5;j++)
            str += data.seats_picked[index+j].col+'-열 '+data.seats_picked[index+j].num+'번 ';
        con.writeText(
            str, axis.rightBase.x, axis.rightBase.y-(axis.rightBase.size+2)*(3+i),
            {font:pdfWriter.getFontForFile('./malgunbd.ttf'),size:axis.leftBase.size,color:'black'}
        )
    }

    console.log(n++);

    console.log('final');
    pageModifier.endContext().writePage();
    new Promise((resolve, reject) => {
        pdfWriter.end();
        resolve()
    }).then(() => {
        console.log('exec');
        exec('sumatraPDF'+' '+'ab.pdf'+' '+'-print-to-default -print-settings "1"');
         res.end();
    })

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
