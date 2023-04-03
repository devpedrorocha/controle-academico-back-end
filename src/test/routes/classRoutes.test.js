import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

let server;
beforeEach(() => {
    const port = 4444;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes Class', () => {
    const objetoClasses = {
        name: "2022Teste",
        vacancy: 22,
        dateStart: '2022-07-03T00:00:00.000Z',
        dateEnd: '2022-07-04T00:00:00.000Z',
        enrolled: [],
        subject: "631284281945400d2d9e6179"
    }

    it('Deve retornar de /classes', async () => {
        const retorno = await request(app)
            .get("/classes")
            .expect(200)

        expect(retorno.body[0].name).toBe("2022A")
    })

    let idTest;
    it('Deve criar em /classes/create', async () => {

        const retorno = await request(app)
            .post("/classes/create")
            .send(objetoClasses)
            .expect(201)
        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /classes/:id', async () => {
        const retorno = await request(app)
            .get(`/classes/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoClasses
        }));
    })

    it.each([
        ['name', { name: "teste2" }],
        ['vacancy', { vacancy: 22 }],
        ['dateStart', { dateStart: '2022-07-04T00:00:00.000Z' }],
        ['dateEnd', { dateEnd: '2022-07-05T00:00:00.000Z'}],
        ['enrolled', { enrolled: [] }],
        ['subject', { subject: "631284281945400d2d9e6179" }]
    ])('Deve atualizar o %s pelo id em /classes/update/:id', async (chave, params) => {
        const requestObj = { request }
        const spy = jest.spyOn(requestObj, 'request')
        await requestObj.request(app)
            .put(`/classes/update/${idTest}`)
            .send(params)
            .expect(204);

        expect(spy).toHaveBeenCalled()
    })


    it('Deve remover pelo id em /classes/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/classes/delete/${idTest}`)
            .expect(204)
    })
});


describe('Routes Actions teste de erros', () => {
    const objetoClasses = {
        name: "2022A",
        vacancy: 22,
        dateStart: moment().format(),
        dateEnd: moment().add(1, 'd').format(),
        enrolled: [],
        subject: "631284281945400d2d9e6179"
    }


    it('Deve retornar erro ao passar um body vazio em /classes/create', async () => {

        const retorno = await request(app)
            .post("/classes/create")
            .send({})
            .expect(400)

        expect(retorno.text).toBe("Corpo da requisição incorreto");
    })

    it('Deve retornar não encontrado quando passamos id inexistente em /classes/:id', async () => {
        const retorno = await request(app)
            .get(`/classes/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)

        expect(retorno.error.text).toBe("não encontrado");
    })

    it('Deve retornar um erro de não encontrado pelo id em /classes/update/:id', async () => {
        await request(app)
            .put(`/classes/update/63164a1bb7e54abe7b0c9bdd`)
            .send({})
            .expect(404);
    })

    it('Deve retornar erro ao passar um body vazio em /classes/update/id', async () => {

        const retorno = await request(app)
            .post("/classes/create")
            .send({})
            .expect(400)
    })

    it('Deve retornar erro ao passar um query não encontrado vazio em /classes/methods', async () => {

        const retorno = await request(app)
            .post("/classes/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(404)
    })

    it('Deve retornar um erro de não encontrado pelo id em /classes/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/classes/delete/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)
    })
});