import express  from "express";
import { deleteJob, getAllJobs, getSinglejob, getmyJobs, postJob, updatedJob } from "../controllers/jobController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router()
router.get('/getall',getAllJobs)
router.post('/post',isAuthorized,postJob)
router.get('/getmyjobs',isAuthorized,getmyJobs)
router.put('/update/:id',isAuthorized,updatedJob)
router.delete('/delete/:id',isAuthorized,deleteJob)
router.get('/:id',isAuthorized,getSinglejob)


export default router;