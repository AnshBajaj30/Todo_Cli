const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

// Initialize commander
const program = new Command();
const TODO_FILE = path.join(__dirname, 'todos.json');

// Load todos from the file, or return an empty list if file doesn't exist
function loadTodos() {
    if (fs.existsSync(TODO_FILE)) {
        const data = fs.readFileSync(TODO_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Save the todos to the file
function saveTodos(todos) {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 4), 'utf-8');
}

// Add a new todo
function addTodo(task) {
    const todos = loadTodos();
    todos.push({ task, done: false });
    saveTodos(todos);
    console.log(`Todo "${task}" added.`);
}

// Delete a todo by index
function deleteTodo(index) {
    const todos = loadTodos();
    if (index >= 0 && index < todos.length) {
        const removed = todos.splice(index, 1);
        saveTodos(todos);
        console.log(`Todo "${removed[0].task}" deleted.`);
    } else {
        console.log("Invalid index.");
    }
}

// Mark a todo as done by index
function markTodoDone(index) {
    const todos = loadTodos();
    if (index >= 0 && index < todos.length) {
        todos[index].done = true;
        saveTodos(todos);
        console.log(`Todo "${todos[index].task}" marked as done.`);
    } else {
        console.log("Invalid index.");
    }
}

// List all todos
function listTodos() {
    const todos = loadTodos();
    if (todos.length === 0) {
        console.log("No todos available.");
        return;
    }
    
    todos.forEach((todo, index) => {
        const status = todo.done ? '✔' : '✘';
        console.log(`${index}. ${todo.task} [${status}]`);
    });
}

// Define CLI commands using commander
program
    .version('1.0.0')
    .description('A simple filesystem-based Todo CLI');

// Add command
program
    .command('add <task>')
    .description('Add a new todo')
    .action((task) => {
        addTodo(task);
    });

// Delete command
program
    .command('delete <index>')
    .description('Delete a todo by index')
    .action((index) => {
        deleteTodo(parseInt(index));
    });

// Done command
program
    .command('done <index>')
    .description('Mark a todo as done by index')
    .action((index) => {
        markTodoDone(parseInt(index));
    });

// List command
program
    .command('list')
    .description('List all todos')
    .action(() => {
        listTodos();
    });

// Parse the arguments
program.parse(process.argv);

   
