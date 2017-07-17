var hummus  = require('hummus');


/* GET users listing. */
var pdfWriter = hummus.createWriterToModify('./tickets.pdf', {
    modifiedFilePath: './ab.pdf'
});

var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
pdfWriter.appendPDFPagesFromPDF('./tickets.pdf');

let axis = {
    seat_class:{x:270,y:230,size:15},
    date:{x:312, y:210,size:15},
    time:{x:320, y:198,size:11},
    leftBase:{x:10, y:195, size:9},
    rightBase:{x:150, y:195, size:9}
};
let data = {
    seat_class:'R',
    date : '7/28·금',
    time:'7시0분',
    datetime:'공연시간 : 7.28.금 / 7시 0분',
    seats_picked :[
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
        {
            col:'가',
            num:24
        },
    ]
};


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


pageModifier.startContext().getContext()
    .writeText(
    data.seat_class,
    axis.seat_class.x, axis.seat_class.y,
    {font:pdfWriter.getFontForFile('./MyriadPro-Bold.otf'),size:axis.seat_class.size,color:'white'}
    )
    .writeText(
        '석',
        270, 220,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttF'),size:10,color:'white'}
    )
    .writeText(
        data.seat_class,
        axis.seat_class.x-260, axis.seat_class.y,
        {font:pdfWriter.getFontForFile('./MyriadPro-Bold.otf'),size:axis.seat_class.size,color:'white'}
    )
    .writeText(
        '석',
        10, 220,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttF'),size:10,color:'white'}
    )
    .writeText(
        '소월아트홀',
        315,225,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:9,color:'white'}
    )
    .writeText(
        data.date,
        axis.date.x,axis.date.y,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.date.size,color:'white'}
    )
    .writeText(
        data.time,
        axis.time.x,axis.time.y,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.time.size,color:'white'}
    )
    .writeText(
        data.datetime,
        axis.leftBase.x, axis.leftBase.y,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.leftBase.size,color:'black'}
    )
    .writeText(
        '인원 : 10 명',
        axis.leftBase.x, axis.leftBase.y-(axis.leftBase.size+2),
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.leftBase.size,color:'black'}
    )
    .writeText(
        '좌석 : R석 25000원',
        axis.leftBase.x, axis.leftBase.y-(axis.leftBase.size+2)*2,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.leftBase.size,color:'black'}
    )
    .writeText(
        '소월아트홀',
        axis.leftBase.x, 90,
        {font:pdfWriter.getFontForFile('./NanumGothicBold.ttf'),size:axis.leftBase.size,color:'black'}
    )
    .writeText(
        data.datetime,
        axis.rightBase.x, axis.rightBase.y,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.rightBase.size,color:'black'}
    )
    .writeText(
        '인원 : 10 명',
        axis.rightBase.x, axis.rightBase.y-(axis.rightBase.size+2),
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.rightBase.size,color:'black'}
    )
    .writeText(
        '좌석 : R석 25000원',
        axis.rightBase.x, axis.rightBase.y-(axis.rightBase.size+2)*2,
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.rightBase.size,color:'black'}
    );

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
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.leftBase.size,color:'black'}
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
        {font:pdfWriter.getFontForFile('./NanumGothicExtraBold.ttf'),size:axis.leftBase.size,color:'black'}
    )
}






pageModifier.endContext().writePage();
pdfWriter.end();

