
# from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from . serializers import UserSerializer,RegistrationSerializer,UpdateProfileSerializer
from . models import Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

class RegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        
        # Return detailed error messages
        return Response({
            'errors': serializer.errors,
            'message': 'Registration failed'
        }, status=status.HTTP_400_BAD_REQUEST)

# class RegistrationView(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         serializer = RegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
            
#             # Create token for the new user
#             token, created = Token.objects.get_or_create(user=user)
            
#             # Return the token along with user data
#             return Response({
#                 'token': token.key,
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email
#                 }
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
# Logout
class LogoutView(APIView):
    def post(self,request):
        try:
            logout(request)
            return Response({"Message":"Logout Successful!"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

# dashboard
@permission_classes([IsAuthenticated])
class DashboardView(APIView):
    def get(self,request):
        try:
            user = request.user.profile
            return Response({"Message": "welcome" +" "+ user.fullname})
        except Exception as e:
            return Response({'error':str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

# update
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            profile = request.user.profile
            serializer = UpdateProfileSerializer(profile)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    def put(self,request):
        try:
            profile = request.user.profile
            serializer = UpdateProfileSerializer(profile,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error':str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
