import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

let server;
beforeEach(() => {
    const port = 5555;
    server = app.listen(port);
})

afterEach(() => {
    server.close();
})

describe('Routes Role', () => {
    const objetoRoles = {
        name: "Test",
        actions: [],
    }

    it('Deve retornar de /roles', async () => {
        const retorno = await request(app)
            .get("/roles")
            .expect(200)

        expect(retorno.body[0].name).toBe("Aluno")
    })

    let idTest;
    it('Deve criar em /roles/create', async () => {

        const retorno = await request(app)
            .post("/roles/create")
            .send(objetoRoles)
            .expect(201)
        idTest = retorno.body._id;
    })

    it('Deve buscar pelo id em /roles/:id', async () => {
        const retorno = await request(app)
            .get(`/roles/${idTest}`)
            .expect(200)

        expect(retorno.body).toEqual(expect.objectContaining({
            _id: idTest,
            ...objetoRoles
        }));
    })

    it('Deve remover pelo id em /roles/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/roles/delete/${idTest}`)
            .expect(204)
    })
});


describe('Routes Roles teste de erros', () => {
    const objetoRoles = {
        name: "2022A",
        vacancy: 22,
        dateStart: moment().format(),
        dateEnd: moment().add(1, 'd').format(),
        enrolled: [],
        subject: "631249f84a599592e6368b55"
    }


    it('Deve retornar erro ao passar um body vazio em /roles/create', async () => {

        const retorno = await request(app)
            .post("/roles/create")
            .send({})
            .expect(400)

        expect(retorno.text).toBe("Corpo da requisição incorreto");
    })

    it('Deve retornar não encontrado quando passamos id inexistente em /roles/:id', async () => {
        const retorno = await request(app)
            .get(`/roles/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)

        expect(retorno.error.text).toBe("não encontrado");
    })

    it('Deve retornar um erro de não encontrado pelo id em /roles/update/:id', async () => {
        await request(app)
            .put(`/roles/update/63164a1bb7e54abe7b0c9bdd`)
            .send({})
            .expect(404);
    })

    it('Deve retornar erro ao passar um body vazio em /roles/update/id', async () => {

        const retorno = await request(app)
            .post("/roles/create")
            .send({})
            .expect(400)
    })

    it('Deve retornar erro ao passar um query não encontrado vazio em /roles/methods', async () => {

        const retorno = await request(app)
            .post("/roles/methods")
            .query({ name: "teste2" })
            .send({ method: "testar" })
            .expect(404)
    })

    it('Deve retornar um erro de não encontrado pelo id em /roles/delete/:id', async () => {
        const retorno = await request(app)
            .delete(`/roles/delete/63164a1bb7e54abe7b0c9bdd`)
            .expect(404)
    })
});