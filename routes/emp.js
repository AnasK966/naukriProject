const express = require("express");
const { SignIn, Signup,  updateInfo } = require("../controller/emp");
const { requireSignin,empMiddleware } = require("../middleware/commonMiddleware");
const router = express.Router();
const { addProfile,uploadResume,updateProfile, storeResume, showProfile } = require("../controller/empProfile");
const { applyJob, appliedJobs,searchJob, relatedPosts, showResume } = require("../controller/jobPost");


router.post("/signin", SignIn);
router.post("/signup", Signup);

//require SignIn

router.post("/addProfile",addProfile);
router.post("/uploadResume", uploadResume,storeResume); //store and update resume pdf file
router.put("/update", updateInfo);
router.put("/apply/:id", applyJob); //posts id 
router.put("/updateProfile", updateProfile);
router.get("/dashboard", appliedJobs);
router.get("/search/:key", searchJob);
router.get("/home", relatedPosts);
router.get("/profile", showProfile);
router.get("/showResume", showResume);

module.exports = router;
