# LAU Ride

LAU Ride is a full-stack student carpooling platform designed to help university students find, offer, and manage shared rides safely and efficiently.

The application includes user authentication, ride publishing, ride searching, passenger requests, driver approval workflows, profile management, and emergency support features.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token authentication
- Multer
- QR Code integration

## Project Structure

```text
Students_Carpooling/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   ├── .env
│   └── package.json
│
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=https://your-backend-domain.com
```

Do not commit `.env` files or production credentials to GitHub.

## Local Development

### Install and run the backend

```bash
cd backend
npm install
npm run dev
```

### Install and run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

The backend will normally run on:

```text
http://localhost:5000
```

## Production Build

Build the frontend with:

```bash
cd frontend
npm install
npm run build
```

The optimized production files will be generated inside:

```text
frontend/dist
```

Preview the production build locally:

```bash
npm run preview
```

## Production Deployment

A recommended deployment setup is:

- Frontend: Vercel, Netlify, or Cloudflare Pages
- Backend: Render, Railway, Fly.io, or a VPS
- Database: MongoDB Atlas

### Frontend deployment

1. Set the project root directory to `frontend`.
2. Use the following build command:

```bash
npm run build
```

3. Set the output directory to:

```text
dist
```

4. Add the production environment variable:

```env
VITE_API_URL=https://your-backend-domain.com
```

### Backend deployment

1. Set the project root directory to `backend`.
2. Use the following install command:

```bash
npm install
```

3. Use the following start command:

```bash
npm start
```

4. Add all backend environment variables through the hosting provider dashboard.

## Production Checklist

Before deployment, verify that:

- MongoDB Atlas network access is configured.
- Production environment variables are added.
- CORS allows only the production frontend domain.
- JWT secrets are strong and private.
- Uploaded files are stored persistently.
- HTTPS is enabled.
- API URLs do not reference `localhost`.
- Frontend and backend production builds run successfully.
- Sensitive files are excluded using `.gitignore`.

## Git Commands

```bash
git add .
git commit -m "Prepare LAU Ride for production deployment"
git push origin main
```

## License

This project was developed as an academic software engineering project. Unauthorized commercial redistribution may require permission from the project owners.
