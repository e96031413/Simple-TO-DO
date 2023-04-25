const loginForm = document.getElementById('login-form');
const todoForm = document.getElementById('todo-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoApp = document.getElementById('todo-app');
const loginPage = document.getElementById('login-page');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let authenticated = false;

function initialize() {
  if (isAuthenticated()) {
    showTodoApp();
    renderTodos();
  } else {
    showLoginPage();
  }

  loginForm.addEventListener('submit', handleLogin);
  todoForm.addEventListener('submit', handleNewTodo);
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

function isAuthenticated() {
  return localStorage.getItem('authenticated') === 'true';
}

function showTodoApp() {
  authenticated = true;
  loginPage.style.display = 'none';
  todoApp.style.display = 'block';
}

function showLoginPage() {
  authenticated = false;
  loginPage.style.display = 'block';
  todoApp.style.display = 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (username === '1234' && password === '1234') {
    localStorage.setItem('authenticated', true);
    showTodoApp();
    renderTodos();
  } else {
    alert('Invalid username or password');
  }
}

function handleNewTodo(e) {
  e.preventDefault();
  const todo = todoInput.value.trim();
  if (todo !== '') {
    todos.push({ title: todo, editing: false, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = createTodoListItem(todo, index);
    todoList.appendChild(li);
  });
}

function createTodoListItem(todo, index) {
  const li = document.createElement('li');

  if (todo.editing) {
    li.appendChild(createEditForm(todo, index));
  } else {
    const div = document.createElement('div');
    div.classList.add('todo-buttons');
    div.appendChild(createTodoTitle(todo, index));
    div.appendChild(createEditButton(index));
    div.appendChild(createDeleteButton(index));
    li.appendChild(div);
  }

  return li;
}

function createEditForm(todo, index) {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.value = todo.title;
  form.appendChild(input);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTitle = input.value.trim();
    if (newTitle !== '') {
      todos[index].title = newTitle;
      todos[index].editing = false;
      saveTodos();
      renderTodos();
    }
  });

  return form;
}

function createTodoTitle(todo, index) {
  const todoTitle = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => {
    completeTask(index);
  });

  const span = document.createElement('span');
  span.textContent = todo.title;
  if (todo.completed) {
    span.style.textDecoration = 'line-through';
  }

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons-div');
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    editTask(index);
  });
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteTask(index);
  });
  todoTitle.appendChild(checkbox);
  todoTitle.appendChild(span);
  todoTitle.appendChild(buttonsDiv);

  return todoTitle;
}

function createEditButton(index) {
  const button = document.createElement('button');
  button.textContent = 'Edit';
  button.addEventListener('click', () => {
    editTask(index);
  });

  return button;
}

function createDeleteButton(index) {
  const button = document.createElement('button');
  button.textContent = 'Delete';
  button.addEventListener('click', () => {
    deleteTask(index);
  });

  return button;
}

function completeTask(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function editTask(index) {
  todos[index].editing = true;
  saveTodos();
  renderTodos();
}

function deleteTask(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    darkModeToggle.textContent = 'Dark Mode';
    localStorage.setItem('darkMode', false);
  } else {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = 'Light Mode';
    localStorage.setItem('darkMode', true);
  }
}
initialize();