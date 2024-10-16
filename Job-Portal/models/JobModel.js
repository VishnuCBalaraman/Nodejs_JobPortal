const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobId : Number,
    jobCompany : String,
    jobRole : String,
    applicants : [{
        applicantId : Number,
        applicantName  : String,
        applicantJobId :Number,
    }],
})

module.exports = mongoose.model('JobModel',jobSchema);