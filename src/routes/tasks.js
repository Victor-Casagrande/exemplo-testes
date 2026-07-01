const express = require("express");
const router = express.Router();

const taskService = require("../services/taskService");

// GET /tasks — lista todas as tarefas
router.get("/", (req, res) => {
  res.json(taskService.getTasks());
});

// GET /tasks/:id — retorna uma tarefa específica ou 404
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const task = taskService.getTaskById(id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// POST /tasks — cria uma nova tarefa
router.post("/", express.json(), (req, res) => {
  try {
    const task = taskService.addTask(req.body.title);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id — remove uma tarefa pelo id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    taskService.deleteTask(id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;