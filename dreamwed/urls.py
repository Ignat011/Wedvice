from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from dreamwed.views import dreamwed, wedplanner, vendor
from main.settings import LOGIN_URL, LOGOUT_URL


# GENERAL
urlpatterns = [
   path('', dreamwed.home, name='home'),
   path('U/register/', dreamwed.register, name='register'),
   path('U/register/vendor', vendor.VendorRegView.as_view(), name='vendor-register'),
   path('U/register/wedding-planner', wedplanner.WeddingPlannerRegView.as_view(), name='wedding-planner-register'),
   path('U/login/', dreamwed.user_login, name=LOGIN_URL),
   path('U/logout/', dreamwed.user_logout, name=LOGOUT_URL),
   path('U/profile/', dreamwed.user_profile, name='user-profile'),
   path('U/account-info-update/', dreamwed.update_user_account_info, name='user-account-info-update'),

   path('csrf-token/', dreamwed.get_csrf),
]


# WEDDING PLANNERS
urlpatterns += [
   path('vendors/', wedplanner.vendors, name='vendors'),
   path('vendors/<int:vendor_id>/details', wedplanner.vendor_details, name='vendor-details'),
   path('U/bookmarks/', wedplanner.bookmarks, name='bookmarks'),
   path('vendors/<int:vendor_id>/bookmark', wedplanner.bookmark_vendor, name='bookmark-vendor'),
   path('vendors/<int:vendor_id>/remove-bookmark', wedplanner.delete_bookmarked_vendor, name='remove-bookmark'),

   path('U/checklist/', wedplanner.check_list, name='checklist-all'),
   path('U/checklist/in-progress/', wedplanner.tasks_in_progress, name='checklist-in-progress'),
   path('U/checklist/completed/', wedplanner.tasks_completed, name='checklist-completed'),
   path('U/create-task/', wedplanner.create_task, name='create-task'),
   path('U/checklist/<int:task_id>/delete', wedplanner.delete_task, name='delete-task'),
   path('U/checklist/<int:task_id>/update', wedplanner.update_task, name='update-task'),
   path('U/checklist/<int:task_id>/mark-complete', wedplanner.mark_task_as_complete, name='mark-task-as-complete'),

   path('U/guestlist/', wedplanner.guest_list, name='guestlist'),
   path('U/guestlist/add-guest/', wedplanner.add_guest, name='add-guest'),
   path('U/guestlist/<int:guest_id>/update/', wedplanner.update_guest, name='guest-update'),
   path('U/guestlist/<int:guest_id>/delete/', wedplanner.delete_guest, name='guest-delete'),

   path('U/budget-manager/', wedplanner.budget_manager, name='budget-manager'),
   path('U/budget-manager/my-balance', wedplanner.my_balance),
   path('U/budget-manager/budget-items-share', wedplanner.budget_items_share),
   path('U/budget-manager/set-wedding-budget', wedplanner.set_wedding_budget),
   path('U/budget-manager/create-budget-item', wedplanner.create_budget_item),
   path('U/budget-manager/<int:budget_item_id>/update', wedplanner.update_budget_item),
   path('U/budget-manager/<int:budget_item_id>/delete', wedplanner.delete_budget_item),
   path('U/budget-manager/expenses-in-category/<int:category_id>', wedplanner.get_budget_items_in_category), 

   path('U/wedplanner-profile-update/', wedplanner.update_wedplanner_profile, name='wedplanner-profile-update'),   
   path('U/rate-vendor/<int:vendor_id>/', wedplanner.save_review, name='rate-vendor'),   
   path('U/edit-vendor-review/<int:review_id>/', wedplanner.update_review, name='edit-vendor-review'),   
   path('U/delete-vendor-review/<int:review_id>/', wedplanner.delete_review, name='delete-vendor-review'),

   path('U/my-wedding-team/', wedplanner.my_wedding_team, name='my-wedding-team'),   
]


# VENDORS
urlpatterns += [
   path('U/business-profile-update/', vendor.update_business_profile, name='update-business-profile'),
   path('U/business-profile/upload-picture', vendor.upload_picture, name='upload-new-picture'),
   path('U/business-profile/update-picture/<int:img_id>/', vendor.update_picture, name='update-picture'),
   path('U/business-profile/delete-picture/<int:img_id>/', vendor.delete_picture, name='delete-picture'),
]


# HANDLE MEDIA FILES
if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)