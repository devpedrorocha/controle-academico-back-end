import express from "express";
import auth from "../controller/management/authController.js";
import StudentController from "../controller/users/studentController.js";
const routes = express.Router();
const controll = StudentController;

routes
    .get("/student/:id",auth, controll.viewAllFinalGradeAndFrequency)
    .get("/student/notes/:id",auth, controll.viewFinalGradeAndFrequency)
    .get("/students/enrolled/:id",auth, controll.viewRegister)

export default routes;