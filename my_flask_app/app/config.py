import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Database configuration
    # Railway provides DATABASE_URL for PostgreSQL
    # Falls back to SQLite for local development
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    
    # Fix for Railway's postgres:// vs postgresql:// issue
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database connection options for serverless environments
    # Prevents connection timeout issues in Vercel/Railway
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,  # Check connection before using
        'pool_recycle': 300,    # Recycle connections every 5 minutes
        'connect_args': {
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000'  # 30 second statement timeout
        } if 'postgresql' in SQLALCHEMY_DATABASE_URI else {}
    }
    
    # Brevo Email Configuration
    BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL') or 'noreply@tmes.com'
    SENDER_NAME = os.environ.get('SENDER_NAME') or 'TMES IIT Kharagpur'
    
    # OTP Configuration
    OTP_EXPIRY_MINUTES = 10
    
    # Razorpay Configuration
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID') or 'rzp_test_xxxxxxxxxxxx'
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET') or 'your_razorpay_secret'
    
    # Great Step Registration Fee (in paise, 100 paise = 1 INR)
    GREATSTEP_REGISTRATION_FEE = int(os.environ.get('GREATSTEP_REGISTRATION_FEE', 80000))  # Default: ₹800
    
    # Main Admin Email (Protected)
    MAIN_ADMIN_EMAIL = os.environ.get('MAIN_ADMIN_EMAIL')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SESSION_COOKIE_SECURE = True  # HTTPS only
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
