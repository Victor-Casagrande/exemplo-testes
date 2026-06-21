const tasks = [];

function save(task) {
  tasks.push(task);
}

function findAll() {
  return tasks;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
}

module.exports = {
  save,
  findAll,
  delete: deleteTask,
};
