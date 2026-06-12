from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    )
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    farm_size = models.CharField(max_length=100, null=True, blank=True)
    crop_type_grown = models.CharField(max_length=255, null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Crop(models.Model):
    CATEGORY_CHOICES = (
        ('wheat', 'Wheat'),
        ('rice', 'Rice'),
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('other', 'Other'),
    )
    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='crops')
    crop_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.CharField(max_length=20, default='kg') # kg or quintal
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    harvest_date = models.DateField()
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True) # or ImageField
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.crop_name} by {self.farmer.username}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    )
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, related_name='orders')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.crop.crop_name if self.crop else 'Deleted Crop'}"

class Payment(models.Model):
    METHOD_CHOICES = (
        ('upi', 'UPI'),
        ('card', 'Debit/Credit Card'),
        ('cod', 'Cash on Delivery'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=METHOD_CHOICES, default='cod')
    transaction_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.transaction_status}"

class Review(models.Model):
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_given')
    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.buyer.username} for {self.farmer.username}"
