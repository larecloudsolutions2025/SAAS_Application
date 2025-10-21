# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth
from app.routers.mocktests_router import router as mocktests_router
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="SaaS App Backend")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ✅ Database creation on startup (safer than global call)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables checked/created successfully.")

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(mocktests_router)
@app.get("/")
def root():
    return {"msg": "Welcome to SaaS App Backend"}
