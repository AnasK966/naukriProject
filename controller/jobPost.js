const Posts = require("../models/jobPost");
const Company = require("../models/company")
const Employee = require("../models/emp");
const Profile = require("../models/empProfile");
const emp = require("../models/emp");



exports.addJob = (req, res) => {
    const job = new Posts({
        title: req.body.title,
        jobtype: req.body.jobtype,
        jobDesc: req.body.jobDesc,
        qualReq: req.body.qualReq,
        skillReq: req.body.skillReq,
        salRange: req.body.salRange,
        expReq: req.expReq,
        createdBy: req.body.createdBy,  //req.user.cmp_id
    });

    job.save((err, data) => {
        if (err) {
            return res.status(400).json({
                message: "Something went wrong",
                error: err
            })
        }
        if (data) {
            return res.status(201).json({
                message: "job added successfully"
            })
        }

    })
}  


exports.applyJob = (req, res) => {
    console.log("xyz")
    console.log(req.user.emp_id,"xyz")
    Posts.updateOne({ _id: req.params.id }, { $push: { candidate_id: { ids: req.params.emp_id } } }, { $inc: { candidateCount: 1 } }).
        then((data) => {
            res.status(200).json({
                message: "applied successfully"
            })
            
        }).catch((err) => {
            res.status(400).json({
                message: "Something went wrong",
                error: err
            })
        }); 
        
    }
    
exports.updateJob = async (req, res) => {
    
        
        Posts.findOneAndUpdate({ _id: req.params.id },
            { $set: {title: req.body.title,
                jobtype: req.body.jobtype,
                jobDesc: req.body.jobDesc,
                qualReq: req.body.qualReq,
                skillReq: req.body.skillReq,
                salRange: req.body.salRange,
                expReq: req.expReq
            }
            }).then(data => {
                res.json({
                    message:"update done"
                }) 
            }).catch (err=> {
        res.json({
            message: "something went wrong",
            error: err
        })
    })
}


exports.delJob = (req, res) => {
    
    Posts.deleteOne({ _id: req.params.id }).then(data => {
        return res.status(201).json({
            message:"Deleted Successfully"
        })
    }).catch(err => {
        res.status(400).json({
            message: "something went wrong",
            error:err
        })
        })


}



exports.appliedJobs = (req, res) => {
    Posts.find({ candidate_id: { _id: req.body.emp_id } }).
        then(data => {
        res.json({
            job:data
        })
    }).catch(err => {
        res.json({
            error:err
        })
    })
}

exports.searchJob = async (req, res) => {
    console.log(req.query.q);
    await Posts.find({
        "$or": [
            { "skillReq.name": { $regex: req.query.q ,$options: 'i'  } },
            { "jobDesc": { $regex: req.query.q,$options: 'i'   } },
            { "jobtype": { $regex: req.query.q,$options: 'i'  } },
            { "qualReq.degree": { $regex: req.query.q, $options: 'i' } },
            { "title": { $regex: req.query.q,$options: 'i'  }}
        ]
    }).then(data => {
        if (data.length >= 0) {
            console.log("onn", data);
            res.json({
                data: data,
                message:"Fetched"
            })
        }
        else {
            console.log("onnoff", data);
            res.json({
                message:"found nothing"
            })
        }
        
    }).catch(err => {
        console.log("off", data);
        res.json({
            error: err,
            message:"Something went wrong"
        })
    })
    
}


// exports.getJobById = (req, res) => {
//     console.log(req.params.id)
//     const job = Posts.findById({ _id: req.params.id })
//     console.log(job.createdBy)
//     const cmp = Company.findOne({ _id: job.createdBy })
//     console.log(cmp.name)
//     try {
//         return res.json({
//             job: job,
//             cmp:cmp
//         })
//     }
//     catch(err) {
//         return res.json({
//             message: "something went wrong",
//             error:err
//         })
//     }
// }

exports.getJobById = (req, res) => {
    console.log(req.params.id)
    Posts.findById({ _id: req.params.id }).then(data => {
        return res.json({
            job: data
      })
        
    }).catch(err=> {
        return res.json({
            message: "something went wrong",
            error:err
        })
    })
}


// exports.searchJob = async (req, res) => {
//     console.log(req.params.key);
//     const data= await Posts.find({
//         "$or": [
//             { "skillReq.name": { $regex: req.params.key ,$options: 'i'  } },
//             { "jobDesc": { $regex: req.params.key,$options: 'i'   } },
//             { "jobtype": { $regex: req.params.key,$options: 'i'  } },
//             { "qualReq.degree": { $regex: req.params.key, $options: 'i' } },
//             { "title": { $regex: req.params.key,$options: 'i'  }}
//         ]
//     }).then(data => {
//         if (data.length >= 0) {
//             res.json({
//                 dat: data,
//                 message:"Fetched"
//             })
//         }
//         else {
//             res.json({
//                 message:"found nothing"
//             })
//         }
        
//     }).catch(err => {
//         res.json({
//             error: err,
//             message:"Something went wrong"
//         })
//     })
// }
const getSkills = (array) => {
    return array.map((arItem, _) => {
      return arItem.skills.map((nestItem,_) => {
          return nestItem.name;
      })
    })
}
  
