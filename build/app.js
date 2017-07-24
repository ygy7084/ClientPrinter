'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _hummus = require('hummus');

var _hummus2 = _interopRequireDefault(_hummus);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = 8081;

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.post('/ticket', function (req, res) {

    console.log(req.body.data.length + '명의 표 출력 시작');
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

    _tmp2.default.file(function (err, filepath, fd, cleanupCallback) {
        if (err) throw err;

        var PDF = filepath + '.pdf';
        var data = void 0;
        var pdfWriter = _hummus2.default.createWriter(PDF);

        new Promise(function (resolve, reject) {
            var copyingContext = pdfWriter.createPDFCopyingContext(_path2.default.join(__dirname, '../public', '/tickets.pdf'));

            for (var i = 0; i < req.body.data.length; i++) {
                var seat = req.body.data[i];

                if (seat.seat_class === 'R') copyingContext.appendPDFPageFromPDF(0);else if (seat.seat_class === 'VIP') copyingContext.appendPDFPageFromPDF(1);else return null;

                if (req.body.combine) break;
            }

            pdfWriter.end();
            resolve();
        }).then(function () {
            pdfWriter = _hummus2.default.createWriterToModify(PDF);

            for (var i = 0; i < req.body.data.length; i++) {
                if (req.body.combine) data = req.body.data;else data = [req.body.data[i]];

                var axis = {
                    seat_class: { x: 270, y: 230, size: 15 },
                    date: { x: 312, y: 210, size: 15 },
                    time: { x: 320, y: 198, size: 11 },
                    leftBase: { x: 10, y: 195, size: 9 },
                    rightBase: { x: 150, y: 195, size: 9 }
                };

                var days = ['일', '월', '화', '수', '목', '금', '토'];
                var dateObj = new Date(data[0].show_date);
                var month = dateObj.getMonth() + 1;
                var date = dateObj.getDate();
                var day = dateObj.getDay();
                var hours = dateObj.getHours();
                var minutes = dateObj.getMinutes();

                var seats = void 0;
                seats = {
                    seat_class: data[0].seat_class,
                    date: month + '/' + date + '·' + days[day],
                    time: hours + '시' + minutes + '분',
                    datetime: '공연시간 : ' + month + '.' + date + '.' + days[day] + ' / ' + hours + '시 ' + minutes + '분',
                    ticket_price: data[0].ticket_price,
                    number: data.length,
                    seats_picked: []
                };

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var seat = _step.value;

                        seats.seats_picked.push({
                            col: seat.seat_position.col,
                            num: seat.seat_position.num
                        });
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (seats.seat_class === 'VIP') axis.seat_class.x = 263;
                if (seats.date.length === 5) axis.date.x = 317;
                if (seats.date.length === 7) axis.date.size = 13;
                if (seats.time.length === 5) axis.time.x = 317;
                if (seats.time.length === 6) {
                    axis.time.size = 10;
                    axis.time.x = 315;
                }

                if (seats.seats_picked.length < 6) {
                    axis.leftBase.y -= axis.leftBase.size + 2;
                    axis.rightBase.y -= axis.rightBase.size + 2;
                }

                var fontSRC = _path2.default.join(__dirname, '../public', '/malgunbd.ttf');
                var font = void 0;
                font = pdfWriter.getFontForFile(fontSRC);

                var pageModifier = new _hummus2.default.PDFPageModifier(pdfWriter, i);
                pageModifier.startContext().getContext().writeText(seats.seat_class, axis.seat_class.x, axis.seat_class.y, { font: font, size: axis.seat_class.size, color: 'white' }).writeText('석', 270, 220, { font: font, size: 10, color: 'white' }).writeText(seats.seat_class, axis.seat_class.x - 260, axis.seat_class.y, { font: font, size: axis.seat_class.size, color: 'white' }).writeText('석', 10, 220, { font: font, size: 10, color: 'white' }).writeText('소월아트홀', 315, 225, { font: font, size: 9, color: 'white' }).writeText(seats.date, axis.date.x, axis.date.y, { font: font, size: axis.date.size, color: 'white' }).writeText(seats.time, axis.time.x, axis.time.y, { font: font, size: axis.time.size, color: 'white' }).writeText(seats.datetime, axis.leftBase.x, axis.leftBase.y, { font: font, size: axis.leftBase.size, color: 'black' }).writeText('인원 : ' + seats.number + ' 명', axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2), { font: font, size: axis.leftBase.size, color: 'black' }).writeText('좌석 : ' + seats.seat_class + '석 ' + seats.ticket_price + '원', axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2) * 2, { font: font, size: axis.leftBase.size, color: 'black' }).writeText('소월아트홀', axis.leftBase.x, 90, { font: font, size: axis.leftBase.size, color: 'black' }).writeText(seats.datetime, axis.rightBase.x, axis.rightBase.y, { font: font, size: axis.rightBase.size, color: 'black' }).writeText('인원 : ' + seats.number + ' 명', axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2), { font: font, size: axis.rightBase.size, color: 'black' }).writeText('좌석 : ' + seats.seat_class + '석 ' + seats.ticket_price + '원', axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2) * 2, { font: font, size: axis.rightBase.size, color: 'black' });

                for (var _i = 0; _i < Math.ceil(seats.seats_picked.length / 2); _i++) {
                    var con = pageModifier.startContext().getContext();
                    var index = _i * 2;
                    var str = seats.seats_picked[index].col + '-열 ' + seats.seats_picked[index].num + '번 ';
                    if (seats.seats_picked[index + 1]) {
                        index++;
                        str += seats.seats_picked[index].col + '-열 ' + seats.seats_picked[index].num + '번';
                    }
                    con.writeText(str, axis.leftBase.x, axis.leftBase.y - (axis.leftBase.size + 2) * (3 + _i), { font: font, size: axis.leftBase.size, color: 'black' });
                }
                for (var _i2 = 0; _i2 < Math.ceil(seats.seats_picked.length / 5); _i2++) {
                    var _con = pageModifier.startContext().getContext();
                    var _index = _i2 * 5;
                    var _str = '';
                    for (var j = 0; seats.seats_picked[_index + j] && j < 5; j++) {
                        _str += seats.seats_picked[_index + j].col + '-열 ' + seats.seats_picked[_index + j].num + '번 ';
                    }_con.writeText(_str, axis.rightBase.x, axis.rightBase.y - (axis.rightBase.size + 2) * (3 + _i2), { font: font, size: axis.leftBase.size, color: 'black' });
                }

                pageModifier.endContext().writePage();
                if (req.body.combine) break;
            }
            return undefined;
        }).then(function () {
            pdfWriter.end();
            return undefined;
        }).then(function () {
            (0, _child_process.exec)(_path2.default.join(__dirname, '../pdf', 'pdf') + ' ' + PDF + ' ' + '-print-to-default');

            console.log('표 출력 종료');
            return res.json(req.body.data);
        });
    });
});

app.listen(PORT, function () {
    console.log("표 출력 프로그램을 시작합니다.");
});