import express from "express";
import auth from "../controller/management/authController.js";
import AdminController from "../controller/users/adminController.js";

const routes = express.Router();
const controll = AdminController.enrolledControll;
routes
    .get("/enrolled", auth,controll.readEnrolled)
    .get("/enrolled/:id", auth,controll.readEnrolledById)
    .post("/enrolled/create", auth,controll.createEnrolled)
    .put("/enrolled/update/:id", auth,controll.updateEnrolled)
    .delete("/enrolled/delete/:id", auth,controll.deleteEnrolled)

export default routes;