const getPrevJob = (array) => {
    return array.map((arItem, _) => {
      return arItem.workExp.map((nestItem,_) => {
          return nestItem.designation;
      })
    })
}
  
const getCert = (array) => {
    return array.map((arItem, _) => {
      return arItem.certificates.map((nestItem,_) => {
          return nestItem.name;
      })
    })
}
const getEdu = (array) => {
    return array.map((arItem, _) => {
        return arItem.education
    })
} 
  

exports.relatedPosts = async (req, res) => {
    certString = "xz";
    skillString = "xz";
    expString = "xz";
    eduString = "";
    const profile = await Profile.find({ candidate_id: req.body.emp_id });//req.user.emp_id
    //write a function to check if a job is closed or not
    const skill = (getSkills(profile)).forEach(data => {
        data.forEach(xyz => {
            skillString = skillString+"|"+xyz
        });
        
        });
        const exp = (getPrevJob(profile)).forEach(data => {
            data.forEach(xyz => {
                expString = expString+"|"+xyz 
            
            })
    
        });
        const cert = (getCert(profile)).forEach(data => {
            data.forEach(xyz => {
                certString =  certString+ "|"+xyz 
            
            })
        
        });
        const edu = (getEdu(profile)).forEach(data => {
            eduString += data;

        });


        Posts.find({
            "$or": [
                { "skillReq.name": { $regex: `${skillString}`,$options: 'i'} },
                { "qualReq.degree": { $regex: `${eduString}`, $options: 'i' } },
                // { "jobDesc": { $regex: `${certString}` ,$options: 'i'} },
                { "title": { $regex: `${expString}`,$options: 'i'} }
            ]
        }).then(data => {
            if (data.length > 0) {
                res.json({
                    data: data,
                    message:"Fetched"
                })
            }
            else {
                res.json({
                    message:"found nothing"
                })
            }
        
        }).catch(err => {
            res.json({
                error: err,
                message:"Something went wrong"
            })
        })
    }
    


exports.searchEmp = async(req, res) => {
    console.log(req.params.key);
    const data= await Profile.find({
        "$or": [
            { "skills.name": { $regex: req.params.key ,$options: 'i'  } },
            { "education": { $regex: req.params.key,$options: 'i'   } },
            { "workExp.designaton": { $regex: req.params.key, $options: 'i' } },
            { "certificates.name": { $regex: req.params.key,$options: 'i'  }}
        ]
    }).then(data => {
        if (data.length > 0) {
            res.json({
                dat: data,
                message:"Fetched"
            })
        }
        else {
            res.json({
                message:"found nothing"
            })
        }
        
    }).catch(err => {
        res.json({
            error: err,
            message:"Something went wrong"
        })
    })
}



//for company dashboard
exports.cmpJobs =async (req, res) => {
    await Posts.find({ createdBy:"63a46d36dfb66018de0c1e91"  })//
        .then(data => {
        res.json({
            jobs: data
        })
    }).catch(err => {
        res.status(400).json({
            error: err,
            message:"something went wrong"
        })
    })   //jobs by company req.user.cmp_id
    
}



//for company dashbboard
exports.getEmp = (req, res) => {
    const emp=Posts.aggregate([
        { $match: { createdBy: req.body.cmp_id } },
        {
            $lookup: {
                from: "Employee",
                localField:"candidate_id",
                foreignField: "_id",
                as:"Employe"
            }
        },
        {
            $project: {
                firstName: "$Employe.firstName",
                email: "$Employe.lastName",
                _id:    "$Employe._id"
                
            }
        }

    ]).then(data => {
        res.json({
            data:emp
        })
    }).catch(err => {
        res.json({
            error:err
        })
    })
    
    
}


const getCandID = (array) => {
    return array.map((arItem, _) => {
      return arItem.candidate_id.map((nestItem,_) => {
          return nestItem;
      })
    })
}

const getCand = (array) => {
    return array.map((arItem, _) => {
        return arItem.map((nestItem, _) => {
            return nestItem.ids;

        })
    }
    )}




exports.getEmpApplied = async (req, res) => {
    IDlst= []; //store the ids of canidates that appplied on that job
    const jobPost = await Posts.find({ _id: req.params.id })  //posts_id
    const candidates = getCandID(jobPost); //get candidates ids that applied for that job/on posts
    const candId = getCand(candidates);   //filtering the ids
    candId.forEach(lst=> {
        lst.forEach(id => {
            IDlst.push(id.toString())
        })
        
    })
    
        Employee.find({ _id: {$in:IDlst} }).select("firstName lastName email ph_no")
            .then(data => {
                if (data.length > 0) {
                    res.json({
                        data: data,
                        message: "fetched"
                    })
                }
                else {
                    res.json({
                        message:"Nothing found"
                    })
                }
            
        }).catch(err => {
            res.json({
                error: err,
                message:"something went wrong"
            })
        })
        

    //cmp/dashboard/post/candidates/63ab17d583c16aa4119cb270
    
}

 //retrive resume and employee name and email
exports.showResume = (req, res)=>{
    Profile.find({ candidate_id: req.body.emp_id }).select("resume")  //req.params.id
        .then(data => {
            res.json({
                path:data[0].resume
            })
        }).catch(err => {
            res.json({
                message: "something went wrong",
                error:err
            })
            
        
    })
 }