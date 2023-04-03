import express from "express";
import auth from "../controller/management/authController.js";
import AdminController from "../controller/users/adminController.js";

const routes = express.Router();
const controll = AdminController.subjectControll;

routes
    .get("/subjects", auth,  controll.readSubject)
    .get("/subjects/:id",auth, controll.readSubjectById)
    .post("/subjects/create",auth, controll.createSubject)
    .put("/subjects/update/:id",auth, controll.updateSubject)
    .delete("/subjects/delete/:id",auth, controll.deleteSubject)

export default routes;  