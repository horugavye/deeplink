#!/bin/bash

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create Django project
django-admin startproject config .

# Create apps directory
mkdir -p apps

# Create main apps
cd apps
django-admin startapp users
django-admin startapp communities
django-admin startapp posts
django-admin startapp chat
django-admin startapp notifications

# Create frontend directory
cd ..
mkdir -p frontend

# Initialize React project with Vite
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional frontend dependencies
npm install @heroicons/react @headlessui/react axios react-router-dom @reduxjs/toolkit react-redux socket.io-client

# Create basic directory structure
mkdir -p src/{components,pages,services,store,utils,hooks,assets}
mkdir -p src/components/{layout,ui,forms,modals}
mkdir -p src/pages/{auth,home,profile,communities,chat}

# Create basic configuration files
cd ..
touch .gitignore
echo "venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
.env
*.log
node_modules/
.DS_Store
.idea/
.vscode/
*.sqlite3
media/
static/
" > .gitignore

# Make setup script executable
chmod +x setup.sh

echo "Project structure created successfully!"
echo "Next steps:"
echo "1. Copy .env.example to .env and update the values"
echo "2. Run migrations: python manage.py migrate"
echo "3. Start the development servers:"
echo "   - Backend: python manage.py runserver"
echo "   - Frontend: cd frontend && npm run dev" 