const repository = require("../repositories/taskRepository");

let currentId = 1;

function addTask(title) {
  // null e undefined são tratados antes do check de string
  if (title === null || title === undefined) {
    throw new Error("Titulo obrigatorio");
  }

  if (typeof title !== "string") {
    throw new Error("Título deve ser uma string");
  }

  if (title.trim().length === 0) {
    throw new Error("Titulo obrigatorio");
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

function getTaskById(id) {
  const tasks = repository.findAll();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    throw new Error("Tarefa não encontrada");
  }

  return task;
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
  getTaskById,
  deleteTask,
};
