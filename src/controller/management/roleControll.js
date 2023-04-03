import roles from '../../model/Role.js';
import actionsModel from '../../model/Action.js';
import crud from '../crud.js';

const createRole = async (req, res) => {
    const body = req.body;
    if (!body.name) return res.status(400).send("Corpo da requisição incorreto");
    const checkResponse = await crud.create(body, roles);
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(201).send({sucsess: true, data: checkResponse});
}

const listRoles = async (req, res) => {
    const checkResponse = await crud.read(roles, 'actions');
    if (checkResponse.message) return res.status(400).send(checkResponse.message);
    res.status(200).send({sucsess: true, data: checkResponse});

}

const readRolesById = async (req, res) => {
    const { id } = req.params;
    const checkResponse = await crud.readById(id, roles);
    if (checkResponse.message == 'não encontrado') return res.status(404).send(checkResponse.message);
    if (checkResponse.error) return res.status(400).send(checkResponse.error)
    res.status(200).send({success: true, data: checkResponse});
}

/* const updateRoles = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const check = await crud.update(id, body, roles);
    if (check.message) return res.status(401).send(check.message);
    res.status(204).send("Update feito com sucesso");
} */

const deleteRoles = async (req, res) => {
    const { id } = req.params;
    const check = await crud.remove(id, roles);
    if (check.message) return res.status(404).send(check.message);
    res.status(204).send();
}

const addActionsInRoles = async (req, res) => {
    try {
        const { id } = req.params; //id da role
        const { action } = req.query; //name da action
        const checkRoles = await roles.findById(id);
        const checkAction = await actionsModel.find({ name: action });
        const idInString = checkAction[0]._id.toString();
        const checkIfActionAlreadyExistsOnPaper = checkRoles
            .actions.every((element) => {
                return element != idInString;
            });
        if (!checkIfActionAlreadyExistsOnPaper) return res.status(400).send("Ação ou papel inexistente, ou papel já possui essa ação");
        checkRoles.actions.push(checkAction[0]._id);
        await checkRoles.save();
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error)
    }
}

const deleteActionsInRoles = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const roleFind = await roles.findById(id);
        const actionID = await actionsModel.find({ name: action });
        const checkIfActionExists = roleFind.actions.indexOf(actionID[0]._id);
        if (checkIfActionExists == -1) return res.status(401).send("Ação não existente");
        roleFind.actions.splice(checkIfActionExists, 1);
        await roleFind.save();
        res.status(204).send();
    } catch (error) {
        res.status(401).send(error);
    }
}


const roleControll = {
    createRole,
    listRoles,
    readRolesById,
    /* updateRoles, */
    deleteRoles,
    addActionsInRoles,
    deleteActionsInRoles
}

export default roleControll;