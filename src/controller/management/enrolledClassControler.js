import enrolledClass from "../../model/EnrolledClass.js"
import crud from "../crud.js";
import users from "../../model/User.js";
import classes from "../../model/Class.js";

const createEnrolled = async (req, res) => {
    try {
        const bodyUse = req.body;
        const { idUser, classGroup } = req.body;
        const turmaPesquisada = await classes.findById(classGroup)
        if(!turmaPesquisada) return res.status(404).send('Turma não existe')
        if(turmaPesquisada.vacancy <= 0) return res.status(404).send("Turma sem vagas");
        turmaPesquisada.vacancy = turmaPesquisada.vacancy - 1
        await turmaPesquisada.save();
        const user = await users.findById(idUser);
        if (!user) return res.status(404).send("User não existe");
        const classFind = await classes.findById(classGroup);
        if (!classFind) return res.status(404).send("Turma não existe");
        const arrayEnrolleds = [];
        for (let i = 0; i < classFind.enrolled.length; i++) {
            const enrolledFind = await enrolledClass.findById(classFind.enrolled[i]);
            if (enrolledFind) {
                arrayEnrolleds.push(enrolledFind);
            }
        }
        const checkIfUserEnrolledInClass = arrayEnrolleds.some(element => {
            return element.idUser.toString() == idUser.toString();
        });
        if (checkIfUserEnrolledInClass) return res.status(404).send("CPF já está nessa turma");
        const enrolled = await crud.create(bodyUse, enrolledClass);
        if (enrolled.message) return res.status(404).send(enrolled.message);
        user.register.push(enrolled._id);
        await user.save();
        classFind.enrolled.push(enrolled._id);
        await classFind.save();
        res.status(201).send({success: true, data: enrolled});
    } catch (error) {
        res.status(400).send(error);
    }
}

const readEnrolled = async (req, res) => {
    try {
        let checkModel = await enrolledClass.find().populate("role").populate({path: "classGroup", populate: {path: 'subject'}}).populate("idUser");
        res.status(200).json({success: true, data: checkModel});
    } catch (error) {
        res.status(404).send(error);
    }
}

const readEnrolledById = async (req, res) => {
    const { id } = req.params;
    const checkResponse = await crud.readById(id, enrolledClass);
    if (checkResponse.message == 'não encontrado') return res.status(404).send(checkResponse.message);
    if (checkResponse.error) return res.status(400).send(checkResponse.error)
    res.status(200).json({success: true, data: checkResponse});
}

const updateEnrolled = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, enrolledClass);
    if (check.message) return res.status(400).send(check.message);
    res.status(204).send()
}

const deleteEnrolled = async (req, res) => {
    const { id } = req.params;
    const check = await crud.remove(id, enrolledClass);
    if (check.message) return res.status(404).send(check.message);
    const idUser = check.idUser;
    const classGroup = check.classGroup;
    const classFind = await classes.findById(classGroup);
    const userFind = await users.findById(idUser)
    if(!userFind || !classFind) return res.status(400).send("Erro ao procurar Usuário ou Turma")
    classFind.vacancy = classFind.vacancy + 1
    const indexClass = classFind.enrolled.findIndex(element => element == check._id)
    const indexUser = userFind.register.findIndex(element => {
        return element.toString() == check._id.toString();
    });
    classFind.enrolled.splice(indexClass, 1);
    await classFind.save()
    userFind.register.splice(indexUser, 1);
    await userFind.save();
    res.status(204).send()
}

const enrolledControll = {
    createEnrolled,
    readEnrolled,
    readEnrolledById,
    deleteEnrolled,
    updateEnrolled
}

export default enrolledControll;  