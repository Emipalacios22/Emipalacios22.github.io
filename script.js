class ToDoApp {
    constructor() {
        this.tasks = [];
        this.counter = 1;
        this.listElement = document.getElementById('todo-list');
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.loadTasks();
        this.render();
        this.form.addEventListener('submit', (e) => this.addTask(e));
        this.listElement.addEventListener('click', (e) => this.handleListClick(e));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
        const savedCounter = localStorage.getItem('taskCounter');
        this.counter = savedCounter ? Number(savedCounter) : 1;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskCounter', this.counter);
    }

    addTask(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;
        this.tasks.push({
            id: this.counter,
            text,
            completed: false
        });
        this.counter++;
        this.input.value = '';
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    handleListClick(e) {
        const li = e.target.closest('li');
        if (!li) return;
        const id = Number(li.dataset.id);
        if (e.target.classList.contains('delete-btn')) {
            this.deleteTask(id);
        } else if (e.target.classList.contains('task-text')) {
            this.toggleTask(id);
        }
    }

    render() {
        this.listElement.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span class="task-text" style="cursor:pointer;">${task.text}</span>
                <button class="delete-btn">Eliminar</button>
            `;
            this.listElement.appendChild(li);
        });
    }
    
}

document.addEventListener('DOMContentLoaded', () => new ToDoApp());