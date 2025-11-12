import uvicorn
import firebase_admin
from firebase_admin import credentials
import pathlib
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles  # Frontend ke liye
from fastapi.responses import FileResponse   # Frontend ke liye
from fastapi.middleware.cors import CORSMiddleware
import os
import json

# Local modules
from . import auth, api_routes
from .database import engine, Base

# --- Paths ---
BASE_DIR = pathlib.Path(__file__).resolve().parent
SDK_PATH = BASE_DIR / "firebase-sdk.json"

# --- FastAPI Lifespan Event ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application startup...")
    print("📦 Creating database tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    yield
    print("🛑 Application shutdown...")


# --- Firebase Admin SDK Initialization ---
try:
    firebase_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if firebase_json:
        creds_dict = json.loads(firebase_json)
        temp_path = "/tmp/firebase.json"
        with open(temp_path, "w") as f:
            json.dump(creds_dict, f)
        cred = credentials.Certificate(temp_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized successfully on Render.")
    else:
        if SDK_PATH.exists():
            cred = credentials.Certificate(SDK_PATH)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized from local SDK file.")
        else:
            print(f"⚠️ Firebase credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON in Render.")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")


# --- App Definition ---
app = FastAPI(
    title="NeoCart API",
    description="Backend API for the NeoCart e-commerce platform.",
    version="1.0.0",
    lifespan=lifespan
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(api_routes.router, prefix="/api", tags=["API Routes"])

# --- React Frontend (dist folder serve) ---
assets_path = os.path.join(BASE_DIR, "dist", "assets")
if not os.path.exists(assets_path):
    print(f"⚠️ WARNING: Directory not found at '{assets_path}'. Static files may not serve correctly.")

app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    html_file_path = os.path.join(BASE_DIR, "dist", "index.html")
    if os.path.exists(html_file_path):
        return FileResponse(html_file_path)
    else:
        print(f"❌ ERROR: index.html not found at '{html_file_path}'")
        return {"error": "index.html not found. Run 'npm run build' and move 'dist' folder inside 'backend'."}


# --- Root Endpoint ---
@app.get("/api")
async def root():
    return {"message": "🚀 NeoCart API running successfully!"}


# --- Run (For Local Development Only) ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)
