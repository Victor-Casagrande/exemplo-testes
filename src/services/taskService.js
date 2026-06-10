const tasks = [];

function addTask(title) {
    if (!title || title.trim() === "") {
        throw new Error("Título obrigatório");
    }

    const task = {
        id: tasks.length + 1,
        title
    };

    tasks.push(task);

    return task;
}

function getTasks() {
    return tasks;
}

module.exports = {
    addTask,
    getTasks
};