let express = require('express');
let router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/home', function (req, res, next) {
    res.render('index');
});

router.get('/recommendList', function (req, res, next) {
    res.render('index');
});

router.get('/rankingList', function (req, res, next) {
    res.render('index');
});

module.exports = router;