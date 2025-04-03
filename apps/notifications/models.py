from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('follow', 'New Follower'),
        ('post_like', 'Post Like'),
        ('post_comment', 'Post Comment'),
        ('post_rating', 'Post Rating'),
        ('community_invite', 'Community Invite'),
        ('chat_message', 'New Message'),
        ('system', 'System Notification'),
    ]
    
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional fields for different notification types
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_notifications',
        null=True,
        blank=True
    )
    target_id = models.PositiveIntegerField(null=True, blank=True)
    target_type = models.CharField(max_length=50, null=True, blank=True)
    
    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.recipient}: {self.message}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save()
    
    @classmethod
    def create_follow_notification(cls, recipient, sender):
        return cls.objects.create(
            recipient=recipient,
            sender=sender,
            notification_type='follow',
            message=f"{sender.get_full_name()} started following you"
        )
    
    @classmethod
    def create_post_rating_notification(cls, recipient, sender, post):
        return cls.objects.create(
            recipient=recipient,
            sender=sender,
            notification_type='post_rating',
            message=f"{sender.get_full_name()} rated your post",
            target_id=post.id,
            target_type='post'
        )
    
    @classmethod
    def create_comment_notification(cls, recipient, sender, post):
        return cls.objects.create(
            recipient=recipient,
            sender=sender,
            notification_type='post_comment',
            message=f"{sender.get_full_name()} commented on your post",
            target_id=post.id,
            target_type='post'
        )
    
    @classmethod
    def create_chat_message_notification(cls, recipient, sender, room):
        return cls.objects.create(
            recipient=recipient,
            sender=sender,
            notification_type='chat_message',
            message=f"New message from {sender.get_full_name()}",
            target_id=room.id,
            target_type='chat_room'
        )
    
    @classmethod
    def create_system_notification(cls, recipient, message):
        return cls.objects.create(
            recipient=recipient,
            notification_type='system',
            message=message
        ) 