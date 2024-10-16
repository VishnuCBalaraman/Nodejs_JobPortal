const express = require("express");
const router = express.Router();
const JobModel = require("../models/JobModel");
const axios = require('axios'); // Install axios for HTTP requests


router.get("/", async (req, res) => {
    try {
        const jobs = await JobModel.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).send("Server error");
    }
});


router.post("/", async (req, res) => {
    console.log(req.body); // Debugging: Check the request body

    const { jobId, jobCompany, jobRole } = req.body;

    // Check if the required fields are present
    if (!jobId || !jobCompany || !jobRole) {
        return res.status(400).send("All fields are required: jobId, jobCompany, jobRole");
    }

    const newJob = new JobModel({
        jobId,
        jobCompany,
        jobRole,
        applicants: [] // Initialize with an empty array for applicants
    });

    try {
        await newJob.save();
        res.status(201).json(newJob); // Return created job with 201 status
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle errors
    }
});

router.get("/:jobId", async(req,res)=>{
    const {jobId} = req.params;
    try {
        // Step 1: Fetch job details from MongoDB
        const job = await JobModel.findOne({ jobId: jobId });
        if (!job) {
            return res.status(404).send("Job not found");
        }

        // Step 2: Fetch applicants from the MySQL application
        const response = await axios.get(`http://localhost:3001/users/job/${jobId}`);
        const applicants = response.data; // Assuming this returns an array of applicants

        // Step 3: Construct the response
        const combinedResponse = {
            jobId: job.jobId,
            jobCompany: job.jobCompany,
            jobRole: job.jobRole,
            applicants: applicants.map(applicant => ({
                applicantId: applicant.userId, // Adjust based on your user table structure
                applicantName: applicant.userName, // Adjust based on your user table structure
                applicantJobId: jobId
            }))
        };

        // Send the combined response
        res.json(combinedResponse);
    } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        res.status(500).send("Server error");
    }
    
});



module.exports = router;