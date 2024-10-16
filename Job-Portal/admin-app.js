const express  = require('express');
const app= express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const PORT =  process.env.PORT || 3000;

app.use(bodyParser.json());
const jobAdminRoutes = require('./routes/jobAdminRoute');
app.use('/api/v1/jobs',jobAdminRoutes);



mongoose.connect('mongodb://0.0.0.0:27017/jobPortal')
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err));

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
});