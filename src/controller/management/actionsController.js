import actions from "../../model/Action.js";
import crud from "../crud.js";

const createAction = async (req, res) => {
    const body = req.body;
    const checkResponse = await crud.create(body, actions);
    if (checkResponse.message) return res.status(400).send("Corpo da requisição incorreto");
    res.status(201).send({success: true, data: checkResponse});
}

const readActions = async (req, res) => {
    const checkResponse = await crud.read(actions, 'methods');
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(200).send({success: true, data: checkResponse});

}

const readActionsById = async (req, res) => {
    const { id } = req.params;
    const checkResponse = await crud.readById(id, actions);
    if (checkResponse.message == 'não encontrado') return res.status(404).send(checkResponse.message);
    if (checkResponse.error) return res.status(400).send(checkResponse.error)
    res.status(200).send({success: true, data: checkResponse});
}

const updateActions = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, actions);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const deleteActions = async (req, res) => {
    const { id } = req.params;
    const check = await crud.remove(id, actions);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const addMethodInActions = async (req, res) => {
    try {
        const { name } = req.query;
        const { method } = req.body;
        if (!method) throw new Error("método não passado");
        const actionFind = await actions.findOne({ name: name });
        if (!actionFind) throw new Error("Action não encontrada");
        const checkIfMethodsNotExists = actionFind.methods.every(element => element != method);
        if (!checkIfMethodsNotExists) throw new Error('método já existente')
        actionFind.methods.push(method);
        await actionFind.save();
        res.status(204).send();
    } catch (error) {
        if (error.message === "Action não encontrada") return res.status(404).send(error.message);
        res.status(400).send(error.message);
    }
}

const deleteMethodInActions = async (req, res) => {
    try {
        const { name } = req.query;
        const { method } = req.body;
        const actionFind = await actions.findOne({ name: name });
        const checkIfMethodsExists = actionFind.methods.findIndex(element => element == method)
        if (checkIfMethodsExists == -1) return res.status(401).send("método não existente");
        actionFind.methods.splice(checkIfMethodsExists, 1);
        await actionFind.save();
        res.status(204).send();
    } catch (error) {
        res.status(401).send(error);
    }
}

const actionController = {
    createAction,
    readActions,
    readActionsById,
    updateActions,
    deleteActions,
    addMethodInActions,
    deleteMethodInActions
}

export default actionController;