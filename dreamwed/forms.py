from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction

import datetime as DT

from dreamwed.models import User, Vendor, WeddingPlanner, Guest, Todo, BudgetItem, Review, VendorCategory, VendorImageUpload


def vendor_categories():
   return VendorCategory.objects.all().values_list('id', 'name')
    

class VendorRegForm(UserCreationForm):
   """vendor registration form"""
   first_name = forms.CharField(required=True)  
   last_name = forms.CharField(required=True)
   email = forms.EmailField(required=True)

   business_name = forms.CharField(required=True)
   category = forms.ChoiceField(
      required=True, 
      choices=vendor_categories(),
      )
   description = forms.CharField(
      required=True,
      widget=forms.Textarea(attrs={
         'rows': 5, 
         'cols': 30,
         }))
   services_offered = forms.CharField(
      required=True,
      widget=forms.Textarea(attrs={
         'rows': 5, 
         'cols': 30,
         }))
   city = forms.CharField(required=True)
   location = forms.CharField(required=True) # street code

   class Meta(UserCreationForm.Meta):
      model = User

   @transaction.atomic
   def save(self):
      user = super().save(commit=False)
      user.is_vendor = True
      user.first_name = self.cleaned_data['first_name']
      user.last_name = self.cleaned_data['last_name']
      user.email = self.cleaned_data['email']
      user.save()

      vendor = Vendor.objects.create(user=user)
      vendor.business_name = self.cleaned_data['business_name']
      vendor.category_id = self.cleaned_data['category']
      vendor.description = self.cleaned_data['description']
      vendor.services_offered = self.cleaned_data['services_offered']
      vendor.city = self.cleaned_data['city']
      vendor.location = self.cleaned_data['location']
      vendor.save()
      return user


class WeddingPlannerRegForm(UserCreationForm):
   """wedding planner registration form"""
   first_name = forms.CharField(required=True)  
   last_name = forms.CharField(required=True)
   email = forms.EmailField(required=True)
   wedding_date = forms.DateField(
      required=False, 
      widget=forms.DateInput(attrs={
         'type': 'date', 
         'min': DT.date.today(),
         }),
      )

   class Meta(UserCreationForm.Meta):
      model = User

   @transaction.atomic
   def save(self):
      user = super().save(commit=False)
      user.is_wedding_planner = True
      user.first_name = self.cleaned_data['first_name']
      user.last_name = self.cleaned_data['last_name']
      user.email = self.cleaned_data['email']
      user.save()

      wedding_planner = WeddingPlanner.objects.create(user=user)
      wedding_planner.wedding_date = self.cleaned_data['wedding_date']
      wedding_planner.save()
      return user


class UserAccountInfoUpdateForm(ModelForm):
   class Meta:
      model = User
      fields = ['username', 'first_name', 'last_name', 'email', 'profile']


class BusinessProfileUpdateForm(ModelForm):
   class Meta:
      model = Vendor
      fields = ['business_name', 'category', 'description', 'services_offered', 'city', 'location']


class VendorImageUploadForm(ModelForm):
   class Meta:
      model = VendorImageUpload
      fields = ['image', 'caption']


class WeddingPlannerProfileUpdateForm(ModelForm):
   class Meta:
      model = WeddingPlanner
      fields = ['partner_first_name', 'partner_last_name', 'wedding_date']
      widgets = {
         'wedding_date': forms.DateInput(attrs={
            'type': 'date', 
            'min': DT.date.today(),
            }),
      }


class TodoForm(ModelForm):
   """Create new Todo form"""
   def __init__(self, *args, **kwargs):
      wedding_date = kwargs.pop('wedding_date')
      super(TodoForm, self).__init__(*args, **kwargs)
      self.fields['due_date'] = forms.DateField(
         required=False,
         widget=forms.DateInput(attrs={
            'type': 'date', 
            'min': DT.date.today(),
            'max': wedding_date,
         }))
   
   class Meta:
      model = Todo
      fields = ['content', 'category', 'due_date']


class WeddingBudgetForm(ModelForm):
   """ Set wedding budget form """
   class Meta:
      model = WeddingPlanner
      fields = ['wedding_budget']


class BudgetItemForm(ModelForm):
   """Add new wedding expense form"""
   class Meta:
      model = BudgetItem
      fields = ['description', 'expense_category', 'cost']


class BudgetItemUpdateForm(ModelForm):
   """Add new wedding expense form"""
   class Meta:
      model = BudgetItem
      fields = ['description', 'expense_category', 'cost', 'paid']


class ReviewForm(ModelForm):
   """Rate wedding vendor services form"""
   class Meta:
      model = Review
      fields = ['stars', 'comment']
      widgets = {
         'stars': forms.TextInput(attrs={
            'min': 1, 
            'max': 5, 
            'type': 'number',
            }),
      }


class GuestForm(ModelForm):
   """Add new guest form"""
   class Meta:
      model = Guest
      fields = ['name', 'email', 'phone_number', 'rsvp', 'note']
      widgets = {
         'note': forms.Textarea(attrs={'rows': 5, 'cols': 30})
      }


class UpdateGuestForm(ModelForm):
   """Add new guest form"""
   class Meta:
      model = Guest
      fields = ['name', 'rsvp', 'note']
      widgets = {
         'note': forms.Textarea(attrs={'rows': 5, 'cols': 30})
      }