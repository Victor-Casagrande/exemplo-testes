const taskService = require("../../src/services/taskService");

describe("Task Service", () => {

    test("deve criar tarefa", () => {

        const tarefa = taskService.addTask("Estudar");

        expect(tarefa.title).toBe("Estudar");
    });

    test("deve lançar erro sem título", () => {

        expect(() => {
            taskService.addTask("");
        }).toThrow("Título obrigatório");

    });

});