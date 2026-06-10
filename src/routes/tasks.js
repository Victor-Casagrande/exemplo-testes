const express = require("express");
const router = express.Router();

const taskService = require("../services/taskService");

router.get("/", (req, res) => {
    res.json(taskService.getTasks());
});

router.post("/", express.json(), (req, res) => {
    try {
        const task = taskService.addTask(req.body.title);

        res.status(201).json(task);

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;