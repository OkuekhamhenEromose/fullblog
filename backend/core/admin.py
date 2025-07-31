from django.contrib import admin
from .models import (Category, Post, Comment, Bookmark, Notification)

# Register models with custom admin classes if needed
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    search_fields = ('title', 'category')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'status', 'date')
    list_filter = ('status', 'category')
    search_fields = ('title', 'user__username')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'name', 'email', 'date')
    search_fields = ('post__title', 'name', 'email')

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'date')
    search_fields = ('user__username', 'post__title')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'type', 'seen', 'date')
    list_filter = ('type', 'seen')
    search_fields = ('user__username', 'post__title')