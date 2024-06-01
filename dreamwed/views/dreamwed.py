from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.db.models import F

from main.decorators import unauthenticated_user
from main.settings import LOGIN_URL, HOME
from dreamwed.forms import UserAccountInfoUpdateForm, VendorImageUploadForm
from dreamwed.models import VendorImageUpload, Todo, BudgetItem, Guest


def home(request):
   if not request.user.is_authenticated:
      return render(request, 'dreamwed/home.html')

   if request.user.is_vendor:
      return redirect('user-profile')
   else:
      return redirect('checklist-all')


@login_required
def user_profile(request):
   curr_user = request.user

   if curr_user.is_vendor:
      img_form = VendorImageUploadForm()
      images = VendorImageUpload.objects.filter(vendor_id=curr_user.id)
      context = {
         'img_form': img_form,
         'images': images,
      }
      return render(request, 'vendor/profile.html', context)

   elif curr_user.is_wedding_planner:
      all_todos = Todo.objects.filter(wedplanner_id=curr_user.id).count()
      completed_todos = Todo.objects.filter(wedplanner_id=curr_user.id, completed=True).count()
      in_progress_todos = Todo.objects.filter(wedplanner_id=curr_user.id, completed=False).count()

      budget_items = BudgetItem.objects.filter(wedplanner_id=curr_user.id).count()
      budget_items_fully_paid = BudgetItem.objects.filter(wedplanner_id=curr_user.id, cost=F('paid')).count()
      budget_items_partially_paid = BudgetItem.objects.filter(
         wedplanner_id=curr_user.id, 
         cost__gt=F('paid'),
         paid__gt=0).count()
      
      budget_items_not_paid = BudgetItem.objects.filter(wedplanner_id=curr_user.id, paid=0).count()
      budget_items_not_paid += BudgetItem.objects.filter(wedplanner_id=curr_user.id, paid=None).count()
      # don't know why "paid__in=[0, None]" does NOT work

      all_guests = Guest.objects.filter(wedplanner_id=curr_user.id).count()
      guests_pending = Guest.objects.filter(wedplanner_id=curr_user.id, rsvp='Pending').count()
      guests_attending = Guest.objects.filter(wedplanner_id=curr_user.id, rsvp='Attending').count()
      guests_declined = Guest.objects.filter(wedplanner_id=curr_user.id, rsvp='Declined').count()

      context = {
         'all_todos': all_todos,
         'completed_todos': completed_todos,
         'in_progress_todos': in_progress_todos,

         'budget_items': budget_items,
         'budget_items_fully_paid': budget_items_fully_paid,
         'budget_items_partially_paid': budget_items_partially_paid,
         'budget_items_not_paid': budget_items_not_paid,

         'all_guests': all_guests,
         'guests_pending': guests_pending,
         'guests_attending': guests_attending,
         'guests_declined': guests_declined,
      }
      return render(request, 'wedplanner/profile.html', context)


@login_required
def update_user_account_info(request):
   if not request.method == 'POST':
      form = UserAccountInfoUpdateForm(instance=request.user) 
      return render(request, 'dreamwed/update-account-info.html', {'form': form})

   form = UserAccountInfoUpdateForm(request.POST, request.FILES, instance=request.user)
   if not form.is_valid():
      messages.error(request, 'Please correct the errors below!')
      return redirect(request.META.get('HTTP_REFERER'))

   form.save()
   messages.success(request, 'User account info updated!')
   return redirect('user-profile')


@unauthenticated_user
def register(request):
   return render(request, 'dreamwed/register.html')


@unauthenticated_user
def user_login(request):
   if not request.method == 'POST':
      login_form = AuthenticationForm()
      return render(request, 'dreamwed/login.html', context={'form': login_form})

   form = AuthenticationForm(data=request.POST)
   if not form.is_valid():
      messages.error(request, form.errors) 
      return redirect(LOGIN_URL)

   username = form.cleaned_data['username']
   password = form.cleaned_data['password']
   user = authenticate(username=username, password=password)
   if user is None:
      messages.error(request, 'Invalid username or password!')
      return redirect(LOGIN_URL)

   login(request, user)
   messages.success(request, 'Successfully logged in!')
   return redirect(HOME)


@login_required
def user_logout(request):
   logout(request)
   messages.success(request, 'Successfully logged out!')
   return redirect(HOME)


def get_csrf(request):
   return JsonResponse({'csrf_token': get_token(request)}, status=200)