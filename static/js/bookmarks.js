// VENDORS & BOOKMARKS PAGES

async function renderVendors(vendors) {
   let grid = document.getElementById('vendors-grid');
   grid.innerHTML = '';

   vendors.forEach(vendor => {
      let vendorCard = `
      <div class="col">
         <div class="card h-100">
            <img src="/media/${vendor.profile}" alt="...">
            <div class="card-body">

               <label class="bookmark pointer circle-45 rounded-circle d-flex align-items-center justify-content-center fs-4">
                  <input type="checkbox" data-is-vendor-bookmarked="${vendor.is_vendor_bookmarked}" data-vendor-id="${vendor.vendor_id}" class="bookmark-vendor d-none" onchange="changeBookmarkStatus(this)">
                  <i class="fas fa-heart"></i>
               </label>

               <div class="fs-6"><strong>${vendor.business_name}</strong></div>
               <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>

                  <span class="num">${validateOutput(vendor.avrg_rating)} - </span>
                  <span class="num">${validateOutput(vendor.num_reviews)} reviews</span>
               </div>
               <div class="card-subtitle mb-2 text-muted">${vendor.location}, ${vendor.city}</div>
               <div class="d-flex justify-content-between cta mt-3">
                  <a href="${LOCALHOST}/vendors/${vendor.vendor_id}/details" class="card-link">View more</a>
                  <a href="#" class="card-link">Request pricing</a>
               </div>
            </div>
         </div>
      </div>
      `;
      grid.innerHTML += vendorCard;
   });
}


// change bookmark status controller
async function changeBookmarkStatus(checkbox) {
   let vendorId = Number(checkbox.getAttribute('data-vendor-id'));
   if (checkbox.checked) {
      bookmarkVendor(vendorId);
   } else {
      removeBookmark(vendorId);
   }
}


// new bookmark
async function bookmarkVendor(vendorId) {
   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         console.log(msg);
         renderAllOrBookmarked();
         showNotification(msg);
      });
   }
   url = `${LOCALHOST}/vendors/${vendorId}/bookmark`;
   fetchRequest(handleResponse, url, 'GET');
}


// remove bookmark
async function removeBookmark(vendorId) {
   let handleResponse = async function (response) {
      await response.json()
      .then(msg => {
         console.log(msg);
         renderAllOrBookmarked();
         showNotification(msg);
      });
   }
   url = `${LOCALHOST}/vendors/${vendorId}/remove-bookmark`;
   fetchRequest(handleResponse, url, 'DELETE');
}


// show all or bookmarked vendors
function renderAllOrBookmarked() {
   if (typeof getAllVendors === 'function') {
      getAllVendors();
   } else {
      getSavedVendors();
   }
}


// Vendor Status: bookmarked or not
async function activateBookmarkStatus() {
   document.querySelectorAll('input.bookmark-vendor').forEach(checkbox => {
      let isVendorBookmarked = checkbox.getAttribute('data-is-vendor-bookmarked');

      if (isVendorBookmarked == 'true') {
         checkbox.checked = true;
         checkbox.parentElement.setAttribute('title', 'Undo save vendor');
      } else if (isVendorBookmarked == 'false') {
         checkbox.checked = false;
         checkbox.parentElement.setAttribute('title', 'Save vendor');
      }
   });
}