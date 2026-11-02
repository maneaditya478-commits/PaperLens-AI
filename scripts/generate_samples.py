"""
Generates synthetic sample documents for demonstration in PaperLens AI.
Uses PyMuPDF to create clean, standard PDF documents with clauses and layouts.
"""
from pathlib import Path
import pymupdf

BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLES_DIR = BASE_DIR / "data" / "samples"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

def create_synthetic_appointment_letter():
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842) # A4

    text = """TECHCORP INNOVATIONS PRIVATE LIMITED
Regd Office: Prestige Tech Park, Marathahalli, Bengaluru, Karnataka 560103
CIN: U72200KA2020PTC123456 | Website: www.techcorp-example.com

CONFIDENTIAL - LETTER OF APPOINTMENT

Date: 15-February-2026
To:
Aditya Mane
Employee ID: TC-8492
Designation: Senior Software Development Engineer

Dear Aditya,

We have great pleasure in offering you the position of Senior Software Development Engineer with TechCorp Innovations Private Limited. This appointment is effective from your date of joining, 02-March-2026.

1. COMPENSATION AND BENEFITS:
Your Total Cost to Company (CTC) shall be INR 16,50,000/- (Rupees Sixteen Lakh Fifty Thousand only) per annum. The detailed breakdown including Basic, HRA, Provident Fund, and Performance Bonus is enclosed in Annexure A.

2. PROBATION AND CONFIRMATION:
You will be on probation for a period of 6 months from the date of joining. During this probationary period, either party may terminate this employment agreement by providing 30 days written notice. Upon satisfactory performance evaluation, your employment will be confirmed in writing.

3. NOTICE PERIOD AND RESIGNATION:
Subsequent to confirmation, either party may terminate employment by giving 90 days prior written notice or gross salary in lieu thereof. The Company reserves the right to waive or shorten the notice period at its sole discretion upon complete project handover.

4. NON-COMPETE AND RESTRICTIVE COVENANTS:
During the term of your employment and for a period of 12 months following termination thereof, you shall not directly or indirectly engage in, consult for, or establish any business that directly competes with the proprietary SaaS products developed by the Company.

5. CONFIDENTIALITY AND PROPRIETARY INFORMATION:
You agree to maintain strict confidentiality regarding all trade secrets, source code, algorithm blueprints, customer databases, and financial data of the Company. This confidentiality obligation shall survive the termination of your employment indefinitely.

6. GOVERNING LAW AND JURISDICTION:
This agreement shall be governed by and construed in accordance with the laws of India. The courts at Bengaluru shall have exclusive jurisdiction over any disputes arising hereunder.

Accepted and Agreed:

_______________________                _______________________
Authorized Signatory                   Candidate Signature
TechCorp Innovations Pvt Ltd           Aditya Mane
"""
    rect = pymupdf.Rect(50, 50, 545, 800)
    page.insert_textbox(rect, text, fontsize=10, fontname="helv")
    out_path = SAMPLES_DIR / "synthetic_appointment_letter.pdf"
    doc.save(str(out_path))
    doc.close()
    print(f"Generated: {out_path}")

def create_synthetic_employment_bond():
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)

    text = """APEX AEROSPACE TECHNOLOGIES INDIA LIMITED
Cyber City, Tower 4, Gurugram, Haryana 122002

SPECIALIZED SERVICE AGREEMENT AND TRAINING BOND

This Service Agreement is executed on this 10th day of January 2026 by and between:
Apex Aerospace Technologies India Limited (hereinafter referred to as the 'Company')
AND
Rahul Sharma, residing at Pune, Maharashtra (hereinafter referred to as the 'Trainee/Employee').

WHEREAS:
The Company has agreed to sponsor an intensive advanced avionics simulation training certification program costing substantial capital expenditure.

NOW THEREFORE, IT IS MUTUALLY AGREED AS FOLLOWS:

1. MINIMUM SERVICE COMMITMENT PERIOD:
The Trainee agrees to diligently serve the Company for a minimum continuous service commitment period of 24 months (2 years) commencing from the successful completion of the specialized training module.

2. LIQUIDATED DAMAGES FOR EARLY DEPARTURE:
In the event the Employee tenders resignation, abandons service, or commits breach resulting in termination prior to completing the 24-month commitment tenure, the Employee agrees to reimburse the Company a sum of INR 2,50,000/- (Rupees Two Lakh Fifty Thousand only) as pre-estimated liquidated damages towards training costs.

3. NOTICE PERIOD:
The Trainee must provide 60 days written advance notice for any departure after completing the mandatory bond tenure. No notice buyout is permitted during the active bond duration.

4. RELIEVING AND CLEARANCE:
The Company reserves the right to withhold formal Relieving Letter and Experience Certificate pending the full settlement of liquidated training damages and asset clearances.

IN WITNESS WHEREOF, the parties have signed this Agreement on the day and year first written above.

_______________________                _______________________
Company Representative                 Employee / Trainee Signature
"""
    rect = pymupdf.Rect(50, 50, 545, 800)
    page.insert_textbox(rect, text, fontsize=10, fontname="helv")
    out_path = SAMPLES_DIR / "synthetic_employment_bond.pdf"
    doc.save(str(out_path))
    doc.close()
    print(f"Generated: {out_path}")

