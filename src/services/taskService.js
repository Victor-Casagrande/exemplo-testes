const repository = require("../repositories/taskRepository");

let currentId = 1;

function addTask(title) {
  if (!title) {
    throw new Error("Titulo obrigatorio");
  }

  if (typeof title !== "string") {
    throw new Error("Título deve ser uma string");
  }

  if (title.trim().length < 3) {
    throw new Error("Titulo muito curto");
  }

  if (title.length > 100) {
    throw new Error("Titulo muito longo");
  }

  const task = {
    id: currentId++,
    title,
  };

  repository.save(task);

  return task;
}

function getTasks() {
  return repository.findAll();
}

function deleteTask(id) {
  const tasks = repository.findAll();
  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    throw new Error("Tarefa não encontrada");
  }

  repository.delete(id);
}

module.exports = {
  addTask,
  getTasks,
  deleteTask,
};
