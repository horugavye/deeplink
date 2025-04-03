import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import ChatRoom, Message, ChatParticipant
from apps.notifications.models import Notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user']

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Update participant's last read time
        await self.update_last_read()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'chat_message':
            message = text_data_json['message']
            # Save message to database
            saved_message = await self.save_message(message)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': self.user.username,
                    'timestamp': timezone.now().isoformat(),
                    'message_id': saved_message.id
                }
            )
            
            # Create notifications for other participants
            await self.create_notifications(saved_message)
            
        elif message_type == 'typing':
            # Broadcast typing status
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing',
                    'user': self.user.username,
                    'is_typing': text_data_json['is_typing']
                }
            )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id']
        }))

    async def typing(self, event):
        # Send typing status to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'user': event['user'],
            'is_typing': event['is_typing']
        }))

    @database_sync_to_async
    def save_message(self, content):
        room = ChatRoom.objects.get(id=self.room_name)
        message = Message.objects.create(
            room=room,
            sender=self.user,
            content=content
        )
        return message

    @database_sync_to_async
    def update_last_read(self):
        room = ChatRoom.objects.get(id=self.room_name)
        participant, created = ChatParticipant.objects.get_or_create(
            user=self.user,
            room=room
        )
        participant.update_last_read()

    @database_sync_to_async
    def create_notifications(self, message):
        room = message.room
        participants = room.participants.exclude(id=self.user.id)
        
        for participant in participants:
            Notification.create_chat_message_notification(
                recipient=participant,
                sender=self.user,
                room=room
            ) 