def create_synthetic_nda():
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)

    text = """MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Non-Disclosure Agreement (the 'Agreement') is entered into as of 01-February-2026 by and between:
Alpha Innovations Lab Pvt Ltd ('Disclosing Party')
AND
Beta Engineering Systems LLP ('Receiving Party').

1. DEFINITION OF CONFIDENTIAL INFORMATION:
Confidential Information includes all non-public technical, architectural, business, customer, code, and financial information disclosed whether in oral, written, or electronic form.

2. OBLIGATIONS OF RECEIVING PARTY:
The Receiving Party shall:
(a) Hold all Confidential Information in strict confidence using no less than reasonable care.
(b) Not disclose, publish, or disseminate Confidential Information to any third party without prior written consent.
(c) Restrict disclosure solely to employees with a genuine need-to-know who have signed equivalent covenants.

3. EXCLUSIONS FROM CONFIDENTIALITY:
This Agreement does not apply to information that:
(a) Is or becomes publicly known without breach of this Agreement.
(b) Was already in the Receiving Party's rightful possession without restriction prior to disclosure.
(c) Is independently developed without reference to the Disclosing Party's proprietary data.

4. TERM AND SURVIVAL:
The obligations under this Agreement shall survive for a period of 3 years following the date of termination or completion of business discussions.

5. INJUNCTIVE RELIEF:
The parties acknowledge that monetary damages alone would be inadequate for a breach of confidentiality, and the aggrieved party shall be entitled to seek injunctive relief in a court of competent jurisdiction.
"""
    rect = pymupdf.Rect(50, 50, 545, 800)
    page.insert_textbox(rect, text, fontsize=10, fontname="helv")
    out_path = SAMPLES_DIR / "synthetic_nda.pdf"
    doc.save(str(out_path))
    doc.close()
    print(f"Generated: {out_path}")

def create_synthetic_domicile_certificate():
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)

    text = """GOVERNMENT OF MAHARASHTRA
REVENUE DEPARTMENT - OFFICE OF THE TAHSILDAR, HAVELI, PUNE
AAPLE SARKAR DIGITAL SERVICES PORTAL

BARCODE / QR VERIFICATION ID: MH-PUN-DOM-2026-981723

DOMICILE AND AGE CERTIFICATE
(Issued under Section 3 of the Maharashtra Government Services Rules)

This is to certify that:

Candidate Name: Shri Aditya Suresh Mane
Father's Name: Suresh Ramchandra Mane
Mother's Name: Sunita Suresh Mane
Permanent Address: Flat 402, Shivneri Heights, Kothrud, Pune, Maharashtra 411038

It is verified from the school records, municipal birth entry, and local revenue inquiry that the applicant has been continuously residing in the State of Maharashtra for a period of more than 15 years immediately preceding the date of this application.

Hence, it is certified that Shri Aditya Suresh Mane is a permanent resident and holds Domicile of the State of Maharashtra.

Date of Issue: 18-January-2026
Place: Pune

Digitally Signed by:
Tahsildar & Executive Magistrate
Haveli Taluka, District Pune
Government of Maharashtra

Note: This is a digitally signed certificate verified online at aaplesarkar.mahaonline.gov.in. No physical signature or wet seal is required.
"""
    rect = pymupdf.Rect(50, 50, 545, 800)
    page.insert_textbox(rect, text, fontsize=10, fontname="helv")
    out_path = SAMPLES_DIR / "synthetic_domicile_certificate.pdf"
    doc.save(str(out_path))
    doc.close()
    print(f"Generated: {out_path}")

if __name__ == "__main__":
    create_synthetic_appointment_letter()
    create_synthetic_employment_bond()
    create_synthetic_nda()
    create_synthetic_domicile_certificate()
    print("All synthetic sample documents generated successfully.")
