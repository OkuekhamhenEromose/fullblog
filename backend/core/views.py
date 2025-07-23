from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import reverse
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.conf import settings

import requests
from .serializers import *
from .models import *


# Create your views here.

class CategoryView(APIView):
    def get(self, request):
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [permissions.IsAdminUser]
    def post(self, request):
        try:
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CategoryEditView(APIView):
    def get(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    permission_classes = [permissions.IsAdminUser]
    def put(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            serializer = CategorySerializer(category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    permission_classes = [permissions.IsAdminUser]
    def delete(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            category.delete()
            return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostView(APIView):
    def get(self, request):
        try:
            posts = Post.objects.all()
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = request.data.copy()
            data['user'] = request.user.profile.id
            serializer = PostSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostEditView(APIView):
    def get(self, request, pk):
        try:
            post = get_object_or_404(Post, pk=pk)
            serializer = PostSerializer(post, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            post = get_object_or_404(Post, pk=pk)
            if post.user != request.user.profile and not request.user.is_staff:
                return Response({'error': 'You do not have permission to edit this post'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        try:
            post = get_object_or_404(Post, pk=pk)
            if post.user != request.user.profile and not request.user.is_staff:
                return Response({'error': 'You do not have permission to delete this post'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            post.delete()
            return Response({"message": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentView(APIView):
    def get(self, request, post_id):
        try:
            comments = Comment.objects.filter(post__id=post_id)
            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        try:
            post = get_object_or_404(Post, pk=post_id)
            data = request.data.copy()
            data['post'] = post.id
            data['name'] = request.user.profile.full_name
            data['email'] = request.user.email
            
            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                
                # Create notification
                if post.user != request.user.profile:
                    Notification.objects.create(
                        user=post.user,
                        post=post,
                        type="Comment",
                        seen=False
                    )
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentEditView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
            if comment.email != request.user.email and not request.user.is_staff:
                return Response({'error': 'You do not have permission to edit this comment'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = CommentSerializer(comment, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        try:
            comment = get_object_or_404(Comment, pk=pk)
            if comment.email != request.user.email and not request.user.is_staff:
                return Response({'error': 'You do not have permission to delete this comment'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            comment.delete()
            return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LikePostView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        try:
            post = get_object_or_404(Post, pk=post_id)
            profile = request.user.profile
            
            if profile in post.likes.all():
                post.likes.remove(profile)
                message = "Post unliked"
            else:
                post.likes.add(profile)
                message = "Post liked"
                
                # Create notification if not the post owner
                if post.user != profile:
                    Notification.objects.create(
                        user=post.user,
                        post=post,
                        type="Like",
                        seen=False
                    )
            
            post.save()
            return Response({"message": message, "likes_count": post.likes.count()}, 
                           status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            bookmarks = Bookmark.objects.filter(user=request.user.profile)
            serializer = BookmarkSerializer(bookmarks, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        try:
            post = get_object_or_404(Post, pk=post_id)
            profile = request.user.profile
            
            bookmark, created = Bookmark.objects.get_or_create(
                user=profile,
                post=post
            )
            
            if created:
                # Create notification
                if post.user != profile:
                    Notification.objects.create(
                        user=post.user,
                        post=post,
                        type="Bookmark",
                        seen=False
                    )
                return Response({"message": "Post bookmarked"}, status=status.HTTP_201_CREATED)
            else:
                bookmark.delete()
                return Response({"message": "Bookmark removed"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            notifications = Notification.objects.filter(user=request.user.profile).order_by('-date')
            serializer = NotificationSerializer(notifications, many=True, context={'request': request})
            
            # Mark notifications as seen when fetched
            notifications.update(seen=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationCountView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            count = Notification.objects.filter(user=request.user.profile, seen=False).count()
            return Response({"count": count}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostsByCategoryView(APIView):
    def get(self, request, category_id):
        try:
            category = get_object_or_404(Category, pk=category_id)
            posts = Post.objects.filter(category=category)
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response({
                'category': CategorySerializer(category).data,
                'posts': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)