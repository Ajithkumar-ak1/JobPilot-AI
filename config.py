import os
from datetime import datetime


class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    JSON_SORT_KEYS = False
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
