# DeepLink - The Ultimate Social Platform

DeepLink is a modern social platform designed to foster meaningful connections through AI-powered matchmaking, engaging communities, and personalized experiences.

## Features

- **User Authentication**: Secure login with email, password, and social providers
- **Enhanced Profiles**: Personal stories, personality tags, and connection tracking
- **Community Structure**: Topic-based communities with advanced moderation
- **Post & Rating System**: Star-based rating system for nuanced feedback
- **Real-time Chat**: Direct messages and private chat rooms
- **AI Integration**: Personalized recommendations and icebreaker questions
- **Gamification**: Badges, leaderboards, and engagement rewards

## Tech Stack

- **Backend**: Django (Python)
- **Frontend**: React + Tailwind CSS
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: WebSockets
- **AI**: OpenAI GPT models

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Project Structure

```
deeplink/
├── backend/           # Django backend
│   ├── apps/         # Django apps
│   ├── config/       # Project configuration
│   └── manage.py
├── frontend/         # React frontend
│   ├── src/          # Source files
│   ├── public/       # Static files
│   └── package.json
├── requirements.txt  # Python dependencies
└── README.md        # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 