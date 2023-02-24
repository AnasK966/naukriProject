const Company = require("../models/company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");


exports.Signup = (req, res) => {
    Company.findOne({ email: req.body.email }).
        exec( async (err, cmp) => {
            if (cmp) {
                return res.status(401).json({
                message:"Email already exist"
            })
            }
            const { name, email, hash_password, ph_no, address } = req.body;
            const { country, city } = address;
            const pw = bcrypt.hashSync(hash_password, 10);
            const _comp = new Company({
                name, email, hash_password: pw, ph_no, address: { country, city }
            });
            if (req.file) {
                _comp.logo = req.file.path;
            }
            
            _comp.save((err,data) => {
                if (data) {
                    return res.json({
                        message:"Company created successfully"
                    })
                }
                else if (err) {
                    
                    return res.json({
                        message: "Something went wrong",
                        error:err
                    })
                }
            })
    })
}

exports.SignIn = async (req, res) => {
    
    const cmp = await Company.findOne({ email: req.body.email })
    if (cmp) {
        if (bcrypt.compareSync(req.body.hash_password,cmp.hash_password)) {
            const token = jwt.sign({ _id: cmp._id },process.env.JWT_SECRET, { expiresIn: "12h" })
            res.send({
                token: token,
                user: {
                    cmpName: cmp.name,
                    cmpAddr:cmp.address,
                    cmp_id: cmp._id,
                    role: "cmp"
                }
            })
        }
        else {
            return res.json({
                message:"Invalid password"
            })
        }
    }
    else {
        return res.json({
            message:"Invalid Email or Password"
        })
    }
}


exports.updateInfo = async (req, res) => {
    try { 
        
        const cmp = await Company.findOneAndUpdate({ _id: req.user.cmp_id },
            { $set: { name: req.body.name, email: req.body.email, address: { country: req.body.address.country, city: req.body.address.city }, ph_no: req.body.ph_no ,logo:req.file.path} });
        
            res.json({
                message:"update done"
            })
        
    } 


  
    catch (err) {
        res.json({
            message: "something went wrong",
            error: err
        })
    }
}

exports.uploadLogo = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,"uploads/logo")
        },  // Storage location
        filename: (req, file, cb) => {
            cb(null, req.user.cmp_id+ path.extname(file.originalname)) // return a unique file name for every file              
        }
    }),

    limits: {fileSize: 20000000},   // This limits file size to 2 million bytes(2mb)

    fileFilter: (req, file, cb) => {
        const validFileTypes = /jpg|jpeg|png|/ // Create regex to match jpg and png

        // Do the regex match to check if file extenxion match
        const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase())

        if(extname === true){
            // Return true and file is saved
             return cb(null, true)
        }else{
            // Return error message if file extension does not match
            return cb("Error: Images or pdf  Only!")
            }
        }
}).single("logo")