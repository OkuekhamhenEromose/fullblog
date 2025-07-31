from rest_framework import serializers
from .models import Post, Category, Comment, Bookmark, Notification
from user.models import Profile

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'post': {'required': False},
            'name': {'required': False},
            'email': {'required': False}
        }

    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 2

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.title', read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'image', 'description', 'tags', 'category', 
            'category_name', 'status', 'view', 'likes', 'likes_count',
            'slug', 'date', 'user', 'profile', 'comments', 'is_owner'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'profile': {'read_only': True},
            'slug': {'read_only': True},
            'view': {'read_only': True}
        }

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.user.user == request.user
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()

    def validate_category(self, value):
        if isinstance(value, int):
            try:
                return Category.objects.get(pk=value)
            except Category.DoesNotExist:
                raise serializers.ValidationError("Category does not exist")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user.profile
        validated_data['profile'] = self.context['request'].user.profile
        return super().create(validated_data)