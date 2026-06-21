jest.mock("../../repositories/taskRepository", () => ({
  save: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
}));

const repository = require("../../repositories/taskRepository");
const taskService = require("../../services/taskService");

describe("Task Service - Testes Unitários", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. addTask deve retornar um objeto com id e title", () => {
    const task = taskService.addTask("Estudar");
    expect(task).toHaveProperty("id");
    expect(task).toHaveProperty("title", "Estudar");
  });

  test("2. addTask deve lançar erro 'Titulo obrigatorio' para string vazia", () => {
    expect(() => taskService.addTask("")).toThrow("Titulo obrigatorio");
  });

  test("3. addTask deve lançar erro quando title é um número", () => {
    expect(() => taskService.addTask(42)).toThrow("Título deve ser uma string");
  });

  test("4. addTask deve chamar repository.save exatamente uma vez", () => {
    taskService.addTask("Estudar");
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  test("5. getTasks deve retornar o valor mockado de repository.findAll", () => {
    const tarefasMock = [{ id: 1, title: "Tarefa Mockada" }];
    repository.findAll.mockReturnValue(tarefasMock);

    const result = taskService.getTasks();

    expect(result).toEqual(tarefasMock);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  test("6. addTask deve lançar erro 'Titulo muito curto'", () => {
    expect(() => taskService.addTask("Oi")).toThrow("Titulo muito curto");
  });

  test("7. addTask deve lançar erro 'Titulo muito longo'", () => {
    const tituloLongo = "A".repeat(101);
    expect(() => taskService.addTask(tituloLongo)).toThrow(
      "Titulo muito longo",
    );
  });

  describe("8. deleteTask(id)", () => {
    test("(a) deve chamar repository.delete com o id correto", () => {
      repository.findAll.mockReturnValue([{ id: 1, title: "Estudar" }]);

      taskService.deleteTask(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    test("(b) deve lançar erro quando o id não existe", () => {
      repository.findAll.mockReturnValue([]);

      expect(() => taskService.deleteTask(999)).toThrow(
        "Tarefa não encontrada",
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  test.each([[null], [undefined], [123], [[]], [{}]])(
    "9. addTask deve falhar ao receber tipos inválidos (ex: %p)",
    (valorInvalido) => {
      expect(() => taskService.addTask(valorInvalido)).toThrow();
    },
  );

  test("10. addTask deve gerar ids únicos para chamadas consecutivas", () => {
    const task1 = taskService.addTask("Tarefa Um");
    const task2 = taskService.addTask("Tarefa Dois");

    expect(task1.id).not.toBe(task2.id);
  });
});
