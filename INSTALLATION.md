# Installation Guide

This guide sets up all three parts of ByCatch Loop from a fresh clone: the
Supabase backend, the freshness API and the Next.js frontend. It ends with a
smoke test that walks through a full sale.

The frontend depends on Supabase. The freshness API is optional: without it,
catches are still saved but stay "Not graded yet".

## 1. Prerequisites

| Tool | Version | Used for |
| --- | --- | --- |
| [Node.js](https://nodejs.org/en/download) | 20.9 or newer (Next.js 16's minimum) | Frontend |
| npm | Bundled with Node.js | Frontend dependencies (`package-lock.json`) |
| [Python](https://www.python.org/downloads/) | 3.11 (the version in the Dockerfile) | Freshness API without Docker |
| [Docker](https://docs.docker.com/get-docker/) | Any recent version | Freshness API in a container (optional) |
| [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) | 2.x | Deploying edge functions and setting secrets |
| A [Supabase](https://supabase.com) account | – | Hosted Postgres, Auth, Storage and Edge Functions |
| Git | Any | Cloning |

No GPU is needed. `freshness-api/requirements.txt` installs CPU-only PyTorch
from the PyTorch CPU wheel index, and the model is small (YOLOv8n classifier
plus a Random Forest).

## 2. Clone the repository

```bash
git clone https://github.com/KzNck/Lomba-Ikan.git
cd Lomba-Ikan
```

The trained model files (`freshness-api/*.joblib`, `freshness-api/bycatch_yolo_freshness.pt`,
about 25 MB together) are committed to the repository, so no extra download is needed.

## 3. Supabase

### 3.1 Create a project

Create a new project in the [Supabase dashboard](https://supabase.com/dashboard).
Keep these values from the project's **Connect** dialog (also under **Project
Settings → API Keys**):

- **Project URL**, e.g. `https://abcdefghijklmnop.supabase.co`
- **Publishable key**, which starts with `sb_publishable_`
- **Project ref**, the `abcdefghijklmnop` part of the URL

### 3.2 Run the SQL files

Open **SQL Editor** and run these files from `supabase/`, one at a time, in this order:

| # | File | What it adds |
| --- | --- | --- |
| 1 | `schema.sql` | Enums, the tables `profiles`, `catches`, `transactions`, `ai_inference_log`, `sync_log`, RLS policies, triggers, and the functions `get_transaction_contact` and `cancel_transaction` |
| 2 | `storage.sql` | Public `catch-photos` bucket; users can only write to their own folder |
| 3 | `catches-delete.sql` | Sets `sync_log.catch_id` to `ON DELETE SET NULL`, so a fisher can delete an unsold catch |
| 4 | `expire-listings.sql` | `pg_cron` job that marks listings `EXPIRED` 48 hours after they go live (runs every 5 minutes) |
| 5 | `pickup-confirmation.sql` | `transactions.pembeli_confirmed_at` column |
| 6 | `transactions-lockdown.sql` | Transactions become read-only to clients; pickup scheduling and receipt go through checked SQL functions |

Every file except `schema.sql` is safe to run again.

`schema.sql` already includes the contents of `catches-purchased.sql`,
`transaction-contact.sql`, `cancel-transaction.sql`, `profiles-role-lock.sql` and
`catches-lockdown.sql`. Those five files exist for projects created before the
change. You don't need them on a new project.

### 3.3 Auth settings

In **Authentication**:

1. **URL Configuration.** Set **Site URL** to where the frontend runs
   (`http://localhost:3000` for local development). Add every other domain you
   use under **Redirect URLs**. Email links are built from this value.
2. **Email Templates → Confirm signup.** Replace the body with
   `supabase/email-templates/confirm-signup.html`. The subject is in the file's
   first comment. The link must point to the app's `/auth/confirm`, not
   Supabase's default `{{ .ConfirmationURL }}`.
3. **Email Templates → Reset Password.** Replace the body with
   `supabase/email-templates/reset-password.html`.

Email confirmation is on by default. The app also works with it turned off: the
user is signed in right after registering.

### 3.4 Deploy the edge functions

From the repository root:

```bash
supabase login
supabase link --project-ref <your-project-ref>

# URL of the freshness API from step 4, without a trailing slash
supabase secrets set FRESHNESS_API_URL=https://your-freshness-api.example.com

supabase functions deploy process-escrow
supabase functions deploy confirm-handover
supabase functions deploy grade-catch
```

| Function | Called by | Secrets it reads |
| --- | --- | --- |
| `process-escrow` | Buyer's "Buy" button | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (provided by Supabase) |
| `confirm-handover` | Fisher's handover confirmation | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `grade-catch` | Right after a catch photo is saved, and "Grade again" | The above plus `FRESHNESS_API_URL` (you set this one) |

Secrets take effect without redeploying.

## 4. Freshness API

The API loads the three model files once at startup and serves one prediction
endpoint. Pick one of the two ways to run it.

### Option A: Docker (same as production)

```bash
cd freshness-api
docker build -t freshness-api .
docker run -p 8080:8080 freshness-api
```

The API listens on port **8080**.

### Option B: Python virtual environment

```bash
cd freshness-api
python3.11 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload      # port 8000
```

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns `{"status": "ok"}` |
| `POST` | `/api/v1/predict` | Multipart form: catch data plus a photo. Returns the grade. |
| `GET` | `/docs` | Interactive OpenAPI docs (FastAPI) |

Try a prediction with a photo that is already in the repo (use port 8000 for Option B):

```bash
curl -X POST http://localhost:8080/api/v1/predict \
  -F catch_id=test \
  -F status_ikan=MATI \
  -F hours_post_haul=6 \
  -F ice_to_fish_ratio=0.5 \
  -F ambient_temp_celsius=30 \
  -F storage_method=chilled_seawater \
  -F fish_category=campuran \
  -F photo=@../frontend/public/images/nelayan/kategori/campuran.jpg
```

The response has `predicted_grade`, `confidence_score`, `hilirisasi_recommendation`,
`override_applied`, `rationale` and `model_version`. Field details are in
[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md#5-freshness-api).

All grading goes through `grade-catch`, the only component allowed to write a
grade. It runs on Supabase's servers, so it can't reach an API on your
`localhost`: the freshness API needs a public URL. Production runs the
Dockerfile on [Railway](https://railway.app). For local testing you can point the
secret at the deployed instance, or expose your local API with a tunnel such as
`ngrok http 8080`.

## 5. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Required | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from step 3.1 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Publishable key from step 3.1 (`sb_publishable_…`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | The legacy anon JWT. Used only if the publishable key is empty. |

The frontend never needs the service-role key. Don't put it in `.env.local`.

Run it:

```bash
npm run dev          # development server on http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run lint         # ESLint
```

The service worker (offline page) is registered only in production builds.
Use `npm run build && npm start` to test offline behaviour.

## 6. Smoke test

Run through this once after setup. Use two browsers, or one normal window and one private window, so you can be signed in as a fisher and a buyer at the same time.

1. **API up:** `curl http://localhost:8080/health` returns `{"status":"ok"}`.
2. **Register a fisher.** Open http://localhost:3000, go to **Sign Up as a
   Fisher**, and enter a WhatsApp number and a landing site (PPI). Click the confirmation
   email link. You should land on `/nelayan`.
3. **Log a catch.** On the fisher dashboard, click **Add Catch**, answer the six
   steps and add a photo. The result page shows a grade (`A1`–`B3`) and
   recommended uses. In Supabase, `catches` has the new row and
   `ai_inference_log` has a `success` entry.
4. **Publish.** Set an optional price per kg and publish. The batch shows under
   **My Listings** with a 48-hour countdown.
5. **Register a buyer** in the second browser (**Sign Up as a Buyer**). The
   batch appears in `/marketplace`.
6. **Buy.** Open the batch and buy it. WhatsApp opens with a message to the
   fisher. `transactions` now has a row with status `ESCROW_PENDING`, and the
   catch is `CLAIMED`.
7. **Pickup.** In the buyer's purchase history, set a pickup time, then confirm
   the batch was received.
8. **Handover.** In the fisher's transaction history, confirm the handover with
   the final weight. The transaction becomes `COMPLETED` with `final_total` =
   final weight × price per kg, and the catch becomes `COMPLETED`.
9. **Offline (optional, production build).** Open the site once while online, turn
   off the network, log a catch from the offline page, then turn the network
   back on. The catch syncs and appears in My Listings.

## 7. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Error `Kredensial Supabase belum lengkap: NEXT_PUBLIC_SUPABASE_URL, …` ("Supabase credentials incomplete") | `.env.local` is missing or incomplete | Copy `.env.example` to `.env.local` and fill in the URL and publishable key, then restart `npm run dev` |
| Catch saved but shows "Not graded yet" | `grade-catch` is not deployed, has no `FRESHNESS_API_URL` secret, or can't reach the API | Deploy the function and set the secret (step 3.4), then use "Grade again" on the result page. Edge function logs show `grade-catch: secret FRESHNESS_API_URL belum diset` ("not set") when the secret is missing. |
| Error `catch_field_locked` or `catch_status_locked` | A write tried to change a grade, a model input, or a catch status outside the app's flow from a user session (`catches-lockdown.sql`) | Expected for direct API writes. Grades come only from `grade-catch`. |
| Server log shows `Bucket not found` | `storage.sql` was not run | Run it. The catch is saved without a photo until then. |
| Publishing a catch sends the fisher back to the result page | The profile has no valid WhatsApp number (buyers are sent to it after buying) | Add the number under Account |
| Confirmation link opens the login page with `?konfirmasi=gagal` (confirmation failed) | Link already used or expired, or the template or Site URL is wrong | Check step 3.3. The page at `/auth/daftar/konfirmasi` can resend the link (60-second cooldown). |
| Confirmation email never arrives | Supabase's built-in email sender has a low hourly limit | Wait, set up custom SMTP, or turn off email confirmation for testing |
| Fisher sees "Waiting for the buyer to confirm they received the batch" | The buyer hasn't confirmed receipt yet. A database trigger (`buyer_not_confirmed`) blocks completion before that. | The buyer confirms receipt first |
| A fisher account sees an empty marketplace | By design: RLS shows `LISTED` catches only to buyer accounts | Use a buyer account |
| `expire-listings.sql` fails on `CREATE EXTENSION pg_cron` | The extension is not enabled | Enable **pg_cron** under **Database → Extensions**, then run the file again |
| Freshness API exits at startup with `File model tidak ditemukan` ("model file not found") | A model file is missing from `freshness-api/` | Make sure `bycatch_unified_model.joblib`, `bycatch_preprocessor.joblib` and `bycatch_yolo_freshness.pt` are in the `freshness-api/` folder (next to the Dockerfile) |
| `InconsistentVersionWarning` from scikit-learn when the API starts | The model was saved with scikit-learn 1.6.1, and `requirements.txt` pins 1.5.2 | The API still loads and predicts. Pinning `scikit-learn==1.6.1` removes the warning. |
| `422 Format foto tidak dikenali` ("photo format not recognised") | The upload isn't an image Pillow can read | Use JPG, PNG, WebP or HEIC |
| Photo upload fails for very large files | Server Actions accept up to 4 MB. The browser shrinks photos to a 1600 px JPEG first, but a HEIC photo in Chrome can't be decoded in the browser, so it is sent as is. | Use a smaller photo, or take it with the in-app camera |
| `Address already in use` | Port 3000, 8000 or 8080 is taken | `npm run dev -- -p 3001`, `uvicorn … --port 8001`, or `docker run -p 8081:8080 …` |
