from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User

class Community(models.Model):
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(_('description'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_private = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    
    # Relationships
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_communities'
    )
    moderators = models.ManyToManyField(
        User,
        related_name='moderated_communities',
        blank=True
    )
    members = models.ManyToManyField(
        User,
        related_name='joined_communities',
        blank=True
    )
    
    # Community settings
    allow_posts = models.BooleanField(default=True)
    allow_comments = models.BooleanField(default=True)
    require_approval = models.BooleanField(default=False)
    
    # Community stats
    member_count = models.IntegerField(default=0)
    post_count = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = _('community')
        verbose_name_plural = _('communities')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.name.lower().replace(' ', '-')
        super().save(*args, **kwargs)
    
    def update_member_count(self):
        self.member_count = self.members.count()
        self.save()
    
    def update_post_count(self):
        self.post_count = self.posts.count()
        self.save()

class CommunityCategory(models.Model):
    name = models.CharField(_('name'), max_length=50)
    description = models.TextField(_('description'), blank=True)
    communities = models.ManyToManyField(
        Community,
        related_name='categories',
        blank=True
    )
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
    
    def __str__(self):
        return self.name

class CommunityRule(models.Model):
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name='rules'
    )
    title = models.CharField(_('title'), max_length=100)
    description = models.TextField(_('description'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('rule')
        verbose_name_plural = _('rules')
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.community.name} - {self.title}"

class CommunityInvite(models.Model):
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name='invites'
    )
    inviter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_invites'
    )
    invitee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_invites'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('invite')
        verbose_name_plural = _('invites')
        unique_together = ['community', 'invitee']
    
    def __str__(self):
        return f"{self.inviter} invited {self.invitee} to {self.community}" 