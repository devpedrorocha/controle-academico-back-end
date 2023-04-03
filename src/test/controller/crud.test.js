import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import crud from "../../controller/crud";
import app from '../../app.js';
import actions from '../../model/Action.js';
import mongoose from "mongoose";


let server;
beforeEach(() => {
    const port = 1111
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Testando CRUD', () => {
    const objetoActions = {
        name: "jo",
        methods: ["test"],
    }

    let idTest;

    it('Deve criar um objeto', async () => {
        const actionsReturn = await crud.create(objetoActions, actions);
        idTest = actionsReturn._id;
        expect(actionsReturn).toEqual(expect.objectContaining({
            ...objetoActions,
            _id: expect.any(mongoose.Types.ObjectId)
        }));
        idTest = actionsReturn._id;
    })

    it('Deve ler um objeto', async () => {
        const retorno = await crud.read(actions, 'methods');
        expect(retorno).toEqual(expect.any(Array));
    })

    it('Deve ler pelo id passado', async () => {
        const retorno = await crud.readById(idTest, actions);
        expect(retorno).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoActions
        }));
    })

    it('Deve fazer update pelo id', async () => {
        const bodyUpdate = {
            name: "jonathan"
        }
        await crud.update(idTest, bodyUpdate, actions);
        const updateTest = await crud.readById(idTest, actions);
        expect(updateTest.name).toBe("jonathan");
    })

    it('Deve remover pelo id', async () => {
        const retorno = await crud.remove(idTest, actions);
        expect(retorno).toEqual(expect.objectContaining({
            _id: idTest,
            name: "jonathan",
            methods: ["test"]
        }));
    })
})


