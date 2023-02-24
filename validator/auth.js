const { check ,validationResult} = require('express-validator');

exports.signupValidation = [
    check('firstName').notEmpty().withMessage('firstname required'),
    check('lastName').notEmpty().withMessage('lastname required'),
    check('email').isEmail().withMessage('invalid email'),
    check('contact').isLength({min:11,max:11}).withMessage('invalid number'),
    check('userName').notEmpty().withMessage('username required'),
    check('hash_password').isLength({min:6}).withMessage('passsword length should be more than 6'), 
    check('address').notEmpty().withMessage('address required'), 
]
exports.signinValidation = [
    check('email').isEmail().withMessage('enter valid email'),
    check('hash_password').notEmpty().withMessage('password required'), 
]


exports.adminSignupValidation = [
    check('email').isEmail().withMessage('email required'),
    check('userName').notEmpty().withMessage('Username required'),
    check('hash_password').isLength({min:6}).withMessage('password length should be more than 6')
]


exports.isRequestValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        res.status(400).json({ error:errors.array()[0].msg })
    };
    next();
}