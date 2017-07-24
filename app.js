import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import hummus from 'hummus';
import tmp from 'tmp';
import cors from 'cors';
import {exec} from 'child_process';

const app = express();
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ticket', (req, res) => {

    console.log(req.body.data.length+'명의 표 출력 시작');
    /*
    10명 이하만 가능
    티켓 좌석 제외 가격, 등급은 같아야 함

    req.body : {
    combine,
    data :
    [{
        seat_class,
        show_date,
        ticket_price,
        seat_position
    }]
    }
     */

    tmp.file((err, filepath, fd, cleanupCallback)=>{
        if (err) throw err;

        const PDF = filepath+'.pdf';
        let data;
        let pdfWriter = hummus.createWriter(PDF);

        new Promise((resolve, reject) => {
            let copyingContext = pdfWriter.createPDFCopyingContext(path.join(__dirname, '../public', '/tickets.pdf'));

            for(let i=0;i<req.body.data.length;i++) {
                let seat = req.body.data[i];

                if (seat.seat_class === 'R')
                    copyingContext.appendPDFPageFromPDF(0);
                else if (seat.seat_class === 'VIP')
                    copyingContext.appendPDFPageFromPDF(1);
                else
                    return null;

                if (req.body.combine)
                    break;
            }

            pdfWriter.end();
            resolve();
        }).then(() => {
            pdfWriter = hummus.createWriterToModify(PDF);

            for(let i=0;i<req.body.data.length;i++) {
                if(req.body.combine)
                    data = req.body.data;
                else
                    data = [req.body.data[i]];

                let axis = {
                    seat_class: {x: 270, y: 230, size: 15},
                    date: {x: 312, y: 210, size: 15},
                    time: {x: 320, y: 198, size: 11},
                    leftBase: {x: 10, y: 195, size: 9},
                    rightBase: {x: 150, y: 195, size: 9}
                };

                const days = ['일', '월', '화', '수', '목', '금', '토'];
                const dateObj = new Date(data[0].show_date);
                const month = (dateObj.getMonth() + 1);
                const date = dateObj.getDate();
                const day = dateObj.getDay();
                const hours = dateObj.getHours();
                const minutes = dateObj.getMinutes();

                let seats;
                seats = {
                    seat_class: data[0].seat_class,
                    date: month + '/' + date + '·' + days[day],
                    time: hours + '시' + minutes + '분',
                    datetime: '공연시간 : ' + month + '.' + date + '.' + days[day] + ' / ' + hours + '시 ' + minutes + '분',
                    ticket_price: data[0].ticket_price,
                    number: data.length,
                    seats_picked: []
                };

                for (let seat of data)
                    seats.seats_picked.push({
                        col: seat.seat_position.col,
                        num: seat.seat_position.num
                    })

                if (seats.seat_class === 'VIP')
                    axis.seat_class.x = 263;
                if (seats.date.length === 5)
                    axis.date.x = 317;
                if (seats.date.length === 7)
                    axis.date.size = 13;
                if (seats.time.length === 5)
                    axis.time.x = 317;
                if (seats.time.length === 6) {
                    axis.time.size = 10;
                    axis.time.x = 315;
                }

                if (seats.seats_picked.length < 6) {
                    axis.leftBase.y -= (axis.leftBase.size + 2);
                    axis.rightBase.y -= (axis.rightBase.size + 2);
                }


                let fontSRC = path.join(__dirname, '../public', '/malgunbd.ttf');
                let font;
                font = pdfWriter.getFontForFile(fontSRC);

                let pageModifier = new hummus.PDFPageModifier(pdfWriter, i);
                pageModifier.startContext().getContext()
                    .writeText(
                        seats.seat_class,
                        axis.seat_class.x, axis.seat_class.y,
                        {font: font,  size: axis.seat_class.size, color: 'white'}
                    )
                    .writeText(
                        '석',
                        270, 220,
                        {font: font, size: 10, color: 'white'}
                    )
                    .writeText(
                        seats.seat_class,
                        axis.seat_class.x - 260, axis.seat_class.y,
                        {font: font, size: axis.seat_class.size, color: 'white'}
                    )
                    .writeText(
                        '석',
                        10, 220,
                        {font: font, size: 10, color: 'white'}
                    )
                    .writeText(
                        '소월아트홀',
                        315, 225,
                        {font: font, size: 9, color: 'white'}
                    )
                    .writeText(
                        seats.date,
                        axis.date.x, axis.date.y,
                        {font: font, size: axis.date.size, color: 'white'}
                    )
                    .writeText(
                        seats.time,
                        axis.time.x, axis.time.y,
                        {font: font, size: axis.time.size, color: 'white'}
                    )
                    .writeText(
                        seats.datetime,
                        axis.leftBase.x, axis.leftBase.y,
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                    .writeText(
                        '인원 : ' + seats.number + ' 명',
                        axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2),
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                    .writeText(
                        '좌석 : ' + seats.seat_class + '석 ' + seats.ticket_price + '원',
                        axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2) * 2,
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                    .writeText(
                        '소월아트홀',
                        axis.leftBase.x, 90,
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                    .writeText(
                        seats.datetime,
                        axis.rightBase.x, axis.rightBase.y,
                        {font: font, size: axis.rightBase.size, color: 'black'}
                    )
                    .writeText(
                        '인원 : ' + seats.number + ' 명',
                        axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2),
                        {font: font, size: axis.rightBase.size, color: 'black'}
                    )
                    .writeText(
                        '좌석 : ' + seats.seat_class + '석 ' + seats.ticket_price + '원',
                        axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2) * 2,
                        {font: font, size: axis.rightBase.size, color: 'black'}
                    );

                for (let i = 0; i < Math.ceil(seats.seats_picked.length / 2); i++) {
                    let con = pageModifier.startContext().getContext();
                    let index = i * 2;
                    let str = seats.seats_picked[index].col + '-열 ' + seats.seats_picked[index].num + '번 ';
                    if (seats.seats_picked[index + 1]) {
                        index++;
                        str += seats.seats_picked[index].col + '-열 ' + seats.seats_picked[index].num + '번';
                    }
                    con.writeText(
                        str,
                        axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2) * (3 + i),
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                }
                for (let i = 0; i < Math.ceil(seats.seats_picked.length / 5); i++) {
                    let con = pageModifier.startContext().getContext();
                    let index = i * 5;
                    let str = '';
                    for (let j = 0; seats.seats_picked[index + j] && j < 5; j++)
                        str += seats.seats_picked[index + j].col + '-열 ' + seats.seats_picked[index + j].num + '번 ';
                    con.writeText(
                        str, axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2) * (3 + i),
                        {font: font, size: axis.leftBase.size, color: 'black'}
                    )
                }

                pageModifier.endContext().writePage();
                if(req.body.combine)
                    break;
            }
            return undefined
        })
            .then(() => {
                pdfWriter.end();
                return undefined
            })
            .then(() => {
                exec(path.join(__dirname,'../pdf','pdf')+' '+PDF+' '+'-print-to-default');

                console.log('표 출력 종료');
                return res.json(req.body.data);
            });
    });
});


app.listen(PORT, () => {
    console.log("표 출력 프로그램을 시작합니다.");
});