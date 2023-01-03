const Profile = require("../models/empProfile");
const multer = require("multer");
const path = require("path");


exports.addProfile = async (req, res) => {
    const prof = await Profile.findOne({ _id: req.body.candidate_id});//req.user.emp_id
    if (prof!=null) {
        this.updateProfile();
    }
    else {
        const profile = new Profile({
            candidate_id: req.body.candidate_id,  ////req.user.emp_id
            education: req.body.education,
            skills: req.body.skills,
            workExp: req.body.workExp,
            certificates: req.body.certificates
        
        
        });
        profile.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    message: "something went wrong",
                    error: err
                })
            }
            if (data) {
                res.status(201).json({
                    message: "added successfully"
                })
            }
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate({ _id: req.user.emp_id }, {
            $set: {
            education: req.body.education,
            skills: req.body.skills,
            workExp: req.body.workExp,
            certificates: req.body.certificates,
            }
        })
        
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong",
            error:err
        })
    }
}

exports.uploadResume = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,"uploads/resume/")
        },  // Storage location
        filename: (req, file, cb) => {
            cb(null, req.body.candidate_id+ path.extname(file.originalname)) // return a unique file name for every file              
        }
    }),

    limits: {fileSize: 20000000},   // This limits file size to 2 million bytes(2mb)

    fileFilter: (req, file, cb) => {
        const validFileTypes = /jpg|jpeg|png|pdf/ // Create regex to match jpg and png

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
}).single("resume")


exports.storeResume = async (req, res) => {
    const resum = await Profile.findOne({ candidate_id: req.body.candidate_id }) //req.user.emp_id
    if (resum) {
        resum.resume = req.file.path;
        resum.save((err, data) => {
            if (data) {
                return res.status(200).json({
                    message: "Uploaded  resume"
                })
            }
            if (err) {
                return res.status(400).json({
                    message: "soemthing went wrong",
                    error:err
                })
            }
            
        })
        
    }
        else {
            const saveResume = new Profile({
                candidate_id:req.body.candidate_id, //req.user.emp_id
                resume: req.file.path
            })
            saveResume.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        message: "something went wrong",
                        error: err
                    })
                }
                if (data) {
                    return res.status(201).json({
                        message: "added successfully"
                    })
                }
            })
        }
        
    }


exports.showProfile = async (req, res)=>{
    await Profile.find({ candidate_id: req.body.emp_id }
    ).then(data => {
        res.json({
            data: data,
            message: "Fetched"
        })
    }).catch(err => {
        res.json({
            error: err,
            message:"Something went wrong"
        })
        
    })
}