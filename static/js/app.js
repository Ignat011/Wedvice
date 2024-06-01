// GENERAL FUNCTIONS & VARIABLES/CONSTANTS


const LOCALHOST = 'http://127.0.0.1:8000';


// fetch request helper function
async function fetchRequest(callback, url, method, data) {
   let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
   });

   if (method !== 'GET') {
      headers.set('X-CSRFToken', await getCsrfToken());
   }

   try {
      let response = await fetch(url, {
         method: method,
         headers: headers,
         body: data
      });

      callback(response);

   } catch (error) {
      console.error(error);
   }
}


// custom date filter
function getDateFilter() {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const todayWeekDay = (today.getDay() + 6) % 7; // Monday=0, Tuesday=1, ..., Sunday=6

   let thisMonthStart = new Date(today);
   thisMonthStart.setDate(1);

   let thisWeekStart = new Date(today);
   thisWeekStart.setDate(today.getDate() - todayWeekDay);
   let thisWeekEnd = new Date(thisWeekStart);
   thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

   let lastWeekEnd = new Date(thisWeekStart);
   lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
   let lastWeekStart = new Date(thisWeekStart);
   lastWeekStart.setDate(thisWeekStart.getDate() - 7);

   let twoWeeksAgoEnd = new Date(lastWeekStart);
   twoWeeksAgoEnd.setDate(lastWeekStart.getDate() - 1);
   let twoWeeksAgoStart = new Date(lastWeekStart);
   twoWeeksAgoStart.setDate(lastWeekStart.getDate() - 7);

   let lastMonthEnd = new Date(thisMonthStart);
   lastMonthEnd.setDate(thisMonthStart.getDate() - 1);
   let lastMonthStart = new Date(lastMonthEnd);
   lastMonthStart.setDate(1);

   const dateFilter = {
      today: {
         start: today,
         end: today,
      },
      thisWeek: {
         start: thisWeekStart,
         end: thisWeekEnd,
      },
      lastWeek: {
         start: lastWeekStart,
         end: lastWeekEnd,
      },
      twoWeeksAgo: {
         start: twoWeeksAgoStart,
         end: twoWeeksAgoEnd,
      },
      oneMonthAgo: {
         start: lastMonthStart,
         end: lastMonthEnd,
      },
   };

   return dateFilter;
}


// condition for any date input to pass the date filter
function passesDateFilter(filterOption, date) {
   const dateFilter = getDateFilter();

   if (!dateFilter.hasOwnProperty(filterOption)) { return true; }
   return date >= dateFilter[filterOption].start && date <= dateFilter[filterOption].end;
}


// format date to: dd/mm/yyyy
function formatDate(dateStr) {
   if (dateStr == null) return '';

   let date = new Date(dateStr);
   let dd = String(date.getDate()).padStart(2, '0');
   let mm = String(date.getMonth() + 1).padStart(2, '0');
   let yyyy = date.getFullYear();

   let formattedDate = `${dd}/${mm}/${yyyy}`;
   return formattedDate;
}


// camel case variable name to normal text
function camelCaseToNormalText(ccText) {
   const result = ccText.replace(/([A-Z])/g, " $1").toLowerCase();
   return result.charAt(0).toUpperCase() + result.slice(1); // capitalize first letter
}


// dont print variable value if it's Null
function validateOutput(variable) {
   return variable ? variable : '';
}


// get csrf token
async function getCsrfToken() {
   url = `${LOCALHOST}/csrf-token/`;
   const res = await fetch(url);
   const response = await res.json();
   const csrfToken = response.csrf_token;
   return csrfToken;
}


// async messages
function showNotification(message) {
   let message_tag;
   let message_content;

   if (message.tag) {
      message_tag = message.tag;
      message_content = message.content;
   } else {
      message_tag = 'alert-danger';
      message_content = message;
   }

   let output = `
   <div class="${message_tag}">
      <div class="container">
         <div class="alert ${message_tag} alert-dismissible fade show border-0 px-0 m-0" role="alert">
            ${message_content}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
         </div>
      </div>
   </div>
   `;
   document.getElementById('notification').innerHTML = output;
}


// Event Listener to activate sidebar nav
function activateNavItems() {
   document.querySelectorAll('.nav-item').forEach((navItem) => {
      navItem.addEventListener('click', function () {
         if (activeNavItem != this) {
            activeNavItem.classList.remove('nav-item-active');
            this.classList.add('nav-item-active');
            activeNavItem = this;
         }
      });
   });
}