# seed_mocktests.py
from datetime import datetime
from app.database import SessionLocal
from app import models

db = SessionLocal()

def insert_mocktest(name, exam_type, test_type, subject, file_path, total_questions, duration_minutes):
    """Insert mock test only if not already present."""
    existing = (
        db.query(models.MockTestFile)
        .filter(models.MockTestFile.name == name)
        .first()
    )
    if existing:
        print(f"⚠️ Skipped (already exists): {name}")
        return existing

    mocktest = models.MockTestFile(
        name=name,
        exam_type=exam_type,
        test_type=test_type,
        subject=subject,
        file_path=file_path,
        total_questions=total_questions,
        duration_minutes=duration_minutes,
    )

    db.add(mocktest)
    db.commit()
    db.refresh(mocktest)
    print(f"✅ Inserted: {name} (ID: {mocktest.id})")
    return mocktest


# --- Full Mock Tests ---
insert_mocktest(
    name="SBI PO Prelims - Demo Test 1",
    exam_type="SBI PO",
    test_type="full",
    subject=None,
    file_path="app/excel_files/sbi_po_prelims_test_1_full.xlsx",
    total_questions=45,
    duration_minutes=60
)

insert_mocktest(
    name="SBI PO Prelims - Full Mock Test 2",
    exam_type="SBI PO",
    test_type="full",
    subject=None,
    file_path="app/excel_files/sbi_po_prelims_test_2_full.xlsx",
    total_questions=100,
    duration_minutes=60
)

# --- Subject-wise Mock Tests ---
insert_mocktest(
    name="Aptitude Test 1",
    exam_type="SBI PO",
    test_type="subject",
    subject="Aptitude",
    file_path="app/excel_files/sbi_po_aptitude_test_1.xlsx",
    total_questions=35,
    duration_minutes=20
)

insert_mocktest(
    name="Reasoning Test 1",
    exam_type="SBI PO",
    test_type="subject",
    subject="Reasoning",
    file_path="app/excel_files/sbi_po_reasoning_test_1.xlsx",
    total_questions=35,
    duration_minutes=20
)

insert_mocktest(
    name="English Test 1",
    exam_type="SBI PO",
    test_type="subject",
    subject="English",
    file_path="app/excel_files/sbi_po_english_test_1.xlsx",
    total_questions=40,
    duration_minutes=20
)

db.close()
print("🏁 Seeding completed.")
