# Lomba-Ikan Web Platform

A comprehensive web platform that integrates a modern frontend, a machine learning API for assessing fish freshness and bycatch, and a robust backend powered by Supabase.

## 🚀 Tech Stack

### Frontend (`/frontend`)
*   **Framework:** [Next.js](https://nextjs.org/) (v16) with React 19
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
*   **Database & Auth:** Supabase SSR & Supabase JS client
*   **Maps & Geolocation:** Leaflet & React-Leaflet
*   **Language:** TypeScript

### Machine Learning API (`/freshness-api`)
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) with Uvicorn
*   **Machine Learning:** Scikit-learn, Pandas, NumPy, SciPy
*   **Model Serialization:** Joblib
*   **Image Processing:** Pillow
*   **Language:** Python 3

### Database & Backend Services (`/supabase`)
*   **Platform:** [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, Storage)
*   **Edge Functions:** Deno / TypeScript (e.g., `confirm-handover`)

---

## 🛠 Installation Guide

### Prerequisites
*   Node.js (v20+ recommended)
*   Python (v3.9+ recommended)
*   Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Lomba-Web
```

### 2. Frontend Setup
Navigate to the frontend directory and install the necessary dependencies:
```bash
cd frontend
npm install
```

Set up the environment variables by copying the example file:
```bash
cp .env.example .env.local
```
*Make sure to populate `.env.local` with your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.*

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Machine Learning API Setup
Open a new terminal session, navigate to the API directory, and set up a Python virtual environment:
```bash
cd freshness-api

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
The API will be accessible at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

### 4. Supabase Edge Functions Setup
To deploy or run the Supabase edge functions locally, you will need the Supabase CLI:
```bash
cd supabase
# To start Supabase locally (requires Docker):
supabase start

# To deploy functions to a remote project:
supabase functions deploy confirm-handover
```

---

## 📁 Project Structure

*   **/frontend** - Contains the Next.js web application, UI components, and Supabase client integration.
*   **/freshness-api** - Contains the Python FastAPI service, handling ML predictions for fish freshness and bycatch models.
*   **/supabase** - Contains Supabase project configuration and edge functions.
