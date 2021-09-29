const {check}  = require('express-validator');
module.exports.checkBodyLogin = [
    check('password','Password Empty').not().isEmpty(),
    check('username','Username Empty').not().isEmpty()
]