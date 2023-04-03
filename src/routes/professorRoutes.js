import express from "express";
import auth from "../controller/management/authController.js";
import ProfessorController from "../controller/users/professorController.js";
const routes = express.Router();
const controll = ProfessorController;

routes
    .put("/professor/:id",auth, controll.giveGradeAndFrequency)


export default routes;