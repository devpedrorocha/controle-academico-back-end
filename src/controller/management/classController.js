import classes from "../../model/Class.js";
import subjects from '../../model/Subject.js';
import crud from "../crud.js";
import enrolleds from '../../model/EnrolledClass.js'
import users from "../../model/User.js";

const createClass = async (req, res) => {
    try {
        const bodyUse = req.body;
        const { name, subject } = req.body;
        if (!name) throw new Error("Corpo da requisição incorreto")
        const checkSubject = await subjects.findOne({ _id: subject });
        if (!checkSubject) throw new Error("Disciplina não existe");
        const array = [];
        for (let i = 0; i < checkSubject.classes.length; i++) {
            const classFind = await classes.findById({ _id: checkSubject.classes[i] });
            if(classFind) {
                array.push(classFind)
            }
        }
        const check = array.every(element => element.name != name);
        if (!check) throw new Error("Turma já existe.");
        const classCreate = await crud.create(bodyUse, classes);
        if (classCreate.message) return res.status(400).send(classCreate.message);
        res.status(201).send({success: true, data: classCreate});
        const id = classCreate.subject;
        const subjectFind = await subjects.findById(id);
        subjectFind.classes.push(classCreate._id);
        await subjectFind.save();
    } catch (error) {
        if (error.message === "Disciplina não existe") res.status(404).send(error.message);
        res.status(400).send(error.message);
    }
}

const readClasses = async (req, res) => {
    const checkResponse = await crud.read(classes, 'subject');
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(200).send({success: true, data: checkResponse});
}

const readClassesById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkModel = await classes.findById(id).populate('subject');
        console.log(checkModel)
        if (!checkModel) return res.status(404).send();
        return res.status(200).send({success: true, data: checkModel});
    } catch (error) {
        if (error) return res.status(400).send(error)   
    }
}

const updateClass = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, classes);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const deleteClass = async (req, res) => {
    const { id } = req.params;
    const check = await crud.remove(id, classes);
    if (check.message) return res.status(404).send(check.message);
    const subjectClass = await subjects.findOne({ _id: check.subject });
    if (subjectClass) {
        const index = subjectClass.classes.findIndex(element => {
            return element.toString() == check._id.toString()
        })
        subjectClass.classes.splice(index, 1);
        await subjectClass.save();
    }
    for(let teste in check.enrolled) {
        const checkRemove = await crud.remove(check.enrolled[teste], enrolleds);
        if (!checkRemove) return res.status(404).send();
        const idUser = checkRemove.idUser;
        const userFind = await users.findById(idUser) 
        if(!userFind) return res.status(400).send("Erro ao procurar Usuário ou Turma")
        const indexUser = userFind.register.findIndex(element => {
            return element.toString() == checkRemove._id.toString();
        });
        userFind.register.splice(indexUser, 1);
        await userFind.save();
    }
    res.status(204).send();
}

const classControll = {
    createClass,
    readClasses,
    readClassesById,
    updateClass,
    deleteClass,
}

export default classControll;
