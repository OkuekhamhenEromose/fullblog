
# after installing djangorestframework and adding it in installed app of settings
from rest_framework import serializers
from . models import Profile
from django.contrib.auth.models import User

from . utils import SendMail


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email']#this is added to the fields created

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSerializer()
        fields = ['gender','profile_pix','fullname','phone']

class RegistrationSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Full name is required',
            'blank': 'Full name cannot be blank'
        }
    )
    phone = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Phone number is required',
            'blank': 'Phone number cannot be blank'
        }
    )
    gender = serializers.ChoiceField(
        choices=[('M', 'Male'), ('F', 'Female')],
        write_only=True,
        required=True,
        error_messages={
            'required': 'Gender is required',
            'invalid_choice': 'Gender must be either M or F'
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
        error_messages={
            'required': 'Password is required',
            'min_length': 'Password must be at least 8 characters'
        }
    )
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required',
            'invalid': 'Enter a valid email address'
        }
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'fullname', 'phone', 'gender']
        extra_kwargs = {
            'username': {
                'required': True,
                'error_messages': {
                    'required': 'Username is required'
                }
            }
        }

    # ... rest of the serializer remains the same ...

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value.lower()  # Normalize email

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        Profile.objects.create(
            user=user,
            fullname=validated_data['fullname'],
            phone=validated_data['phone'],
            gender=validated_data['gender']
        )
        return user
    
class UpdateProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = Profile
        fields = ['fullname', 'username', 'email', 'gender', 'phone', 'profile_pix']
        extra_kwargs = {
            'fullname': {'required': False},
            'gender': {'required': False},
            'phone': {'required': False},
            'profile_pix': {'required': False}
        }

    def validate(self, data):
        user_data = data.get('user', {})
        
        # Check username uniqueness if being updated
        if 'username' in user_data:
            if User.objects.exclude(pk=self.instance.user.pk).filter(username=user_data['username']).exists():
                raise serializers.ValidationError({'username': 'This username is already taken'})
        
        # Check email uniqueness if being updated
        if 'email' in user_data:
            if User.objects.exclude(pk=self.instance.user.pk).filter(email=user_data['email']).exists():
                raise serializers.ValidationError({'email': 'This email is already in use'})
        
        return data

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        # Update user fields
        user = instance.user
        if user_data:
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance