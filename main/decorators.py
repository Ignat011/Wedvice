from django.http.response import HttpResponse


def unauthenticated_user(view_func):
   def wrapper_func(request, *args, **kwargs):
      if request.user.is_authenticated:
         # popup
         error_msg = 'You are already logged in!'
         return HttpResponse(error_msg)
      else:
         return view_func(request, *args, **kwargs)
      
   return wrapper_func


def wedding_vendor_required(view_func):
   def wrapper_func(request, *args, **kwargs):
      if request.user.is_vendor:
         return view_func(request, *args, **kwargs)
      else:
         # popup
         error_msg = 'Unauthorised action. You must be a vendor to access this page!'
         return HttpResponse(error_msg)

   return wrapper_func


def wedding_planner_required(view_func):
   def wrapper_func(request, *args, **kwargs):
      if request.user.is_wedding_planner:
         return view_func(request, *args, **kwargs) 
      else:
         # popup
         error_msg = 'Unauthorised action. You must be a wedding planner to access this page!'
         return HttpResponse(error_msg)

   return wrapper_func
