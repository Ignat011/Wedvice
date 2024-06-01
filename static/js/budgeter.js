// BUDGET MANAGER PAGE

const budgetItemsTableBody = document.querySelector('#BudgetItemsTable tbody');
let activeNavItem;


window.addEventListener('DOMContentLoaded', () => {
   activeNavItem = document.querySelector('.nav-item-active');
   getAllbudgetItems();
   renderWeddingBudgetBalanceBar();
   activateNavItems();
});


async function getAllbudgetItems() {
   let handleResponse = async function (response) {
      let budgetItems = await response.json();
      renderGuests(budgetItems);
   }
   url = `${LOCALHOST}/U/budget-manager/`;
   fetchRequest(handleResponse, url, 'GET');
}


async function getExpensesInCategory(category_id) {
   let handleResponse = async function (response) {
      let budgetItems = await response.json();
      renderGuests(budgetItems);
   }
   url = `${LOCALHOST}/U/budget-manager/expenses-in-category/${category_id}`;
   fetchRequest(handleResponse, url, 'GET');
}


function renderGuests(budgetItems) {
   budgetItemsTableBody.innerHTML = '';

   budgetItems.forEach(budgetItem => {
      let jsonBudgetItem = JSON.stringify(budgetItem);
      let tableRow = `
         <tr class="budget-item">
            <td class="pointer" title="Click to update this budget item." data-bs-toggle="modal" data-bs-target="#updateExpense" onclick='fillBudgetItemSavedValues(\`${jsonBudgetItem}\`)'>
               <div class="expense-description">${budgetItem.description}</div>
            </td>
            <td class="expense-cost"><div>RUB ${budgetItem.cost}</div></td>
            <td class="expense-paid"><div>RUB ${budgetItem.paid ? budgetItem.paid : 0}</div></td>
            <td class="text-end">
               <a class="pointer fs-5" onclick="deleteBudgetItem(${budgetItem.id})" title="Delete this budget item">
                  <i class="fas fa-trash-alt"></i>
               </a>
            </td>
         </tr>
         `;
      budgetItemsTableBody.innerHTML += tableRow;
   });
}


// fills update form with selected budget item values
async function fillBudgetItemSavedValues(jsonBudgetItem) {
   let budgetItem = JSON.parse(jsonBudgetItem);
   let updateForm = document.forms.updateBudgetItemForm;

   updateForm.querySelector('#id_description').value = budgetItem.description;
   updateForm.querySelector('#id_expense_category').value = validateOutput(budgetItem.expense_category_id);
   updateForm.querySelector('#id_cost').value = budgetItem.cost;
   updateForm.querySelector('#id_paid').value = budgetItem.paid;
   updateForm.setAttribute('data-budget-item-id', budgetItem.id)
}


async function createBudgetItem(event) {
   event.preventDefault();

   let createBudgetItemForm = event.target;
   let formData = new FormData(createBudgetItemForm);
   let url = `${LOCALHOST}/U/budget-manager/create-budget-item`;
   createUpdateBudgetItemHelper(url, formData);
}


// update budget item
async function updateBudgetItem(event) {
   event.preventDefault();

   let updateBudgetItemForm = event.target;
   let formData = new FormData(updateBudgetItemForm);
   let budgetItemId = updateBudgetItemForm.getAttribute('data-budget-item-id');
   let url = `${LOCALHOST}/U/budget-manager/${budgetItemId}/update`;
   createUpdateBudgetItemHelper(url, formData);
}


async function createUpdateBudgetItemHelper(url, formData) {
   let budgetItemContent = formData.get('description');
   let budgetItemExpenseCategory = formData.get('expense_category');
   let budgetItemCost = formData.get('cost');
   let budgetItemPaid = formData.get('paid');

   let budgetItem = {
      description: budgetItemContent,
      expense_category: budgetItemExpenseCategory,
      cost: budgetItemCost ? budgetItemCost : 0,
      paid: budgetItemPaid ? budgetItemPaid : 0,
   };

   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         console.log(msg)
         getAllbudgetItems();
         renderWeddingBudgetBalanceBar();
         showNotification(msg);
      });
   }
   fetchRequest(handleResponse, url, 'POST', JSON.stringify(budgetItem));
}


// delete budget item 
async function deleteBudgetItem(budgetItemId) {
   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         console.log(msg)
         showNotification(msg);
         getAllbudgetItems();
         renderWeddingBudgetBalanceBar();
      });
   }
   let url = `${LOCALHOST}/U/budget-manager/${budgetItemId}/delete`;
   fetchRequest(handleResponse, url, 'DELETE');
}


// set wedding budget
async function setWeddingBudget(event) {
   event.preventDefault();

   let weddingBudgetForm = event.target;
   let formData = new FormData(weddingBudgetForm);
   let weddingBudgetData = formData.get('wedding_budget');
   let weddingBudget = {
      wedding_budget: weddingBudgetData,
   };

   let handleResponse = async function (response) {
      await response.json()
      .then(res => {
         document.getElementById('wedding-budget').innerHTML = res.budget;
         renderWeddingBudgetBalanceBar();
         showNotification(res.msg);
      });
   }
   let url = `${LOCALHOST}/U/budget-manager/set-wedding-budget`;
   fetchRequest(handleResponse, url, 'POST', JSON.stringify(weddingBudget));
}


async function renderWeddingBudgetBalanceBar() {
   let handleResponse = async function (response) {
      await response.json()
      .then(res => {
         let wedding_budget = res.wedding_budget;
         let total_paid = res.total_paid;
         let spent_percent = 100 * (total_paid / wedding_budget);
         spent_percent = spent_percent.toFixed(1);

         document.getElementById('money-spent').innerHTML = `
         <div class="mb-1">Всего потраченно: <b>RUB ${total_paid}</b></div>
         <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${spent_percent}%" aria-valuenow="${spent_percent}" aria-valuemin="0" aria-valuemax="100">${spent_percent}%</div>
         </div>
         `;
      });
   }
   let url = `${LOCALHOST}/U/budget-manager/my-balance`;
   fetchRequest(handleResponse, url, 'GET');
}


function passesCostFilter(filter, cost, paid) {
   const fully_paid = 'full';
   const partially_paid = 'partial';
   const not_paid = 'no';

   switch (filter) {
      case not_paid:
         return paid == 0;
      case fully_paid:
         return cost == paid;
      case partially_paid:
         return cost > paid && paid > 0;
      default:
         return true;
   }
}


// JQuery Filter For budget items
$(document).ready(function () {
   $('#rsvp-filter').on('change', function () {
      let costFilter = $(this).children("option:selected").val();

      $('tr.budget-item').each(function () {
         let cost = $(this).find('.expense-cost').text();
         let paid = $(this).find('.expense-paid').text();

         cost = Number(cost.slice(3));
         paid = Number(paid.slice(3));

         // Show/Hide budget items
         $(this).toggle(passesCostFilter(costFilter, cost, paid));
      });
   });
});