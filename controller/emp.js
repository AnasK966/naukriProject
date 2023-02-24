const Employee = require("../models/emp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Posts = require("../models/jobPost");


exports.Signup = async(req, res) => {
   await Employee.findOne({ email: req.body.email }).
        exec(async (err, data) => {
            if (data) {
                return res.status(400).json({
                    message: "email already exist"
                });
            }
            const { firstName, lastName, email, hash_password, ph_no, address } = req.body;
            const { country, city } = address;
            const password = await bcrypt.hashSync(hash_password, 10)
            const _employee = new Employee({
                firstName, lastName, email, hash_password: password, ph_no, address: { country, city }
            });
            _employee.save((err, emp) => {
                if (err) {
                    return res.json({
                        message: "something went wrong",
                        error:err
                    })
                }
                else if (emp) {
                    return res.json({
                        message: "User added Successfully"
                    })
                }
                

            });
        })
}


exports.SignIn = async  (req, res) => {
    const emp= await Employee.findOne({ email: req.body.email });
    if (emp) {
        if (bcrypt.compareSync(req.body.hash_password, emp.hash_password)) {
            const token = jwt.sign({ _id: emp._id }, process.env.JWT_SECRET, { expiresIn: "12h" })
            res.send({
                token: token,
                user: {
                    empfName: emp.firstName,
                    emplName: emp.lastName,
                    empAddr:emp.address,
                    emp_id: emp._id,
                    role: "emp"
                }
                
            }) 
        }
        else {
            res.status(401).json({
                message:"Invalid email or password"
            })
        }
    }
    
}

exports.updateInfo = (req, res) => {
        
    Employee.findOneAndUpdate({ _id: req.body.id },  //req.user._id
        {
            $set: {
                firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, address: { country: req.body.address.country, city: req.body.address.city },
                ph_no: req.body.ph_no, postalCode: req.body.postalCode
            }
        }).then(data => {
            res.json({
                message: "update done"
            })
        }).catch(err => {
            res.json({
                message: "something went wrong",
                error: err
            })
        })
}


//dashboard for candidate
// exports.getJobs = (req, res) => {
//     try {
//         const jobs = Posts.find({ candidate_id: req.params.id });  //job applied for by candidate
//         res.send({
//             jobs: jobs
//         })
//     }
//     catch (err) {
//         res.status(400).json({
//             error:err
//         })
//     }
// }

// exports.getEmp = async (req, res) => {
//     const employess = await Employee.find({  })
//       .select("_id firstName lastName email ph_no address postalCode ")
      
  
//     res.status(200).json({ employess });
//   };

