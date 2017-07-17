var express = require('express');
var hummus  = require('hummus');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var pdfWriter = hummus.createWriterToModify(__dirname + '/TestMaterials/BasicJPGImagesTest.PDF', {
        modifiedFilePath: __dirname + '/output/BasicJPGImagesTestPageModified.pdf'
    });

    var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
    pageModifier.startContext().getContext().writeText(
        'Test Text',
        75, 805,
        {font:pdfWriter.getFontForFile(__dirname + '/TestMaterials/fonts/Couri.ttf'),size:14,colorspace:'gray',color:0x00}
    );

    pageModifier.endContext().writePage();
    pdfWriter.end();
});

module.exports = router;
