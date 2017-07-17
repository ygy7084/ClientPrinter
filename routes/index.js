var express = require('express');
var axios = require('axios');
var PDFDocument = require('pdfkit');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) {

    let doc = new PDFDocument();

    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300")
    doc.end()
    // axios.get('https://storage.googleapis.com/red_printing/ticket_R.svg').then((r) => {
    //     res.send('<html><head></head><body><div>'+r.data+'</div></body></html>')
    // });
});
module.exports = router;
