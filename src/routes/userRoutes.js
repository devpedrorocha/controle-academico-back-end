import express from 'express';
import auth from '../controller/management/authController.js';
import AdminController from '../controller/users/adminController.js';
import {refresh} from '../controller/management/authController.js'

const routes = express.Router();
const controll = AdminController.userControll;

routes
    .get("/users", auth, controll.readUser)
    .get("/users/:id", auth, controll.readUsersById)
    .get("/logout", auth, controll.logoutUser)
    .post("/users/create", auth, controll.createUser)
    .put("/users/update/:id", auth, controll.updateUser)
    .delete("/users/delete/:id", auth, controll.deleteUser)
    .post("/login", controll.loginUser)
    .post("/users/update_token", refresh, controll.loginUser)

export default routes;