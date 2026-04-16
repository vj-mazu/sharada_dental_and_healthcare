from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./appointments.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, index=True)
    phone_number = Column(String, index=True)
    preferred_date = Column(String)
    symptom = Column(String)
    source = Column(String) # 'whatsapp' or 'website'
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
