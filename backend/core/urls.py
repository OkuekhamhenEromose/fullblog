from django.urls import path, include
from . import views

urlpatterns = [
    # Category URLs
    path('auth/', include('user.urls')),
    path('categories/', views.CategoryView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    # Post URLs
    path('posts/', views.PostView.as_view(), name='post-list'),
    path('posts/create/', views.PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/', views.PostEditView.as_view(), name='post-detail'),
    path('posts/category/<int:category_id>/', views.PostsByCategoryView.as_view(), name='posts-by-category'),

    # Comment URLs
    path('posts/<int:post_id>/comments/', views.CommentView.as_view(), name='comment-list'),

    # Like URLs
    path('posts/<int:post_id>/like/', views.LikePostView.as_view(), name='like-post'),
]