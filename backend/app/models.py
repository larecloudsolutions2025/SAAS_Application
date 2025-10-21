from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey, Boolean, JSON, Text
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "auth_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    results = relationship("UserResult", back_populates="user", cascade="all, delete-orphan")
    caches = relationship("ExamCache", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"), nullable=False)
    full_name = Column(String(100))
    dob = Column(Date)
    gender = Column(String(10))

    # back link
    user = relationship("User", back_populates="profile")


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id", ondelete="CASCADE"))
    token = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    active = Column(Boolean, default=True)

    user = relationship("User", back_populates="sessions")


class MockTestFile(Base):
    __tablename__ = "mock_test_files"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    exam_type = Column(String(100), nullable=True)
    test_type = Column(String(20), default="full")   # "full" or "subject"
    subject = Column(String(100), nullable=True)     # Reasoning, English, Aptitude, etc.
    file_path = Column(String(1024), nullable=False)  # path under app/excel_files or S3 URL
    total_questions = Column(Integer, default=0)
    duration_minutes = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    results = relationship("UserResult", back_populates="mocktest", cascade="all, delete-orphan")
    caches = relationship("ExamCache", back_populates="mocktest", cascade="all, delete-orphan")


class UserResult(Base):
    __tablename__ = "user_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"), nullable=False)
    mocktest_id = Column(Integer, ForeignKey("mock_test_files.id"), nullable=False)
    score = Column(Integer)
    total_questions = Column(Integer)
    percentage = Column(String(20))
    status = Column(String(50))  # e.g., in_progress, completed, auto_submitted
    time_taken_seconds = Column(Integer)
    details = Column(JSON)  # ✅ NEW COLUMN — stores per-question answers, explanations, etc.
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="results")
    mocktest = relationship("MockTestFile", back_populates="results")
    sections = relationship("UserSectionResult", back_populates="user_result", cascade="all, delete-orphan")


class UserSectionResult(Base):
    __tablename__ = "user_section_results"
    id = Column(Integer, primary_key=True, index=True)
    user_result_id = Column(Integer, ForeignKey("user_results.id"), nullable=False)
    section_name = Column(String(200))
    correct = Column(Integer, default=0)
    wrong = Column(Integer, default=0)
    unanswered = Column(Integer, default=0)
    marks_obtained = Column(Integer, default=0)

    user_result = relationship("UserResult", back_populates="sections")


class AttemptLog(Base):
    __tablename__ = "attempt_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"))
    mocktest_id = Column(Integer, ForeignKey("mock_test_files.id"))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    status = Column(String, default="in_progress")
    answers_snapshot = Column(JSON, default={})  # <-- save partial answers
    time_spent_seconds = Column(Integer, default=0)

    user = relationship("User")
    mocktest = relationship("MockTestFile")

class ExamCache(Base):
    __tablename__ = "exam_cache"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"), nullable=False)
    mocktest_id = Column(Integer, ForeignKey("mock_test_files.id"), nullable=False)
    current_question = Column(Integer, default=0)
    answers_json = Column(JSON, default={})  # {"1":"A", "2":"C"}
    time_left = Column(Integer, default=3600)  # seconds
    last_saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="caches")
    mocktest = relationship("MockTestFile", back_populates="caches")


class EmailLog(Base):
    __tablename__ = "email_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth_users.id"), nullable=True)
    mocktest_id = Column(Integer, ForeignKey("mock_test_files.id"), nullable=True)
    email = Column(String(255))
    subject = Column(String(255))
    status = Column(String(50))  # SENT, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)
