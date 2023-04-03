import express from "express";
import AdminController from "../controller/users/adminController.js";
import auth from "../controller/management/authController.js";

const routes = express.Router();
const controll = AdminController.actionControll;

routes
    .get("/actions", auth,controll.readActions)
    .get("/actions/:id", auth,controll.readActionsById)
    .post("/actions/create", auth,controll.createAction)
    .put("/actions/update/:id",auth, controll.updateActions)
    .patch("/actions/methods", auth,controll.addMethodInActions)
    .delete("/actions/delete/:id", auth,controll.deleteActions)
    .delete("/actions/methods/delete", auth,controll.deleteMethodInActions)

export default routes;