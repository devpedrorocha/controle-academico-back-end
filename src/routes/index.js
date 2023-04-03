import express from "express";
import users from "../routes/userRoutes.js"
import roles from "../routes/roleRoutes.js";
import actions from "../routes/actionRoutes.js";
import disciplines from "../routes/subjectRoutes.js";
import classes from "../routes/classRoutes.js";
import enrolled from "../routes/enrolledClassRoutes.js";
import student from '../routes/studentRoutes.js';
import professores from "../routes/professorRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => {
        res.send("vamooooo");
    })

    app.use(
        express.json(),
        users,
        roles,
        actions,
        disciplines,
        classes,
        enrolled,
        student,
        professores
    )
}

export default routes;