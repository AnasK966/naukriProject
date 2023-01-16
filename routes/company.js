const express = require("express");
const router = express.Router()
const { Signup, SignIn ,updateInfo,uploadLogo} = require("../controller/company");
const { updateJob, delJob, getEmpApplied, cmpJobs ,addJob, searchJob} = require("../controller/jobPost");
const { requireSignin, cmpMiddleware } = require("../middleware/commonMiddleware");



router.post("/signup", uploadLogo,Signup);//uploadLogo,
router.post("/signin", SignIn);
router.post("/update", requireSignin, uploadLogo, updateInfo);


router.post("/addPosts", addJob); //require sigin
router.put("/updatePost/:id", updateJob); //require sigin  posts id
router.delete("/delPost/:id", delJob); //require sigin   posts id
router.get("/dashboard", cmpJobs);
router.get("/dashboard/post/candidates/:id", getEmpApplied); //job posts id
router.get("/search/:key", searchJob);


module.exports = router;
