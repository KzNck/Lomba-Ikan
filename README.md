# ByCatch Loop

Small-scale fishers often throw by-catch back into the sea because there's no
buyer for it at the landing site. ByCatch Loop is a B2B marketplace that lists
that by-catch for downstream buyers such as BSF (maggot) farms, fish silage
producers and organic fertilizer makers.

- **Nelayan (fishers)** log a catch, including offline, with a photo, volume
  and ice condition, then list it. A listing stays open for 48 hours.
- **Pembeli (buyers)** filter listings by grade and material type, see their
  preferred landing sites (PPI) first, claim a batch, schedule a pickup and
  confirm when it arrives.
- A freshness model estimates a grade (`A1`…`B3`) from the photo and the catch
  details. It's shown as an estimate, not a certification.

The app is in Indonesian, with an English translation.

## Repository layout

| Folder | What it is |
| --- | --- |
| [`frontend/`](frontend) | Next.js 16 app (App Router, React 19, Tailwind 4, next-intl, Leaflet), installable as a PWA |
| [`supabase/`](supabase) | Postgres schema and policies (SQL files), email templates, and the Deno edge functions `process-escrow`, `confirm-handover` and `grade-catch` |
| [`freshness-api/`](freshness-api) | FastAPI service that grades a catch: a YOLOv8 classifier reads the photo, and a joblib model combines that with the catch details |

## Running it

### 1. Supabase

1. Create a Supabase project.
2. In the SQL Editor, run `supabase/schema.sql`, then `storage.sql`, then the
   other SQL files. Run `pickup-confirmation.sql` before
   `transactions-lockdown.sql`. Each file explains what it does and is safe to
   re-run.
3. Deploy the edge functions and give `grade-catch` the freshness API's URL:

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase secrets set FRESHNESS_API_URL=<freshness-api base URL>
   supabase functions deploy process-escrow
   supabase functions deploy confirm-handover
   supabase functions deploy grade-catch
   ```

4. Finish the dashboard-only settings: email templates, Site URL and redirect
   URLs. [`frontend/README.md`](frontend/README.md#yang-perlu-diatur-di-supabase)
   has the steps.

### 2. Freshness API

The model files (`*.joblib`, `bycatch_yolo_freshness.pt`) are committed in
`freshness-api/`.

```bash
cd freshness-api
docker build -t freshness-api .
docker run -p 8080:8080 freshness-api
```

Or, without Docker (Python 3.11):

```bash
cd freshness-api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Endpoints: `POST /api/v1/predict` (multipart form with the photo) and
`GET /health`. Interactive docs are at `/docs`.

### 3. Frontend

Requires Node.js 20 or newer.

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm run dev
```

The app runs at http://localhost:3000. [`frontend/README.md`](frontend/README.md)
covers the environment variables, the data flow, and the fields the database
doesn't store yet (in Indonesian).
