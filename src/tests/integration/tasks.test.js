const request = require("supertest");

const app = require("../../src/app");

describe("API de tarefas", () => {

    test("POST /tasks", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Comprar pão"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.title)
            .toBe("Comprar pão");

    });

});