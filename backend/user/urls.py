from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegistrationView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),
    path('auth/dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('auth/profile/', views.UpdateProfileView.as_view(), name='update')
]