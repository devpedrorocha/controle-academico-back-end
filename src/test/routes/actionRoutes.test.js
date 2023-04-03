import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';

let server;
beforeEach(() => {
    const port = 2222;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes Actions', () => {
    const objetoActions = {
        name: "teste",
        methods: ["teste"]
    }

    it('Deve retornar de /actions', async () => { 
        const retorno = await request(app)
            .get("/actions")
            .expect(200)

        expect(retorno.body[0].name).toBe("Cadastrar aluno")
    })

    let idTest;
    it('Deve criar em /actions/create', async () => {

        const retorno = await request(app)
            .post("/actions/create")
            .send(objetoActions)
            .expect(201)

        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /actions/:id', async () => {
        const retorno = await request(app)
            .get(`/actions/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoActions
        }));
    })

    it.each([
        ['name', { name: "teste2" }],
        ['methods', { methods: ["teste2"] }]
    ])('Deve atualizar o %s pelo id em /actions/update/:id', async (chave, params) => {
        const requestObj = { request }
        const spy = jest.spyOn(requestObj, 'request')
        await requestObj.request(app)
            .put(`/actions/update/${idTest}`)
            .send(params)
            .expect(204);

        expect(spy).toHaveBeenCalled()
    })

    it('Deve adicionar metodos a uma ação', async () => {
        const retorno = await request(app)
            .patch("/actions/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(204)
    })

    it('Deve retornar um erro ao adicionar metodos que já existem', async () => {
        const retorno = await request(app)
            .patch("/actions/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(400)
    })

    it('Deve retornar erro ao passar um body vazio /actions/methods', async () => {

        const retorno = await request(app)
            .patch("/actions/methods")
            .query({ name: "teste2" })
            .send({})
            .expect(400)
    })

    it('Deve remover pelo id em /actions/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/actions/delete/${idTest}`)
            .expect(204)
    })
});


describe('Routes Actions teste de erros', () => {
    const objetoActions = {
        name: "teste",
        methods: ["teste"]
    }

    let idTest;
    it('Deve retornar erro ao passar um body vazio em /actions/create', async () => {

        const retorno = await request(app)
            .post("/actions/create")
            .send({})
            .expect(400)

        expect(retorno.text).toBe("Corpo da requisição incorreto");
    })

    it('Deve retornar não encontrado quando passamos id inexistente em /actions/:id', async () => {
        const retorno = await request(app)
            .get(`/actions/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)

        expect(retorno.error.text).toBe("não encontrado");
    })

    it('Deve retornar um erro de não encontrado pelo id em /actions/update/:id', async () => {
        await request(app)
            .put(`/actions/update/63164a1bb7e54abe7b0c9bdd`)
            .send({})
            .expect(404);
    })

    it('Deve retornar erro ao passar um body vazio em /actions/update/id', async () => {

        const retorno = await request(app)
            .post("/actions/create")
            .send({})
            .expect(400)
    })

    it('Deve retornar erro ao passar um query não encontrado vazio em /actions/methods', async () => {

        const retorno = await request(app)
            .post("/actions/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(404)
    })

    it('Deve retornar um erro de não encontrado pelo id em /actions/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/actions/delete/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)
    })
});