import express from "express";
import auth from "../controller/management/authController.js";
import AdminController from "../controller/users/adminController.js";

const routes = express.Router();
const controll = AdminController.roleControll;

routes
    .get("/roles", auth,controll.listRoles)
    .get("/roles/:id", auth,controll.readRolesById)
    .post("/roles/create", auth,controll.createRole)
    /* .put("/roles/update/:id", controll.updateRoles) não deixa editar para evitar problema*/
    .patch("/roles/actions/:id", auth,controll.addActionsInRoles)
    .delete("/roles/delete/:id", auth,controll.deleteRoles)
    .delete("/roles/actions/delete/:id", auth,controll.deleteActionsInRoles)


export default routes;