import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

let server;
beforeEach(() => {
    const port = 9999;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes enrroled class', () => {
    const objetoUsers = {
        cpf: "123456784",
        email: "test4@test.com",
        name: "test4",
        surname: "test4",
        password: "12344",
        telephone: "549962165344",
        address: "rua dale4",
        register: []
    }

    let idUsersControll;
    let objetoEnrolled;

    it('Deve criar em /users/create', async () => {
        const retorno = await request(app)
            .post("/users/create")
            .send(objetoUsers)
            .expect(201)
        idUsersControll = retorno.body._id;
    })

    //----------------------------------------------------------------------------------


    it('Deve retornar de /enrolled', async () => {
        const retorno = await request(app)
            .get("/enrolled")
            .expect(200)
    })

    let idTest;
    it('Deve criar em /enrolled/create', async () => {

        objetoEnrolled = {
            idUser: idUsersControll,
            role: "631249ac4a599592e6368b4f",
            classGroup: "6315503e3ef000120553f493"
        }

        const retorno = await request(app)
            .post("/enrolled/create")
            .send(objetoEnrolled)
            .expect(201)
        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /enrolled/:id', async () => {
        const retorno = await request(app)
            .get(`/enrolled/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoEnrolled
        }));
    })

    it.each([
        ['role', { role: "631249ac4a599592e6368b4f" }],
        ['classGroup', { classGroup: "631249ac4a599592e6368b4f" }]
    ])('Deve atualizar o %s pelo id em /enrolled/update/:id', async (chave, params) => {
        const requestObj = { request }
        const spy = jest.spyOn(requestObj, 'request')
        const retorno = await requestObj.request(app)
            .put(`/enrolled/update/${idTest}`)
            .send(params)
            .expect(204);
        expect(spy).toHaveBeenCalled()
    })


    it('Deve remover pelo id em /enrolled/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/enrolled/delete/${idTest}`)
            .expect(204)
    })


    //----------------------------------------------------------------------------------

    it('Deve remover pelo id em /users/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/users/delete/${idUsersControll}`)
            .expect(204)
    })
})

/* 
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
}); */