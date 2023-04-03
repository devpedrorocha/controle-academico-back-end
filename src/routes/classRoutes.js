import express from "express";
import auth from "../controller/management/authController.js";
import AdminController from "../controller/users/adminController.js";

const routes = express.Router();
const controll = AdminController.classControll

routes
    .get("/classes", auth,controll.readClasses)
    .get("/classes/:id", auth,controll.readClassesById)
    .post("/classes/create", auth,controll.createClass)
    .delete("/classes/delete/:id", auth,controll.deleteClass)
    .put("/classes/update/:id", auth,controll.updateClass)

export default routes;