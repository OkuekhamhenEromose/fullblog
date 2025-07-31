from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics

from django.shortcuts import reverse
from django.db import transaction
from django.shortcuts import get_object_or_404,Http404
from django.conf import settings

import requests
from .serializers import *
from .models import *

import logging
logger = logging.getLogger(__name__)

# Create your views here.

class CategoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching categories: {str(e)}")
            return Response(
                {'error': 'Failed to fetch categories'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Category creation error: {str(e)}")
            return Response(
                {'error': 'Failed to create category'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CategoryDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    def get(self, request, pk):
        try:
            category = self.get_object(pk)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching category: {str(e)}")
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        try:
            category = self.get_object(pk)
            serializer = CategorySerializer(category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Category update error: {str(e)}")
            return Response(
                {'error': 'Failed to update category'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            category = self.get_object(pk)
            category.delete()
            return Response(
                {"message": "Category deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            logger.error(f"Category deletion error: {str(e)}")
            return Response(
                {'error': 'Failed to delete category'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class CategoryEditView(APIView):
    def get(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    permission_classes = [AllowAny]
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
    
    permission_classes = [AllowAny]
    def delete(self, request, pk):
        try:
            category = get_object_or_404(Category, pk=pk)
            category.delete()
            return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        try:
            posts = Post.objects.all()
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching posts: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        logger.info(f"Received POST data: {request.data}")
        try:
            # Ensure user has a profile
            if not hasattr(request.user, 'profile'):
                return Response(
                    {'error': 'User profile not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Add user and profile to request data
            request.data['user'] = request.user.profile.id
            request.data['profile'] = request.user.profile.id
            
            serializer = PostSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                instance = serializer.save()
                logger.info(f"Post created successfully: {instance.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            logger.warning(f"Validation errors: {serializer.errors}")
            return Response({
                'status': 'error',
                'errors': serializer.errors,
                'message': 'Validation failed',
                'received_data': request.data
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Post creation error: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Internal server error',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            if not hasattr(request.user, 'profile'):
                return Response(
                    {'error': 'User profile not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            request.data['user'] = request.user.profile.id
            request.data['profile'] = request.user.profile.id
            
            serializer = PostSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Post creation error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PostEditView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        try:
            post = self.get_object(pk)
            serializer = PostSerializer(post, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching post: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        try:
            post = self.get_object(pk)
            
            # Check ownership - using user.user comparison since profile.user is the actual User
            if post.user.user != request.user:
                return Response(
                    {'error': 'You do not have permission to edit this post'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = PostSerializer(
                post, 
                data=request.data, 
                partial=True, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Post update error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            post = self.get_object(pk)
            
            # Check ownership
            if post.user.user != request.user:
                return Response(
                    {'error': 'You do not have permission to delete this post'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            post.delete()
            return Response(
                {"message": "Post deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            logger.error(f"Post deletion error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PostsByCategoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, category_id):
        try:
            # Get the category or return 404
            category = get_object_or_404(Category, pk=category_id)
            
            # Get all posts for this category
            posts = Post.objects.filter(category=category)
            
            # Serialize the data
            post_serializer = PostSerializer(posts, many=True, context={'request': request})
            category_serializer = CategorySerializer(category)
            
            return Response({
                'category': category_serializer.data,
                'posts': post_serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching posts by category: {str(e)}")
            return Response(
                {'error': 'Failed to fetch posts by category'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CommentView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get(self, request, post_id):
        try:
            comments = Comment.objects.filter(post__id=post_id)
            serializer = CommentSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching comments: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, post_id):
        try:
            post = get_object_or_404(Post, pk=post_id)
            data = request.data.copy()
            data['post'] = post.id
            
            # Use the authenticated user's information
            if request.user.is_authenticated:
                data['name'] = request.user.get_full_name() or request.user.username
                data['email'] = request.user.email
            
            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                comment = serializer.save()
                
                # Create notification if not the post owner
                if post.user.user != request.user:
                    Notification.objects.create(
                        user=post.user,
                        post=post,
                        type="Comment",
                        seen=False
                    )
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Comment creation error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            post = get_object_or_404(Post, pk=post_id)
            profile = request.user.profile
            
            if profile in post.likes.all():
                post.likes.remove(profile)
                message = "Post unliked"
                status_code = status.HTTP_200_OK
            else:
                post.likes.add(profile)
                message = "Post liked"
                status_code = status.HTTP_201_CREATED
                
                # Create notification if not the post owner
                if post.user.user != request.user:
                    Notification.objects.create(
                        user=post.user,
                        post=post,
                        type="Like",
                        seen=False
                    )
            
            return Response(
                {
                    "message": message, 
                    "likes_count": post.likes.count(),
                    "is_liked": profile in post.likes.all()
                }, 
                status=status_code
            )
            
        except Exception as e:
            logger.error(f"Like post error: {str(e)}")
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )