const {check}  = require('express-validator');
module.exports.checkBodyAddStaff = [
    check('staffUsername','staffUsername Empty').not().isEmpty(),
    check('staffPrefix','staffPrefix Empty').not().isEmpty(),
    check('staffFirstName','staffFirstName Empty').not().isEmpty(),
    check('staffLastName','staffLastName Empty').not().isEmpty(),
    check('staffPassword','staffPassword Empty').not().isEmpty(),
    check('staffTel','staffTel Empty').not().isEmpty(),
    check('staffEmail','staffEmail Empty').not().isEmpty(),
    check('staffStatus','staffStatus Empty').not().isEmpty(),
    check('program','program Empty').not().isEmpty()
];

module.exports.checkBodyEditStaff = [
    check('staffPrefix','staffPrefix Empty').not().isEmpty(),
    check('staffFirstName','staffFirstName Empty').not().isEmpty(),
    check('staffLastName','staffLastName Empty').not().isEmpty(),
    check('staffTel','staffTel Empty').not().isEmpty(),
    check('staffStatus','staffStatus Empty').not().isEmpty(),
    check('program','program Empty').not().isEmpty()
];

module.exports.checkBodyResetPassword = [
    check('staffPassword','staffPassword Empty').not().isEmpty(),
    check('program','program Empty').not().isEmpty()
];