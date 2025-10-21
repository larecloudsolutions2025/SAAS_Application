from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProfile, Session as DBSession
from app.schemas import UserCreate, UserResponse
from datetime import datetime, timedelta
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import secrets, random, smtplib
from email.mime.text import MIMEText

router = APIRouter(tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SESSION_EXPIRY_HOURS = 24
otp_store = {}  # temporary OTP storage

# --------- UTILS ---------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ✅ Production version: send email using Gmail SMTP
def send_email(to_email: str, subject: str, body: str):
    sender = "abhishekkollipara157@gmail.com"
    password = "cqft sddu qkvl xaec"
    smtp_server = "smtp.gmail.com"
    port = 587

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    try:
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, [to_email], msg.as_string())
    except Exception as e:
        print("Email error:", e)
        raise HTTPException(status_code=500, detail="Failed to send email")

# --------- SIGNUP ---------
@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        created_at=datetime.utcnow(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = UserProfile(
        user_id=new_user.id,
        full_name=user.full_name,
        dob=user.dob,
        gender=user.gender
    )
    db.add(profile)
    db.commit()

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        full_name=profile.full_name,
        dob=profile.dob,
        gender=profile.gender,
    )

# --------- LOGIN ---------
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = secrets.token_hex(32)
    expires_at = datetime.utcnow() + timedelta(hours=SESSION_EXPIRY_HOURS)

    db_session = DBSession(user_id=user.id, token=token, expires_at=expires_at, active=True)
    db.add(db_session)
    db.commit()

    # ✅ cookie correctly configured for cross-origin localhost requests
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        max_age=SESSION_EXPIRY_HOURS * 3600,
        samesite="Lax",
    )

    return {"msg": "Login successful", "username": user.username, "email": user.email}

# --------- CURRENT USER ---------
def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db_session = db.query(DBSession).filter_by(token=token, active=True).first()
    if not db_session or db_session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = db.query(User).filter(User.id == db_session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# --------- PROFILE ---------
class ProfileUpdate(BaseModel):
    full_name: str
    dob: str
    gender: str

@router.get("/profile")
def get_profile(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile": {
            "full_name": user.profile.full_name,
            "dob": user.profile.dob,
            "gender": user.profile.gender,
        },
    }

@router.put("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = user.profile
    profile.full_name = data.full_name
    profile.dob = data.dob
    profile.gender = data.gender
    db.commit()
    return {"msg": "Profile updated", "profile": data.dict()}

# --------- FORGOT PASSWORD ---------
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = str(random.randint(100000, 999999))
    otp_store[req.email] = otp
    send_email(req.email, "Password Reset OTP", f"Your OTP is {otp}")
    return {"msg": "OTP sent to email"}

class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str

@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    if req.email not in otp_store or otp_store[req.email] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"msg": "OTP verified"}

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    user.password = hash_password(req.new_password)
    db.commit()
    if req.email in otp_store:
        del otp_store[req.email]
    return {"msg": "Password reset successful"}