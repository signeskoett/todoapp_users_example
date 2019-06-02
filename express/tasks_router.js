module.exports = (data) => {
    let express = require('express');
    let router = express.Router();

    /****** Routes *****/
    router.get('/', (req, res) => res.json(data));

    router.get('/:id', (req, res) => {
        res.json(data.find(elm => elm.id === parseInt(req.params.id, 10)));
    });

    router.post('/', (req, res) => {
        // Finding the next available id
        const reducer = (acc, curr) => Math.max(acc, curr);
        let nextId = data.map(el => el.id).reduce(reducer) + 1;

        // Define the task object
        let task = {
            task: req.body.task, // Text of the task
            done: req.body.done, // Whether it is done or not
            id: nextId
        };
        data.push(task); // Put the new task in the data array

        // Return a message and the new task object
        res.json({msg: "Task created", task: task});
    });

    router.put('/:id', (req, res) => {
        // Find the task given the id
        const id = parseInt(req.params.id);
        const task = data.find(elm => elm.id === id);

        // Change the task
        task.task = req.body.task;
        task.done = req.body.done;

        console.log(`Updated task`);
        console.log(task);

        // Return a message and the updated task object
        res.json({msg: "Task updated", task: task});
    });

    return router;
};