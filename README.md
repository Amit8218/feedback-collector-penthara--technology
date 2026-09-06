# Feedback Collector

Lightweight feedback triage dashboard we built to collect and review incoming user feedback notes. It has a React frontend with instant search and date filtering, wired up to an Express 5 backend with MongoDB persistence.

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or an Atlas connection URI)

## Getting Started

1. Install root dependencies:
```bash
npm install
```

2. Configure backend environment:
Copy the example env file into `server/.env` if it doesn't already exist:
```bash
# on windows powershell:
copy server/.env.example server/.env

# on bash/zsh:
cp server/.env.example server/.env
```
Default values connect to `mongodb://127.0.0.1:27017/feedback_collector` on port `5000`. If your local MongoDB runs on a different port or uses auth credentials, update `MONGO_URI` accordingly.

> Note: If MongoDB isn't running when you start the server, the process will boot and log a connection failure, but queries will time out after 4 seconds until MongoDB comes online.

3. Run the development environment:
To boot both the Express server (with `--watch`) and the Vite client concurrently:
```bash
npm run dev:all
```

Alternatively, you can split them into two separate terminal windows if you prefer isolated logs:
```bash
# Terminal 1 - API server on :5000
npm run server:dev

# Terminal 2 - Vite dev server on :5173
npm run dev
```

Open `http://localhost:5173`. Vite is configured to proxy all `/api/*` traffic directly to `http://localhost:5000`.

## API Quick Reference

### List & Filter Feedback
```
GET /api/feedback?search=login&date=2026-09-02&sortBy=createdAt&order=desc
```
Optional query parameters:
- `search`: case-insensitive regex search against name, email, and message
- `date`: exact date filter in `YYYY-MM-DD` format
- `sortBy`: sort key, either `createdAt` (default) or `name`
- `order`: `desc` (default) or `asc`

### Submit Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "name": "amit joshi",
  "email": "abc@any.com",
  "message": "The search  reset behavior feels super fast now."
}
```

### Delete Entry
```
DELETE /api/feedback/:id
```

### Health Check
```
GET /api/health
```

## Known Issues / TODO

- Pagination: Currently `GET /api/feedback` returns all matching records. If volume scales beyond a few hundred records, add cursor-based or limit/offset pagination.
- Rate limiting: Needs basic IP rate limiting on `POST /api/feedback` before this can be exposed outside internal networks.
- Triage tags: Support tagging feedback items (`bug`, `feature-request`, `praise`) and marking them as `resolved`.
- Export: Add CSV export button in the dashboard toolbar for reporting.