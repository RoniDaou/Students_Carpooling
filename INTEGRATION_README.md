# Frontend–Backend Integration

## 1. Backend environment variables (Render)
Set:
- `MONGO_URI`
- `SECRET`

Root directory: `backend`
Build command: `npm install`
Start command: `npm start`

## 2. Frontend local environment
Copy `frontend/.env.example` to `frontend/.env` and set:

```env
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Do not add a trailing slash.

## 3. Frontend deployment (Netlify)
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist` if the base directory is repository root, or `dist` if base directory is `frontend`
- Environment variable: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`

## 4. Commit
From the project root:

```bash
git add .
git commit -m "Connect frontend to backend"
git push
```

Then redeploy the backend and deploy the frontend.

## Main integrated features
- Real login and registration with JWT
- Persistent session via `/user/me`
- Profile update
- Real ride listing and ride details
- Driver ride creation and deletion
- Passenger ride requests
- Passenger booking/request status page
- Protected frontend routes
- SOS endpoint call
