// TODOS PAGE

const tasksTableBody = document.querySelector('#todosTable tbody');
const dateFilterSelect = document.getElementById('filter-due-date');
const categoryFilterSelect = document.querySelector('select.filter-category');
let activeNavItem;


window.addEventListener('DOMContentLoaded', () => {
   activeNavItem = document.querySelector('.nav-item-active');
   const dateFilter = getDateFilter();

   // Populate Date Filter Options
   for (let key in dateFilter) {
      let dateFilterOption = document.createElement('option');
      dateFilterOption.value = key;
      dateFilterOption.innerHTML = camelCaseToNormalText(key);
      dateFilterSelect.appendChild(dateFilterOption);
   }
   getAllTasks();
   activateNavItems();
});


// JQuery Filter For Todos
$(document).ready(function () {
   $('.filter-todos').on('change', function () {
      let categoryFilter = $('.filter-category').children("option:selected").text().toLowerCase();
      let dateFilter = $('.filter-date').children("option:selected").val();
      let noFilter = '---------';

      $('.checklist-item').each(function () {
         let todoCategory = $(this).find('.task-label').text().toLowerCase();
         let todoDueDate = $(this).find('.todo-due-date').text(); // dd/mm/yyyy

         let dateValues = todoDueDate.split('/');
         let dd = Number(dateValues[0]);
         let mm = Number(dateValues[1] - 1);
         let yyyy = Number(dateValues[2]);

         let jsDate = new Date(yyyy, mm, dd);
         jsDate.setHours(0, 0, 0, 0);

         // Show/Hide Todos
         if (categoryFilter == noFilter && dateFilter == noFilter) {
            $(this).show();
         } else if (categoryFilter == noFilter || dateFilter == noFilter) {
            $(this).toggle((todoCategory.includes(categoryFilter) || passesDateFilter(dateFilter, jsDate)));
         } else {
            $(this).toggle((todoCategory.includes(categoryFilter) && passesDateFilter(dateFilter, jsDate)));
         }
      });
   });
});


// Todo Status Check/Uncheck
function handleTodoStatus() {
   document.querySelectorAll('.change_task_complete').forEach(checkbox => {
      if (checkbox.value == 'false') {
         checkbox.checked = false;
      } else if (checkbox.value == 'true') {
         checkbox.checked = true;
      } else {
         console.error('Task status not set!');
      }
   });
}


// empty todo filters when navigating all/completed/in-progress tasks
async function emptyFilters() {
   categoryFilterSelect.value = '';
   dateFilterSelect.value = '';
}


// fills update task form with selected task values
async function fillTaskSavedValues(jsonTask) {
   let task = JSON.parse(jsonTask);
   const updateForm = document.getElementById('updateTaskForm');

   updateForm.querySelector('#id_content').value = task.content;
   updateForm.querySelector('#id_category').value = validateOutput(task.vendor_category_id);
   updateForm.querySelector('#id_due_date').value = task.due_date;
   updateForm.setAttribute('data-task-id', task.todo_id);
}


// TASK CRUD OPERATIONS
// retrieve tasks 
function renderTodos(tasks) {
   tasksTableBody.innerHTML = '';

   tasks.forEach(todo => {
      let jsonTodo = JSON.stringify(todo);
      let tableRow = `
      <tr class="checklist-item">
         <td>
            <input type="checkbox" name="todo-${todo.todo_id}-status" value="${todo.completed}" class="form-check-input change_task_complete" onchange="changeTaskStatus(${todo.todo_id})">
         </td>
         <td class="pointer" title="Click to update this task." data-bs-toggle="modal" data-bs-target="#updateTask" onclick='fillTaskSavedValues(\`${jsonTodo}\`)'>
            <div class="task">${todo.content}</div>
            <span class="task-label">${validateOutput(todo.vendor_category_name)}</span>
         </td>
         <td style="text-transform: capitalize;">
            <span class="todo-due-date">${formatDate(todo.due_date)}</span>
         </td>
         <td class="text-end">
            <a class="pointer fs-5" onclick="deleteTask(${todo.todo_id})"><i class="fas fa-trash-alt"></i></a>
         </td>
      </tr>
      `;
      tasksTableBody.innerHTML += tableRow;
   });
}

async function getAllTasks() {
   let url = `${LOCALHOST}/U/checklist/`;
   fetchRequest(fetchTasksHelper, url, 'GET');
}

async function getCompletedTasks() {
   let url = `${LOCALHOST}/U/checklist/completed/`;
   fetchRequest(fetchTasksHelper, url, 'GET');
}

async function getTasksInProgress() {
   let url = `${LOCALHOST}/U/checklist/in-progress/`;
   fetchRequest(fetchTasksHelper, url, 'GET');
}

async function fetchTasksHelper(response) {
   let tasks = await response.json();
   renderTodos(tasks);
   emptyFilters();
   handleTodoStatus();
}


// create task
async function createTask(event) {
   event.preventDefault();

   let createTaskForm = event.target;
   let formData = new FormData(createTaskForm);
   let url = `${LOCALHOST}/U/create-task/`;
   createUpdateTaskHelper(url, formData);
}


// update task
async function updateTask(event) {
   event.preventDefault();

   let updateTaskForm = event.target;
   let taskId = updateTaskForm.getAttribute('data-task-id');
   let formData = new FormData(updateTaskForm);
   let url = `${LOCALHOST}/U/checklist/${taskId}/update`;
   createUpdateTaskHelper(url, formData);
}

async function createUpdateTaskHelper(url, formData) {
   let taskContent = formData.get('content');
   let taskCategory = formData.get('category');
   let taskDueDate = formData.get('due_date');

   let todo = {
      content: taskContent,
      category: taskCategory,
      due_date: taskDueDate,
   };

   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         emptyFilters();
         getAllTasks();
         showNotification(msg);
      });
   }
   fetchRequest(handleResponse, url, 'POST', JSON.stringify(todo));
}


// delete task 
async function deleteTask(taskId) {
   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         getAllTasks();
         showNotification(msg);
      });
   }
   let url = `${LOCALHOST}/U/checklist/${taskId}/delete`;
   fetchRequest(handleResponse, url, 'DELETE');
}


// change task status
async function changeTaskStatus(taskId) {
   let handleResponse = async function (response) {
      await response.json()
      .then(res => {
         console.log(res.msg);
         getAllTasks();
      });
   }
   let url = `${LOCALHOST}/U/checklist/${taskId}/mark-complete`;
   fetchRequest(handleResponse, url, 'GET');
}