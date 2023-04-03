async function create(body, models) {
    try {
        const model = new models(body);
        await model.save();
        return model;
    } catch (error) {
        return { message: error };
    }
}
async function read(model, populate) {
    try {
        const checkModel = await model.find().populate(populate);
        return checkModel;
    } catch (error) {
        return { message: error };
    }
}

async function readById(id, model) {
    try {
        const checkModel = await model.findById(id);
        if (!checkModel) return { message: 'não encontrado' };
        return checkModel;
    } catch (error) {
        return { message: error };
    }
}

async function update(id, body, model) {
    try {
        const checkExists = await model.findByIdAndUpdate(id, { $set: body });
        if (!checkExists) return { message: "Não encontrada" };
        return checkExists;
    } catch (error) {
        return { message: error };
    }
}

async function remove(id, model) {
    try {
        const checkExists = await model.findByIdAndDelete(id);
        if (!checkExists) return {message: "Erro ao remover"};
        return checkExists;
    } catch (error) {
        return {message: error};
    }
}

const crud = {
    create,
    remove,
    read,
    update,
    readById
}

export default crud;