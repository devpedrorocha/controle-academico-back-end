import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

let server;
beforeEach(() => {
    const port = 6666;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes Subjects', () => {
    const objetoSubjects = {
        name: "Teste",
        workLoad: 72,
        menu: "Elementos de lógica matemática, teoria dos conjuntos, divisibilidade e congruência nos números inteiros, indução matemática, relações de recorrência, relações de ordem, reticulados, álgebra booleana e estruturas algébricas.",
        classes: []
    }

    it('Deve retornar de /subjects', async () => {
        const retorno = await request(app)
            .get("/subjects")
            .expect(200)

        expect(retorno.body[0].name).toBe("Matemática Discreta")
    })

    let idTest;
    it('Deve criar em /subjects/create', async () => {

        const retorno = await request(app)
            .post("/subjects/create")
            .send(objetoSubjects)
            .expect(201)
        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /subjects/:id', async () => {
        const retorno = await request(app)
            .get(`/subjects/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoSubjects
        }));
    })

    it.each([
        ['name', { name: "teste2" }],
        ['workLoad', { workLoad: 22 }],
        ['classes', { classes: [] }],
        ['menu', { menu: "631284281945400d2d9e6179" }]
    ])('Deve atualizar o %s pelo id em /subjects/update/:id', async (chave, params) => {
        const requestObj = { request }
        const spy = jest.spyOn(requestObj, 'request')
        await requestObj.request(app)
            .put(`/subjects/update/${idTest}`)
            .send(params)
            .expect(204);

        expect(spy).toHaveBeenCalled()
    })


    it('Deve remover pelo id em /subjects/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/subjects/delete/${idTest}`)
            .expect(204)
    })
});


describe('Routes Subjects teste de erros', () => {
    const objetoSubjects = {
        name: "2022A",
        vacancy: 22,
        dateStart: moment().format(),
        dateEnd: moment().add(1, 'd').format(),
        enrolled: [],
        subject: "631249f84a599592e6368b55"
    }


    it('Deve retornar erro ao passar um body vazio em /subjects/create', async () => {

        const retorno = await request(app)
            .post("/subjects/create")
            .send({})
            .expect(400)

        expect(retorno.text).toBe("Corpo da requisição incorreto");
    })

    it('Deve retornar não encontrado quando passamos id inexistente em /subjects/:id', async () => {
        const retorno = await request(app)
            .get(`/subjects/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)

        expect(retorno.error.text).toBe("não encontrado");
    })

    it('Deve retornar um erro de não encontrado pelo id em /subjects/update/:id', async () => {
        await request(app)
            .put(`/subjects/update/63164a1bb7e54abe7b0c9bdd`)
            .send({})
            .expect(404);
    })

    it('Deve retornar erro ao passar um body vazio em /subjects/update/id', async () => {

        const retorno = await request(app)
            .post("/subjects/create")
            .send({})
            .expect(400)
    })

    it('Deve retornar erro ao passar um query não encontrado vazio em /subjects/methods', async () => {

        const retorno = await request(app)
            .post("/subjects/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(404)
    })

    it('Deve retornar um erro de não encontrado pelo id em /subjects/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/subjects/delete/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)
    })
});