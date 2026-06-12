from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserProfileView, CropViewSet, OrderViewSet, ReviewViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
]

urlpatterns += router.urls
