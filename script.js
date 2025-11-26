        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        const taskList = document.getElementById('taskList');
        const API_URL = 'https://6926fd8826e7e41498fc77c2.mockapi.io/tasks';

        let tasks = [];

        async function loadTasks() {
            try {
                const response = await fetch(API_URL);
                tasks = await response.json();
                renderTasks();
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }

        async function addTask() {
            const taskText = taskInput.value.trim();
            
            if (taskText === '') return;

            const task = {
                text: taskText,
                completed: false
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(task)
                });

                const newTask = await response.json();
                tasks.push(newTask);
                renderTasks();
                taskInput.value = '';
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }

        async function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (!task || task.completed) return;

            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...task,
                        completed: true
                    })
                });

                const updatedTask = await response.json();
                tasks = tasks.map(t => t.id === id ? updatedTask : t);
                renderTasks();
            } catch (error) {
                console.error('Error toggling task:', error);
            }
        }

        async function deleteTask(id) {
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            taskElement.classList.add('removing');
            
            setTimeout(async () => {
                try {
                    await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE'
                    });

                    tasks = tasks.filter(task => task.id !== id);
                    renderTasks();
                } catch (error) {
                    console.error('Error deleting task:', error);
                    taskElement.classList.remove('removing');
                }
            }, 300);
        }

        function renderTasks() {
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
                taskItem.setAttribute('data-id', task.id);

                taskItem.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-buttons">
                        <button class="task-btn check-btn" onclick="toggleTask('${task.id}')" ${task.completed ? 'disabled' : ''}>✓</button>
                        <button class="task-btn delete-btn" onclick="deleteTask('${task.id}')">🗑</button>
                    </div>
                `;

                taskList.appendChild(taskItem);
            });
        }

        addBtn.addEventListener('click', addTask);

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        loadTasks();