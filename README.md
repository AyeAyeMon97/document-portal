# Document Portal

Document Portal is a Laravel API backend with a React frontend.

## Project Structure

```text
document-portal/
├── backend/     # Laravel API
└── frontend/    # React + Vite

git pull origin main

cd backend 
composer install 
copy .env.example .env 
php artisan key:generate 
php artisan jwt:secret 
php artisan migrate 
php artisan db:seed
php artisan storage:link 
php artisan serve

Frontend

Open another terminal:

cd frontend
npm install

Create:

frontend/.env

with:

VITE_API_URL=http://127.0.0.1:8000/api

Then:

npm run dev