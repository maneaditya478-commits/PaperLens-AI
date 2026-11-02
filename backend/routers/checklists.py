import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import UserChecklist
from backend.schemas import ChecklistGenerateRequest, ChecklistGenerateResponse, ChecklistItem

router = APIRouter(prefix="/api/checklists", tags=["Checklists"])

CHECKLIST_TEMPLATES = {
    "joining_company": {
        "title": "Onboarding & Joining Checklist (Corporate / Tech)",
        "description": "Essential documents demanded by corporate HR and Background Verification (BGV) teams upon joining.",
        "verification_authority": "Employing Corporation & Authorized BGV Agency (e.g. AuthBridge / First Advantage)",
        "items": [
            {
                "name": "Signed Appointment / Offer Letter",
                "category": "Employment",
                "required": True,
                "where_to_obtain": "Signed copy from new employer HR",
                "why_required": "Validates official onboarding and mutual acceptance of compensation terms.",
                "official_url": "https://labour.gov.in/",
                "supporting_docs": ["Countersigned acceptance"]
            },
            {
                "name": "Relieving Letter from Previous Employer",
                "category": "Employment",
                "required": True,
                "where_to_obtain": "Previous employer HR on Last Working Day",
                "why_required": "Confirms formal release from previous employer and avoids dual-employment conflicts.",
                "official_url": "https://labour.gov.in/",
                "supporting_docs": ["No Dues Clearance Certificate"]
            },
            {
                "name": "Experience Certificate",
                "category": "Employment",
                "required": True,
                "where_to_obtain": "Previous employer HR",
                "why_required": "Authenticates past employment tenure, title, and seniority band.",
                "official_url": "https://labour.gov.in/",
                "supporting_docs": ["Service history"]
            },
            {
                "name": "Last 3 Months Salary Payslips",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Previous employer HRMS portal",
                "why_required": "Verifies salary compensation baseline and tax deductions.",
                "official_url": "https://www.epfindia.gov.in/",
                "supporting_docs": ["Bank statement showing salary credit"]
            },
            {
                "name": "Aadhaar Card (Masked) & PAN Card",
                "category": "Government ID",
                "required": True,
                "where_to_obtain": "UIDAI (m-Aadhaar) & Income Tax Department",
                "why_required": "Statutory requirement for Provident Fund (UAN) generation and TDS tax compliance.",
                "official_url": "https://uidai.gov.in/",
                "supporting_docs": ["DigiLocker verified copy"]
            },
            {
                "name": "Highest Degree Certificate & Consolidated Marksheet",
                "category": "Education",
                "required": True,
                "where_to_obtain": "Graduating University / College Registrar",
                "why_required": "Verifies academic eligibility and graduation credentials during BGV.",
                "official_url": "https://www.ugc.gov.in/",
                "supporting_docs": ["Convocation certificate / Provisional certificate"]
            },
            {
                "name": "Cancelled Cheque or Bank Passbook Copy",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Bank branch or netbanking portal",
                "why_required": "Ensures accurate salary account IFSC and account number configuration.",
                "official_url": "https://www.rbi.org.in/",
                "supporting_docs": ["MICR / IFSC code leaf"]
            },
            {
                "name": "Form 16 / Tax Deduction Certificate",
                "category": "Financial",
                "required": False,
                "where_to_obtain": "Previous employer payroll department",
                "why_required": "Allows current employer to compute cumulative income tax and avoid double deduction.",
                "official_url": "https://www.incometax.gov.in/",
                "supporting_docs": ["Part A & Part B of Form 16"]
            }
        ]
    },
    "passport": {
        "title": "Fresh Indian Passport Application Checklist",
        "description": "Standard documentation mandated by Regional Passport Office (RPO) and Passport Seva Kendra (PSK).",
        "verification_authority": "Passport Seva Kendra (PSK) & Local Police Verification Bureau",
        "items": [
            {
                "name": "Proof of Date of Birth (Birth Certificate / 10th Certificate)",
                "category": "Identity",
                "required": True,
                "where_to_obtain": "Municipal Corporation or School Education Board",
                "why_required": "Statutory verification of birth date and place under Passports Act 1967.",
                "official_url": "https://www.passportindia.gov.in/",
                "supporting_docs": ["Birth certificate issued by Registrar"]
            },
            {
                "name": "Proof of Present Address (Aadhaar / Bank Passbook / Electricity Bill)",
                "category": "Address",
                "required": True,
                "where_to_obtain": "UIDAI / Nationalized Bank / Utility Provider",
                "why_required": "Jurisdiction determination for local police station verification inquiry.",
                "official_url": "https://www.passportindia.gov.in/",
                "supporting_docs": ["Passbook with photo stamped by branch manager"]
            },
            {
                "name": "Proof of ECNR Status (10th Pass Certificate or Degree)",
                "category": "Education",
                "required": True,
                "where_to_obtain": "Education Board (CBSE/ICSE/State Board) or University",
                "why_required": "Grants Emigration Check Not Required status for smooth international travel.",
                "official_url": "https://www.passportindia.gov.in/",
                "supporting_docs": ["Matriculation mark sheet"]
            },
            {
                "name": "PAN Card / Voter ID",
                "category": "Government ID",
                "required": False,
                "where_to_obtain": "Income Tax Department / Election Commission of India",
                "why_required": "Supplementary proof of identity for faster verification.",
                "official_url": "https://www.nvsp.in/",
                "supporting_docs": ["Physical card"]
            }
        ]
    },
    "government_certificate": {
        "title": "State Domicile & Income Certificate Checklist",
        "description": "Mandatory proofs required by Tahsildar / SDM office for state certificates.",
        "verification_authority": "Revenue Department & Talathi / Circle Officer (Aaple Sarkar / e-District)",
        "items": [
            {
                "name": "Proof of 15-Year Continuous Residence",
                "category": "Residence",
                "required": True,
                "where_to_obtain": "Old ration cards, school leaving certificates, light bills spanning 15 years",
                "why_required": "Establishes permanent residency status under State Domicile Rules.",
                "official_url": "https://aaplesarkar.mahaonline.gov.in/",
                "supporting_docs": ["15 years chronological residence evidence"]
            },
            {
                "name": "School Leaving Certificate (TC) showing Birthplace",
                "category": "Education",
                "required": True,
                "where_to_obtain": "Primary / Secondary school attended",
                "why_required": "Definitive evidence of birthplace within the state borders.",
                "official_url": "https://aaplesarkar.mahaonline.gov.in/",
                "supporting_docs": ["Original or countersigned TC"]
            },
            {
                "name": "Income Affidavit / Salary Slip / Form 16",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Notary Public / Employer / Talathi income report",
                "why_required": "Establishes gross family income for fee waivers and scholarships.",
                "official_url": "https://aaplesarkar.mahaonline.gov.in/",
                "supporting_docs": ["Affidavit on Rs 100 stamp paper"]
            },
            {
                "name": "Ration Card or Electricity Bill",
                "category": "Address",
                "required": True,
                "where_to_obtain": "Civil Supplies Department / MSEDCL / Local DISCOM",
                "why_required": "Validates household address and family composition.",
                "official_url": "https://aaplesarkar.mahaonline.gov.in/",
                "supporting_docs": ["Recent utility bill"]
            }
        ]
    },
    "college_admission": {
        "title": "College & Professional Degree Admission Checklist",
        "description": "Comprehensive document checklist for undergraduate and postgraduate university admissions.",
        "verification_authority": "University Admission Scrutiny Cell & Directorate of Technical Education (DTE)",
        "items": [
            {
                "name": "10th (SSC) & 12th (HSC) Marksheets",
                "category": "Education",
                "required": True,
                "where_to_obtain": "School Board / DigiLocker",
                "why_required": "Primary qualification and date of birth proof.",
                "official_url": "https://www.digilocker.gov.in/",
                "supporting_docs": ["Passing certificate"]
            },
            {
                "name": "Entrance Exam Scorecard (e.g. JEE, NEET, MHT-CET, CAT)",
                "category": "Entrance",
                "required": True,
                "where_to_obtain": "NTA / State Examination Cell portal",
                "why_required": "Merit rank validation for centralized allotment (CAP) rounds.",
                "official_url": "https://cetcell.mahacet.org/",
                "supporting_docs": ["Admit card and scorecard"]
            },
            {
                "name": "College Leaving / Transfer Certificate (TC)",
                "category": "Education",
                "required": True,
                "where_to_obtain": "Last institution attended",
                "why_required": "Proves formal release and good conduct from previous college/school.",
                "official_url": "https://www.ugc.gov.in/",
                "supporting_docs": ["Original Transfer Certificate"]
            },
            {
                "name": "Domicile & Nationality Certificate",
                "category": "Government",
                "required": True,
                "where_to_obtain": "Tahsildar / Aaple Sarkar portal",
                "why_required": "Required for state quota seat eligibility and category scholarships.",
                "official_url": "https://aaplesarkar.mahaonline.gov.in/",
                "supporting_docs": ["Domicile certificate"]
            },
            {
                "name": "Caste Certificate & Caste Validity (if applicable)",
                "category": "Reservation",
                "required": False,
                "where_to_obtain": "Sub-Divisional Magistrate & Divisional Caste Scrutiny Committee",
                "why_required": "Mandatory for claiming reserved category seats in professional courses.",
                "official_url": "https://barti.maharashtra.gov.in/",
                "supporting_docs": ["Non-Creamy Layer Certificate (NCL) for OBC"]
            },
            {
                "name": "Migration Certificate (for other state or board candidates)",
                "category": "Education",
                "required": False,
                "where_to_obtain": "Previous Board or University Registrar",
                "why_required": "Mandatory when changing universities or educational boards.",
                "official_url": "https://www.cbse.gov.in/",
                "supporting_docs": ["Original migration certificate"]
            }
        ]
    },
    "bank_loan": {
        "title": "Home / Personal / Education Bank Loan Checklist",
        "description": "Standard underwriting verification checklist mandated by RBI-regulated banking institutions.",
        "verification_authority": "Bank Loan Credit Processing Centre (CPC)",
        "items": [
            {
                "name": "Identity Proof (PAN Card & Aadhaar)",
                "category": "KYC",
                "required": True,
                "where_to_obtain": "Income Tax Dept / UIDAI",
                "why_required": "Mandatory KYC under RBI master guidelines.",
                "official_url": "https://www.rbi.org.in/",
                "supporting_docs": ["Original for in-person verification"]
            },
            {
                "name": "Last 6 Months Bank Statement",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Salary / Operating bank branch or netbanking",
                "why_required": "Evaluates average monthly balance, salary credits, and existing EMI commitments.",
                "official_url": "https://www.rbi.org.in/",
                "supporting_docs": ["Bank-stamped e-statement"]
            },
            {
                "name": "Last 3 Years Income Tax Returns (ITR) with Computation",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Income Tax e-filing portal (incometax.gov.in)",
                "why_required": "Confirms financial track record, debt-to-income ratio, and declared taxable income.",
                "official_url": "https://www.incometax.gov.in/",
                "supporting_docs": ["ITR-V Acknowledgement"]
            },
            {
                "name": "Property Sale Deed / Chain of Title Deeds (for Home Loan)",
                "category": "Property",
                "required": False,
                "where_to_obtain": "Sub-Registrar office / Seller",
                "why_required": "Enables legal scrutiny and equitable mortgage creation on collateral.",
                "official_url": "https://igrmaharashtra.gov.in/",
                "supporting_docs": ["Encumbrance certificate (EC)"]
            }
        ]
    },
    "insurance": {
        "title": "Health & Life Insurance Policy Purchase Checklist",
        "description": "Pre-underwriting documentation required by IRDAI-registered insurance companies.",
        "verification_authority": "Insurance Underwriting & Medical Evaluation Committee (IRDAI)",
        "items": [
            {
                "name": "Identity & Address Proof (Aadhaar / Voter ID / Passport)",
                "category": "KYC",
                "required": True,
                "where_to_obtain": "Government issuing authority",
                "why_required": "IRDAI anti-money laundering and policyholder KYC norms.",
                "official_url": "https://irdai.gov.in/",
                "supporting_docs": ["PAN Card"]
            },
            {
                "name": "Proof of Income (Salary Slips / Form 16 / ITR)",
                "category": "Financial",
                "required": True,
                "where_to_obtain": "Employer or Income Tax Portal",
                "why_required": "Validates financial underwriting and eligibility for desired Sum Assured.",
                "official_url": "https://irdai.gov.in/",
                "supporting_docs": ["Bank statements"]
            },
            {
                "name": "Medical History / Pre-Existing Disease Reports",
                "category": "Medical",
                "required": True,
                "where_to_obtain": "Treating physician / diagnostic lab",
                "why_required": "Utmost Good Faith (Uberrimae Fidei) declaration to prevent claim rejection.",
                "official_url": "https://irdai.gov.in/",
                "supporting_docs": ["Discharge summaries, prescription records"]
            }
        ]
    }
}

