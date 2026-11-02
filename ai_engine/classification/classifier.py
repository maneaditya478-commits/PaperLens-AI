from typing import Dict, Any, Tuple
import re

class DocumentClassifier:
    """
    Classifies documents into the 6 core categories and determines granular document sub-types.
    """

    CATEGORIES = {
        "employment": {
            "keywords": [
                "appointment", "offer letter", "employment", "probation", "salary", "ctc",
                "notice period", "resignation", "employer", "employee", "bond", "nda",
                "non-disclosure", "payslip", "relieving", "experience letter", "joining date",
                "human resources", "hr", "appraisal", "bonus", "annual package"
            ],
            "sub_types": [
                ("Appointment Letter", ["appointment", "appointed as", "terms of appointment", "reporting manager"]),
                ("Offer Letter", ["offer of employment", "pleased to offer", "conditional offer", "offer letter"]),
                ("Employment Bond", ["bond", "service agreement", "liquidated damages", "training cost", "minimum service period"]),
                ("Non-Disclosure Agreement (NDA)", ["non-disclosure", "confidential information", "proprietary information", "trade secret"]),
                ("Employment Agreement", ["employment agreement", "contract of employment", "master services"]),
                ("Payslip", ["earnings", "deductions", "basic pay", "hra", "pf", "net pay", "provident fund"]),
                ("Relieving Letter", ["relieved from duties", "relieving order", "last working day", "acceptance of resignation"]),
                ("Experience Certificate", ["experience certificate", "to whomsoever it may concern", "worked as", "tenure"]),
                ("Internship Agreement", ["internship", "stipend", "intern", "learning objective"]),
                ("Employee Handbook", ["code of conduct", "workplace policies", "disciplinary procedure", "handbook"])
            ]
        },
        "government": {
            "keywords": [
                "government of india", "aadhaar", "uidai", "pan", "income tax department",
                "passport", "domicile", "tahsildar", "collector", "caste certificate",
                "income certificate", "birth certificate", "driving licence", "rto",
                "e-governance", "aaple sarkar", "digilocker", "gazette", "statutory"
            ],
            "sub_types": [
                ("Aadhaar Document", ["uidai", "aadhaar", "unique identification authority", "enrolment"]),
                ("PAN Card / Acknowledgement", ["permanent account number", "income tax department", "form 49a", "utiitsl", "nsdl"]),
                ("Indian Passport Document", ["passport", "republic of india", "consular", "regional passport office"]),
                ("Domicile Certificate", ["domicile", "resident certificate", "ordinarily resident", "mahaonline", "tehsildar"]),
                ("Income Certificate", ["income certificate", "annual family income", "competent authority"]),
                ("Caste / Tribe Certificate", ["caste certificate", "scheduled caste", "scheduled tribe", "obc", "caste validity"]),
                ("Birth Certificate", ["birth certificate", "registration of births", "municipal corporation"]),
                ("Driving Licence", ["driving licence", "motor vehicles department", "rto", "transport authority"])
            ]
        },
        "education": {
            "keywords": [
                "university", "board", "marksheet", "degree", "diploma", "migration",
                "transfer certificate", "bonafide", "transcript", "convocation", "curriculum",
                "semester", "cgpa", "grade point", "college", "school"
            ],
            "sub_types": [
                ("Degree Certificate", ["degree of bachelor", "master of", "conferred upon", "convocation"]),
                ("Marksheet / Transcript", ["statement of marks", "semester", "grade sheet", "cgpa"]),
                ("Migration Certificate", ["migration certificate", "leaving certificate", "transfer"]),
                ("Bonafide Certificate", ["bonafide student", "studying in", "regular student"])
            ]
        },
        "financial": {
            "keywords": [
                "bank", "loan", "mortgage", "account statement", "interest rate", "emi",
                "credit card", "sanction letter", "borrower", "lender", "collateral", "hypothecation"
            ],
            "sub_types": [
                ("Bank Loan Agreement", ["loan agreement", "sanction letter", "emi", "borrower", "principal sum"]),
                ("Account Statement", ["account statement", "transaction history", "debit", "credit balance"]),
                ("Fixed Deposit Receipt", ["fixed deposit", "maturity amount", "term deposit"])
            ]
        },
        "legal": {
            "keywords": [
                "affidavit", "power of attorney", "notary", "court", "lease", "rent agreement",
                "tenant", "landlord", "licensee", "licensor", "jurisdiction", "arbitration"
            ],
            "sub_types": [
                ("Rental / Lease Agreement", ["lease agreement", "rent agreement", "tenant", "landlord", "security deposit"]),
                ("General Power of Attorney", ["power of attorney", "appoint and constitute", "attorney-in-fact"]),
                ("Affidavit", ["affidavit", "solemnly affirm", "deponent", "oath"])
            ]
        },
        "insurance": {
            "keywords": [
                "insurance", "policy", "premium", "sum assured", "claim", "coverage",
                "mediclaim", "nominee", "third party liability", "cashless", "tpa"
            ],
            "sub_types": [
                ("Health Insurance Policy", ["health insurance", "mediclaim", "tpa", "cashless hospital", "pre-existing"]),
                ("Life Insurance Policy", ["life insurance", "sum assured", "term life", "death benefit", "maturity"]),
                ("Motor Vehicle Insurance", ["motor insurance", "comprehensive cover", "own damage", "third party liability"])
            ]
        }
    }

    def classify(self, text: str, filename: str = "") -> Dict[str, Any]:
        combined_text = f"{filename} {text}".lower()

        category_scores: Dict[str, int] = {}
        for cat, data in self.CATEGORIES.items():
            score = 0
            for kw in data["keywords"]:
                if kw in combined_text:
                    score += 2 if len(kw) > 8 else 1
            category_scores[cat] = score

        # Determine winner
        best_category = max(category_scores, key=category_scores.get)
        max_score = category_scores[best_category]

        if max_score == 0:
            best_category = "employment"
            confidence = 0.50
        else:
            total_score = sum(category_scores.values()) or 1
            confidence = min(0.99, max(0.65, round(max_score / total_score + 0.35, 2)))

        # Sub-type matching
        sub_type = self._detect_sub_type(best_category, combined_text)

        return {
            "category": best_category,
            "sub_type": sub_type,
            "confidence": confidence,
            "category_scores": category_scores
        }

    def _detect_sub_type(self, category: str, text: str) -> str:
        cat_data = self.CATEGORIES.get(category, {})
        for st_name, keywords in cat_data.get("sub_types", []):
            matches = sum(1 for kw in keywords if kw in text)
            if matches >= 2 or (len(keywords) == 1 and matches == 1):
                return st_name

        # Fallbacks based on category
        defaults = {
            "employment": "Employment Document",
            "government": "Government Certificate / ID",
            "education": "Educational Document",
            "financial": "Financial Document",
            "legal": "Legal Document",
            "insurance": "Insurance Policy"
        }
        return defaults.get(category, "General Document")

document_classifier = DocumentClassifier()
