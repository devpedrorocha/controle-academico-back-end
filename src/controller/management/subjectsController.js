import subjects from '../../model/Subject.js';
import crud from '../crud.js';

const createSubject = async (req, res) => {
    const body = req.body;
    if (!body.name) return res.status(400).send("Corpo da requisição incorreto");
    const checkResponse = await crud.create(body, subjects);
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(201).send({success: true, data: checkResponse});
}

const readSubject = async (req, res) => {
    const checkResponse = await crud.read(subjects, 'classes');
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(200).send({success: true, data: checkResponse});

}

const readSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const checkResponse = await subjects.findById(id).populate('classes');
        if (!checkResponse) return res.status(404).send(checkResponse.message);
        res.status(200).send({success: true, data: checkResponse});
    } catch (error) {       
        res.status(400).send(error)
    }
}
const updateSubject = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, subjects);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const deleteSubject = async (req, res) => {
    const { id } = req.params;
    const check = await crud.remove(id, subjects);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const subjectControll = {
    createSubject,
    readSubject,
    readSubjectById,
    deleteSubject,
    updateSubject
}

export default subjectControll;