@router.post("/generate", response_model=ChecklistGenerateResponse)
def generate_checklist(
    payload: ChecklistGenerateRequest,
    db: Session = Depends(get_db)
):
    situation_key = payload.situation.lower().replace(" ", "_")
    # match best situation
    matched_key = None
    for k in CHECKLIST_TEMPLATES:
        if k in situation_key or situation_key in k:
            matched_key = k
            break

    if not matched_key:
        matched_key = "joining_company" # Default to employment

    template = CHECKLIST_TEMPLATES[matched_key]
    items_list = []

    for idx, it in enumerate(template["items"]):
        items_list.append(ChecklistItem(
            id=f"{matched_key}_{idx+1}",
            name=it["name"],
            category=it["category"],
            required=it["required"],
            status="pending",
            where_to_obtain=it["where_to_obtain"],
            why_required=it["why_required"],
            official_url=it.get("official_url"),
            supporting_docs=it.get("supporting_docs", [])
        ))

    total_req = sum(1 for it in items_list if it.required)
    total_opt = sum(1 for it in items_list if not it.required)

    # Save to DB for persistence
    db_checklist = UserChecklist(
        situation=matched_key,
        title=template["title"],
        description=template["description"],
        items=[it.model_dump() for it in items_list]
    )
    db.add(db_checklist)
    db.commit()

    return ChecklistGenerateResponse(
        situation=matched_key,
        title=template["title"],
        description=template["description"],
        items=items_list,
        total_required=total_req,
        total_optional=total_opt,
        verification_authority=template["verification_authority"]
    )
