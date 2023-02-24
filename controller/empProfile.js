const Profile = require("../models/empProfile");
const Employee = require("../models/emp");
const CV = require("../models/Cv");
const multer = require("multer");
const path = require("path");


exports.addProfile = async (req, res) => {
        const _profile = new Profile({
            candidate_id: req.body.candidate_id,  ////req.user.emp_id
            education: req.body.education,
            skills: req.body.skills,
            certificates: req.body.certificates
        
        
        });
        _profile.save((err, data) => {
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

exports.updateProfile = async (req, res) => {
        await Profile.findOneAndUpdate({ _id: req.body.candidate_id }, {
            $set: {
            education: req.body.education,
            skills: req.body.skills,
            certificates: req.body.certificates,
            }
        }).then(data => {
            return res.json({
                message:"Profile updated"
            })
            
        }).catch(err => {
            return res.status(400).json({
            message: "Something went wrong",
            error:err
        })
    })
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


exports.storeResume = (req, res) => {
    console.log("Storeresume")
    console.log(req.file)
    _cv = new CV({
        resume: req.body.resumeFile,
        candidate_id: req.body.candidate_id
        
    })
        _cv.save((err, data) => {
            if (data) {
                return res.json({
                    message: "Uploaded  resume"
                })
            }
            if (err) {
                return res.json({
                    message: "soemthing went wrong",
                    error:err
                })
            }
            
        })
        
}
    

const getProf = (id) => {
    Profile.aggregate([
        {
            $lookup:
            {

                from: "employees",
                localField: "candidate_id",
                foreignField: "_id",
                as: "Employee"
            }
        }
        
    ]).then(data => {
        return data
    }) 

}

exports.showProfile = async (req, res) => {
    await Profile.aggregate([
        {
            $lookup:
            {
                from: "employees",
                localField: "candidate_id",
                foreignField: "_id",
                as: "Employee"
            }
        }
        
    ]).then(data => {
        data.map((arrItem) => {
            if (arrItem.candidate_id == req.params.id) {
                return res.json({
                    data:arrItem,
                    message:"fetched"
                })
            }
        })
    }) 
   }
    
// exports.showProfile =async (req, res) => {
//     await Profile.aggregate([
//         { "$match": { "candidate_id": `${req.params.id}` } },
//         {
//             $lookup: {
//                 from: "employees",
//                 let: { candidate_id: "$candidate_id", id:"$_id"  },
//                 pipeline: [{
//                     $match: {
//                         $and: [
//                             { $expr: { $eq: ["$$id", `${req.params.id}`] } },
//                             { $expr: { $eq: ["$$candidate_id", `${req.params.id}`] } }
//                         ]
                        
//                     }
//                 }],
//                 as: "employee"
//             }
//         }]).then(data => {

//             return res.json({
//                 data:data,
//                 message:"Fetched"
//             })
        
//         // else {
//         //     return res.json({
//         //         message:"No Profile Found"
//         //     })
//         // }
//     })
// }

// exports.showEmp= async (req, res) => {
//     await Employee.find({ _id: req.params.id }).select("firstName lastName address email ph_no").then(data => {
//         if ( data.length > 0) {
//             return res.json({
//                 dataEmp:data
    
//             })
//         }
//         else {
//             return res.json({
//                 message:"No Profile Found"
//             })
//         }
        
//     }).catch(err => {
//         return res.json({
//             message: "Something went wrong",
//             error:err
//         })
//     })
    
    
// }    

// exports.showProfile = async (req, res)=>{
//     await Profile.aggregate([
//         {
//             $lookup:
//             {

//                 from: "employees",
//                 localField: "candidate_id",
//                 foreignField: "_id",
//                 as: "Employee"
//             }
//         }
        
//    ]).then(data => {
//         if (data.length > 0) {
//             return res.json({
//                 data: data,
//                 message: "Fetched"
//             })
//         }
//         else {
//             return res.json({
//                 message: "No Profile Found"
//             })
//         }
        
//     }).catch(err => {
//         res.json({
//             error: err,
//             message:"Something went wrong"
//         })
        
//     })
// }