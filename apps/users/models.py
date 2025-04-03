from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    bio = models.TextField(_('bio'), blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    connection_strength = models.IntegerField(default=0)
    personality_tags = models.JSONField(default=dict, blank=True)
    
    # Social connections
    followers = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='following',
        blank=True
    )
    
    # Privacy settings
    show_email = models.BooleanField(default=False)
    show_location = models.BooleanField(default=True)
    
    # Preferences
    theme = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark')],
        default='light'
    )
    
    # Email notifications
    email_notifications = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        return self.first_name
    
    def update_connection_strength(self, increment=1):
        self.connection_strength += increment
        self.save()
    
    def add_personality_tag(self, tag):
        if not self.personality_tags:
            self.personality_tags = {}
        if tag not in self.personality_tags:
            self.personality_tags[tag] = 1
        else:
            self.personality_tags[tag] += 1
        self.save()
    
    def remove_personality_tag(self, tag):
        if self.personality_tags and tag in self.personality_tags:
            del self.personality_tags[tag]
            self.save() 