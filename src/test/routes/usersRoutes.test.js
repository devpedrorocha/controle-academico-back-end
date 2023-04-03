import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

let server;
beforeEach(() => {
    const port = 7777;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes Users', () => {
    const objetoUsers = {
        cpf: "123456789",
        email: "test@test.com",
        name: "test",
        surname: "test",
        password: "1234",
        telephone: "54996216534",
        address: "rua dale",
        register: []
    }

    it('Deve retornar de /users', async () => {
        const retorno = await request(app)
            .get("/users")
            .expect(200)

        expect(retorno.body[0].name).toBe("jojo")
    })

    let idTest;
    it('Deve criar em /users/create', async () => {
        const retorno = await request(app)
            .post("/users/create")
            .send(objetoUsers)
            .expect(201)
        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /users/:id', async () => {
        const retorno = await request(app)
            .get(`/users/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            password: expect.any(String),
            cpf: "123456789",
            email: "test@test.com",
            name: "test",
            surname: "test",
            telephone: "54996216534",
            address: "rua dale",
            register: []
        }));
    })

    it.each([
        ['cpf', { cpf: "987654321" }],
        ['email', { email: "test2@test2.com" }],
        ['name', { name: "test2" }],
        ['surname', { surname: "test2" }],
        ['password', { password: "12342" }],
        ['telephone', { telephone: "549962165342" }],
        ['address', { address: "rua dale2" }],
        ['register', { register: [] }]
    ])('Deve atualizar o %s pelo id em /users/update/:id', async (chave, params) => {
        const requestObj = { request }
        const spy = jest.spyOn(requestObj, 'request')
        await requestObj.request(app)
            .put(`/users/update/${idTest}`)
            .send(params)
            .expect(204);

        expect(spy).toHaveBeenCalled()
    })


    it('Deve remover pelo id em /users/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/users/delete/${idTest}`)
            .expect(204)
    })
});


describe('Routes Actions teste de erros', () => {
    const objetoUsers = {
        name: "2022A",
        vacancy: 22,
        dateStart: moment().format(),
        dateEnd: moment().add(1, 'd').format(),
        enrolled: [],
        subject: "631249f84a599592e6368b55"
    }


    it('Deve retornar erro ao passar um body vazio em /users/create', async () => {

        const retorno = await request(app)
            .post("/users/create")
            .send({})
            .expect(400)

        expect(retorno.text).toBe("Corpo da requisição incorreto");
    })

    it('Deve retornar não encontrado quando passamos id inexistente em /users/:id', async () => {
        const retorno = await request(app)
            .get(`/users/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)

        expect(retorno.error.text).toBe("não encontrado");
    })

    it('Deve retornar um erro de não encontrado pelo id em /users/update/:id', async () => {
        await request(app)
            .put(`/users/update/63164a1bb7e54abe7b0c9bdd`)
            .send({})
            .expect(404);
    })

    it('Deve retornar erro ao passar um body vazio em /users/update/id', async () => {

        const retorno = await request(app)
            .post("/users/create")
            .send({})
            .expect(400)
    })

    it('Deve retornar erro ao passar um query não encontrado vazio em /users/methods', async () => {

        const retorno = await request(app)
            .post("/users/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(404)
    })

    it('Deve retornar um erro de não encontrado pelo id em /users/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/users/delete/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)
    })
});