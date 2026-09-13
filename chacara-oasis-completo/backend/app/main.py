from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import Base, engine
from app.routers import availability, blocked_dates, bookings

# Cria as tabelas automaticamente.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Chácara Oasis - API de Reservas",
    description="Backend do sistema de gestão e agendamento da Chácara Oasis.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chacara-oasis.chacara-oasis.workers.dev",      # Corrigo aqui (sem o '-app')
        "https://chacara-oasis-app.chacara-oasis.workers.dev",  # Mantido por precaução
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bookings.router)
app.include_router(availability.router)
app.include_router(blocked_dates.router)


@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "service": "Chácara Oasis API",
    }


@app.get("/health", tags=["Health Check"])
def health():
    return {"status": "ok"}