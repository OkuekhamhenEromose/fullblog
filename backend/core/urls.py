from django.urls import path, include
from . import views

urlpatterns = [
    # Category URLs
    path('api/auth/', include('user.urls')),
    path('core/categories/', views.CategoryView.as_view(), name='category-list'),
    path('core/category/<int:pk>/', views.CategoryEditView.as_view(), name='category-detail'),

    # Post URLs
    path('posts/', views.PostView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostEditView.as_view(), name='post-detail'),
    path('posts/category/<int:category_id>/', views.PostsByCategoryView.as_view(), name='posts-by-category'),

    # Comment URLs
    path('posts/<int:post_id>/comments/', views.CommentView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentEditView.as_view(), name='comment-detail'),

    # Like URLs
    path('posts/<int:post_id>/like/', views.LikePostView.as_view(), name='like-post'),

    # Bookmark URLs
    path('bookmarks/', views.BookmarkView.as_view(), name='bookmark-list'),
    path('posts/<int:post_id>/bookmark/', views.BookmarkView.as_view(), name='bookmark-post'),

    # Notification URLs
    path('notifications/', views.NotificationView.as_view(), name='notification-list'),
    path('notifications/count/', views.NotificationCountView.as_view(), name='notification-count'),
]