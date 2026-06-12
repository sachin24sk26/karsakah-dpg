from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Crop, Order, Payment, Review

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'location', 'role', 'farm_size', 'crop_type_grown', 'is_verified')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'phone', 'location', 'role', 'farm_size', 'crop_type_grown')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            location=validated_data.get('location', ''),
            role=validated_data.get('role', 'buyer'),
            farm_size=validated_data.get('farm_size', ''),
            crop_type_grown=validated_data.get('crop_type_grown', '')
        )
        return user

class CropSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.username')
    farmer_location = serializers.ReadOnlyField(source='farmer.location')

    class Meta:
        model = Crop
        fields = '__all__'
        read_only_fields = ('farmer', 'created_at')

class OrderSerializer(serializers.ModelSerializer):
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')
    buyer_name = serializers.ReadOnlyField(source='buyer.username')
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('buyer', 'total_price', 'order_status', 'order_date')

class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.ReadOnlyField(source='buyer.username')

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('buyer', 'created_at')

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('timestamp',)
