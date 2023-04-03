import users from "../../model/User.js";
import enrolledClass from "../../model/EnrolledClass.js";
import crud from "../crud.js";


class StudentController {
    static viewAllFinalGradeAndFrequency = async (req, res) => {
        const { id } = req.params;
        const user = await users.findById(id);
        const arrayUserEnrolledsClass = [];
        if (!user) return res.status(404).send("Erro");
        for (let i = 0; i < user.register.length; i++) {
            const findEnrolledClass = await enrolledClass.findById(user.register[i]).populate("classGroup").populate("role");
            arrayUserEnrolledsClass.push(findEnrolledClass);
        }
        res.send({success: true, data: arrayUserEnrolledsClass});
    }

    static viewFinalGradeAndFrequency = async (req, res) => {
        try {
            const { id } = req.params;//id user
            const { name } = req.query; //  
            const user = await users.findById(id);
            const arrayUserEnrolledsClass = [];
            if (!user) return res.status(404).send("Erro");
            for (let i = 0; i < user.register.length; i++) {
                const findEnrolledClass = await enrolledClass.findById(user.register[i]).populate("classGroup").populate("role");
                arrayUserEnrolledsClass.push(findEnrolledClass);
            }
            const newArray = arrayUserEnrolledsClass.filter((element) => {
                return element.classGroup.name == name;
            })
            res.send({success: true, data: newArray});

        } catch (error) {
            res.status(400).send(error);
        }
    }

    //ver registers
    static viewRegister = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await users.findById(id);
            const array = [];
            for (let i = 0; i < user.register.length; i++) {
                const enrolled = await enrolledClass.findById(user.register[i]).populate("classGroup");
                array.push(enrolled);
            }
            res.send({success: true, data: array});
        } catch (error) {
            res.status(400).send(error);
        }

    }
}

export default StudentController; 