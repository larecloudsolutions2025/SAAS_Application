from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    dob: Optional[datetime.date] = None
    gender: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    dob: Optional[datetime.date] = None
    gender: Optional[str] = None

    class Config:
        from_attributes = True   # Pydantic v2 replacement for orm_mode

# ---------------- Mock Test Schemas ----------------

# ---- MockTestFile (main table for both full + subject-wise) ----
class MockTestBase(BaseModel):
    name: str
    exam_type: Optional[str] = None
    test_type: Optional[str] = "full"
    subject: Optional[str] = None
    file_path: str
    total_questions: Optional[int] = 0
    duration_minutes: Optional[int] = 60
    is_active: Optional[bool] = True


class MockTestCreate(MockTestBase):
    pass


class MockTestResponse(MockTestBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


# ---- UserResult (for test results) ----
class UserSectionResultBase(BaseModel):
    section_name: Optional[str]
    correct: Optional[int] = 0
    wrong: Optional[int] = 0
    unanswered: Optional[int] = 0
    marks_obtained: Optional[int] = 0


class UserSectionResultResponse(UserSectionResultBase):
    id: int
    class Config:
        from_attributes = True


class UserResultBase(BaseModel):
    score: Optional[int]
    total_questions: Optional[int]
    percentage: Optional[str]
    status: Optional[str]
    time_taken_seconds: Optional[int]


class UserResultCreate(UserResultBase):
    mocktest_id: int


class UserResultResponse(UserResultBase):
    id: int
    user_id: int
    mocktest_id: int
    details: Optional[List[Dict[str, Any]]] = None  # ✅ NEW FIELD for per-question data
    submitted_at: datetime.datetime
    sections: Optional[List[UserSectionResultResponse]] = []

    class Config:
        from_attributes = True



# ---- AttemptLog (for tracking progress during test) ----
class AttemptLogBase(BaseModel):
    mocktest_id: int
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None
    status: Optional[str] = "in_progress"
    answers_snapshot: Optional[Dict[str, Any]] = {}
    time_spent_seconds: Optional[int] = 0


class AttemptLogResponse(AttemptLogBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True


# ---- ExamCache (to store current question + state) ----
class ExamCacheBase(BaseModel):
    mocktest_id: int
    current_question: Optional[int] = 0
    answers_json: Optional[Dict[str, str]] = {}
    time_left: Optional[int] = 3600


class ExamCacheResponse(ExamCacheBase):
    id: int
    user_id: int
    last_saved_at: datetime.datetime

    class Config:
        from_attributes = True

class QuestionAnswer(BaseModel):
    question_id: str
    selected: Optional[str] = None
    correct: Optional[str] = None
    is_correct: Optional[bool] = None
    explanation: Optional[str] = None
    explanation_image: Optional[str] = None

class SubmitPayload(BaseModel):
    answers: List[QuestionAnswer]
    time_taken_seconds: Optional[int] = 0