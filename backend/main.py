import uvicorn
import firebase_admin
from firebase_admin import credentials
import pathlib
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import FileResponse    
import os 
import json # JSON string ko padhne ke liye

# Local modules
from . import auth, api_routes 
from .database import engine, Base

# --- Paths ---
BASE_DIR = pathlib.Path(__file__).resolve().parent 
# SDK_PATH ki ab zaroorat nahi

# --- FastAPI Lifespan Event ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the FastAPI app.
    """
    # On Startup
    print("Application startup...")
    print("Creating database tables if they don't exist...")
    Base.metadata.create_all(bind=engine) 
    yield
    # On Shutdown
    print("Application shutdown...")


# --- Firebase Admin SDK Initialization (Environment Variable se) ---
try:
    # 1. Environment variable se JSON string ko padho
    json_string = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    
    if json_string is None:
        # Agar variable set nahi hai, toh server start mat karo
        print("FATAL ERROR: 'GOOGLE_APPLICATION_CREDENTIALS_JSON' env variable not found.")
        exit()
        
    # 2. JSON string ko Python dictionary mein convert karo
    cred_dict = json.loads(json_string)
    
    # 3. Dictionary se credentials initialize karo
    cred = credentials.Certificate(cred_dict)
    
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully from environment variable.")

except Exception as e:
    # Koi bhi error (jaise galat JSON) par server start mat karo
    print(f"FATAL ERROR: Failed to initialize Firebase Admin SDK: {e}")
    exit()
# --- FIX END ---


# --- App Definition ---
app = FastAPI(
    title="NeoCart API",
    description="Backend API for the NeoCart e-commerce platform.",
    version="1.0.0",
    lifespan=lifespan 
)

# --- API Routers (Pehle) ---
# API routes hamesha static files se *PEHLE* hone chahiye
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(api_routes.router, prefix="/api") # All other routes


# --- React Frontend (Baad mein) ---
# BASE_DIR ka istemal karke 'dist/assets' ka poora path banaya
assets_path = os.path.join(BASE_DIR, "dist", "assets")

if not os.path.exists(assets_path):
    print(f"WARNING: Directory not found at '{assets_path}'. Static files may not serve correctly.")

app.mount("/assets", StaticFiles(directory=assets_path), name="assets")


@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """
    Serve the React app's index.html for any path not matching an API route.
    """
    # Yahan bhi BASE_DIR ka istemal kiya
    html_file_path = os.path.join(BASE_DIR, "dist", "index.html")
    
    if os.path.exists(html_file_path):
        return FileResponse(html_file_path)
    else:
        print(f"ERROR: index.html not found at '{html_file_path}'")
        return {"error": "index.html not found. Make sure you have run 'npm run build' and moved the 'dist' folder to the 'backend' directory."}

# --- Run the app ---
if __name__ == "__main__":
    # Port ko string se number kar do, reload=True hata do (production ke liye)
    uvicorn.run("main:app", host="0.0.0.0", port=8000)