from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User
from django.utils import timezone

class ChatRoom(models.Model):
    ROOM_TYPES = [
        ('direct', 'Direct Message'),
        ('group', 'Group Chat'),
    ]
    
    name = models.CharField(_('name'), max_length=100, blank=True)
    room_type = models.CharField(
        max_length=10,
        choices=ROOM_TYPES,
        default='direct'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relationships
    participants = models.ManyToManyField(
        User,
        related_name='chat_rooms'
    )
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_chat_rooms'
    )
    
    class Meta:
        verbose_name = _('chat room')
        verbose_name_plural = _('chat rooms')
        ordering = ['-updated_at']
    
    def __str__(self):
        if self.room_type == 'direct':
            participants = self.participants.all()
            if participants.count() == 2:
                return f"Chat between {participants[0]} and {participants[1]}"
        return self.name or f"Group Chat {self.id}"
    
    def save(self, *args, **kwargs):
        if self.room_type == 'direct' and self.participants.count() > 2:
            self.room_type = 'group'
        super().save(*args, **kwargs)

class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('message')
        verbose_name_plural = _('messages')
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender} in {self.room}"

class MessageMedia(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
    ]
    
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='media'
    )
    file = models.FileField(upload_to='message_media/')
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPES
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('message media')
        verbose_name_plural = _('message media')
    
    def __str__(self):
        return f"{self.media_type} for {self.message}"

class ChatParticipant(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_participations'
    )
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    last_read = models.DateTimeField(null=True, blank=True)
    is_muted = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('participant')
        verbose_name_plural = _('participants')
        unique_together = ['user', 'room']
    
    def __str__(self):
        return f"{self.user} in {self.room}"
    
    def update_last_read(self):
        self.last_read = timezone.now()
        self.save()
        
        # Mark messages as read
        Message.objects.filter(
            room=self.room,
            created_at__lte=self.last_read
        ).exclude(sender=self.user).update(is_read=True) 