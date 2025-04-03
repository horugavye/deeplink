from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User
from apps.communities.models import Community

class Post(models.Model):
    title = models.CharField(_('title'), max_length=200)
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)
    
    # Relationships
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    
    # Post stats
    view_count = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0)
    total_ratings = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = _('post')
        verbose_name_plural = _('posts')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def update_rating_stats(self):
        ratings = self.ratings.all()
        if ratings.exists():
            self.average_rating = sum(r.rating for r in ratings) / ratings.count()
            self.total_ratings = ratings.count()
        else:
            self.average_rating = 0
            self.total_ratings = 0
        self.save()

class PostRating(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='post_ratings'
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('rating')
        verbose_name_plural = _('ratings')
        unique_together = ['post', 'user']
    
    def __str__(self):
        return f"{self.user} rated {self.post} {self.rating} stars"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.post.update_rating_stats()

class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    
    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author} on {self.post}"

class PostMedia(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
    ]
    
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='media'
    )
    file = models.FileField(upload_to='post_media/')
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPES
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('media')
        verbose_name_plural = _('media')
    
    def __str__(self):
        return f"{self.media_type} for {self.post}" 