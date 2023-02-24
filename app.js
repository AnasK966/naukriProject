const express = require("express");
const app = express()
const mongoose = require("mongoose");
const env = require("dotenv")
const cors = require('cors')

//import routes
const empRoutes = require("../Naukri backend/routes/emp")
const cmpRoutes = require("../Naukri backend/routes/company")




env.config()
const uri = `mongodb+srv://${process.env.mongouser}:${process.env.mongopw}@cluster0.23mkprg.mongodb.net/${process.env.mongodb}`;
mongoose.connect(uri).then(() => {
    console.log("datbase connected")
}).catch((err) => {
    console.log("database not connected", err)
});

//middlewares
app.use(cors()); //for frontend and backend connection
app.use(express.json()); // encoded urls json
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

//routing
app.get("/", (req, res) => {
    res.json({ message: "HELLO NIGGA!" });
  });
app.use("/emp", empRoutes);
app.use("/cmp", cmpRoutes);





// app.use((err, req, res, next) => {
//     res.status(500).send({error:err.message})
// })

app.listen(process.env.PORT, () => {
    console.log(`listening at ${process.env.PORT}`)
});