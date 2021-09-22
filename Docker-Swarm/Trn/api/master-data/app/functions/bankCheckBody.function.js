const {check}  = require('express-validator');
module.exports.checkBodyAddBank = [
    check('bankName','bankName Empty').not().isEmpty(),
    check('bankAbb','bankAbb Empty').not().isEmpty(),
    check('bankActive','bankActive Empty').not().isEmpty(),
    check('program','program Empty').not().isEmpty(),
];

module.exports.checkBodyEditBank = [
    check('bankName','bankName Empty').not().isEmpty(),
    check('bankAbb','bankAbb Empty').not().isEmpty(),
    check('bankActive','bankActive Empty').not().isEmpty(),
    check('program','program Empty').not().isEmpty(),
];