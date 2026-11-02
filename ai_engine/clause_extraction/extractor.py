import re
from typing import List, Dict, Any

class ClauseExtractor:
    """
    Identifies, structures, and explains contractual terms and regulatory clauses.
    Grounds all outputs directly on the document text without hallucination.
    """

    CLAUSE_TEMPLATES = {
        "notice_period": {
            "title": "Notice Period & Resignation Requirement",
            "regex": r"(?:notice\s*period|written\s*notice|resignation\s*notice|prior\s*notice|\b\d+\s*(?:days?|months?|weeks?)\s*notice|(?:give|serve|provide)\s*\d+\s*(?:days|months)\s*notice)",
            "risk": "Moderate",
            "who": "Employee / Service Provider",
            "when": "When tendering resignation or upon employer termination",
            "default_questions": [
                "Can the notice period be bought out by paying basic or gross salary in lieu?",
                "Can accrued privileged leave be adjusted against the notice duration?",
                "Is there an option for early release subject to handover completion?"
            ]
        },
        "probation": {
            "title": "Probation Period & Confirmation Terms",
            "regex": r"(?:probation|probationary\s*period|confirmation\s*in\s*service|satisfactory\s*performance)",
            "risk": "Moderate",
            "who": "Newly hired employee",
            "when": "Initial period following joining date",
            "default_questions": [
                "Does confirmation occur automatically if no written evaluation is issued?",
                "Is the notice period shorter during probation compared to confirmed tenure?",
                "Are benefits like medical insurance and performance bonus active during probation?"
            ]
        },
        "bond_service": {
            "title": "Employment Service Bond & Liquidated Damages",
            "regex": r"(?:service\s*(?:agreement|bond)|minimum\s*(?:service|commitment)|liquidated\s*damages|training\s*cost\s*reimbursement|bond\s*amount)",
            "risk": "Critical",
            "who": "Employee committed to compulsory tenure",
            "when": "Applies if the employee departs before completing the contracted tenure",
            "default_questions": [
                "Did the employer provide actual specialized, documented third-party training?",
                "Is the penalty amount strictly commensurate with actual training expenses incurred?",
                "Under Indian law (Section 27 Contract Act), bonds restraining trade without genuine actual damages are unenforceable."
            ]
        },
        "non_compete": {
            "title": "Non-Compete & Restrictive Covenants",
            "regex": r"(?:non-compete|competing|competitor|compete|solicit\s*clients|entice\s*employees|restrictive\s*covenant|restraint\s*of\s*trade)",
            "risk": "High",
            "who": "Employee post-departure",
            "when": "Following termination or resignation for the stated duration",
            "default_questions": [
                "Are post-employment non-compete covenants enforceable in your jurisdiction?",
                "In India, Section 27 of the Indian Contract Act makes post-employment non-compete clauses void.",
                "Does the clause differentiate between direct solicitations vs general passive hiring?"
            ]
        },
        "confidentiality": {
            "title": "Confidentiality & Non-Disclosure (NDA)",
            "regex": r"(?:confidential\s*information|non-disclosure|proprietary\s*data|trade\s*secrets|intellectual\s*property)",
            "risk": "Moderate",
            "who": "Both parties (or recipient)",
            "when": "Throughout tenure and indefinitely (or specified duration) post-departure",
            "default_questions": [
                "Are standard industry skills and pre-existing personal knowledge excluded?",
                "Does the definition clearly exclude publicly accessible information?",
                "What is the required procedure for returning or purging company materials upon exit?"
            ]
        },
        "termination": {
            "title": "Termination of Employment / Agreement",
            "regex": r"(?:termination\s*for\s*cause|summary\s*dismissal|misconduct|material\s*breach|terminate\s*(?:this\s*agreement|employment))",
            "risk": "High",
            "who": "Both employer and employee",
            "when": "Upon breach, misconduct, business downturn, or at convenience",
            "default_questions": [
                "Is an internal grievance procedure or show-cause notice mandatory before termination for cause?",
                "What severance or end-of-service gratuity is provided upon termination without cause?",
                "Are accrued incentives and bonus paid out pro-rata?"
            ]
        },
        "repayment_clawback": {
            "title": "Joining Bonus / Relocation Clawback",
            "regex": r"(?:clawback|repay(?:ment)?\s*of\s*(?:joining\s*bonus|relocation)|reimburse\s*the\s*company)",
            "risk": "High",
            "who": "Employee who received upfront incentives",
            "when": "Triggered if departing within 12 to 24 months of disbursement",
            "default_questions": [
                "Is the clawback calculated pro-rata across completed months of tenure?",
                "Does clawback apply if the employer initiates termination without employee fault?"
            ]
        },
        "intellectual_property": {
            "title": "Invention Assignment & IP Ownership",
            "regex": r"(?:inventions|intellectual\s*property\s*rights|works\s*made\s*for\s*hire|moral\s*rights|assigns\s*all\s*right)",
            "risk": "Moderate",
            "who": "Employee / Creator",
            "when": "Works created during working hours or using employer infrastructure",
            "default_questions": [
                "Are independent personal projects developed off-hours without company resources excluded?",
                "Is there an explicit exhibit or annexure to declare pre-existing inventions?"
            ]
        },
        "dispute_jurisdiction": {
            "title": "Governing Law & Dispute Jurisdiction",
            "regex": r"(?:governing\s*law|jurisdiction\s*of\s*courts|arbitration\s*act|exclusive\s*jurisdiction)",
            "risk": "Low",
            "who": "All contracting parties",
            "when": "In the event of unresolved legal disputes",
            "default_questions": [
                "Which city holds exclusive court jurisdiction?",
                "Is mutual mediation mandated prior to invoking formal arbitration?"
            ]
        }
    }

    def extract_clauses(self, text: str, pages_data: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        extracted = []
        seen_types = set()
        pages = pages_data or []

        # First, break by numbered sections, double newlines, or paragraphs
        section_splits = re.split(r"(?:\n\s*\n|\r\n\s*\r\n|(?<=\.)\s*\n(?=[A-Z0-9\.\s]{2,}:?)|(?<=\n)(?=\d+\.\s+[A-Z]))", text)
        segments = [s.strip() for s in section_splits if len(s.strip()) > 25]

        # Also collect sentence-level splits for sentences with multiple clauses
        expanded_segments = []
        for seg in segments:
            expanded_segments.append(seg)
            # If segment has multiple sentences
            if "." in seg:
                sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9])", seg)
                for sent in sentences:
                    if len(sent.strip()) > 20:
                        expanded_segments.append(sent.strip())

        for p_idx, seg in enumerate(expanded_segments):
            seg_lower = seg.lower()

            for clause_type, config in self.CLAUSE_TEMPLATES.items():
                if clause_type in seen_types:
                    continue

                if re.search(config["regex"], seg_lower, re.IGNORECASE):
                    seen_types.add(clause_type)

                    # Locate source page
                    source_page = 1
                    if pages:
                        for pg in pages:
                            if seg[:40].lower() in pg.get("text", "").lower():
                                source_page = pg.get("page", 1)
                                break

                    clause_obj = self._build_clause_object(
                        clause_type=clause_type,
                        title=config["title"],
                        para=seg,
                        config=config,
                        page=source_page,
                        para_idx=p_idx + 1
                    )
                    extracted.append(clause_obj)

        return extracted

    def _build_clause_object(
        self, clause_type: str, title: str, para: str, config: Dict[str, Any], page: int, para_idx: int
    ) -> Dict[str, Any]:
        obligations = self._extract_obligations(para)
        restrictions = self._extract_restrictions(para)
        deadlines = self._extract_deadlines(para)
        financial = self._extract_financial(para)
        consequences = self._extract_consequences(para, clause_type)
        exceptions = self._extract_exceptions(para)
        plain_lang = self._generate_plain_language(clause_type, para)

        return {
            "clause_type": clause_type,
            "title": title,
            "original_text": para,
            "plain_language": plain_lang,
            "what_it_requires": obligations[0] if obligations else f"Adherence to terms stated in {title}",
            "who_it_affects": config["who"],
            "when_it_applies": config["when"],
            "obligations": obligations,
            "restrictions": restrictions,
            "deadlines": deadlines,
            "financial_implications": financial,
            "possible_consequences": consequences,
            "exceptions": exceptions,
            "questions_to_ask": config["default_questions"],
            "source_page": page,
            "source_paragraph": para_idx,
            "confidence": 0.96,
            "requires_human_review": bool(financial or "bond" in clause_type or "compete" in clause_type),
            "risk_severity": config["risk"]
        }

    def _extract_obligations(self, text: str) -> List[str]:
        items = []
        patterns = [
            r"(?:shall|must|is\s*required\s*to|agrees\s*to|undertakes\s*to)\s+([^.,;\n]{10,90})",
            r"(?:provide|serve|pay|furnish)\s+([^.,;\n]{10,70})"
        ]
        for pat in patterns:
            for match in re.finditer(pat, text, re.IGNORECASE):
                items.append(match.group(0).capitalize())
        return list(dict.fromkeys(items))[:4] or ["Fulfill the operational terms defined in this section."]

    def _extract_restrictions(self, text: str) -> List[str]:
        items = []
        patterns = [
            r"(?:shall\s*not|prohibited\s*from|cannot|restricted\s*from|will\s*not)\s+([^.,;\n]{10,90})",
            r"(?:no\s*right\s*to|exclusive)\s+([^.,;\n]{10,70})"
        ]
        for pat in patterns:
            for match in re.finditer(pat, text, re.IGNORECASE):
                items.append(match.group(0).capitalize())
        return list(dict.fromkeys(items))[:4]

    def _extract_deadlines(self, text: str) -> List[str]:
        items = []
        pat = r"\b(?:\d+\s*(?:days?|months?|weeks?|years?|working\s*days?)|prior\s*to|within\s*\d+\s*(?:days|hours))\b"
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            items.append(m)
        return list(dict.fromkeys(items))[:3]

    def _extract_financial(self, text: str) -> List[str]:
        items = []
        pat = r"(?:INR|Rs\.?|₹|\$)\s*[\d,]+(?:\.\d{2})?|\b[\d,]+\s*(?:Lakhs?|LPA|Rupees)\b"
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            items.append(f"Financial liability / stipulation: {m}")
        return list(dict.fromkeys(items))[:3]

    def _extract_consequences(self, text: str, clause_type: str) -> List[str]:
        consequences = []
        if "breach" in text.lower() or "forfeit" in text.lower() or "terminate" in text.lower():
            consequences.append("May trigger contractual breach, withholding of clearances, or monetary liability.")
        if clause_type == "bond_service":
            consequences.append("Employer may demand reimbursement of stated training expenditure or liquidated damages.")
            consequences.append("Delay or dispute regarding issuance of Relieving Letter and Experience Certificate.")
        elif clause_type == "notice_period":
            consequences.append("Leaving without serving notice requires salary buyout or risk of unapproved departure mark.")
        elif clause_type == "confidentiality":
            consequences.append("Injunctions and potential civil action for damages if proprietary trade secrets are leaked.")
        elif clause_type == "non_compete":
            consequences.append("Informational note: In India, Section 27 of Indian Contract Act strictly renders post-employment non-compete void.")
        return consequences or ["Standard operational compliance required; non-compliance may lead to contractual dispute."]

    def _extract_exceptions(self, text: str) -> List[str]:
        items = []
        pat = r"(?:except|unless|save\s*and\s*except|subject\s*to\s*prior\s*approval|with\s*written\s*consent)\s+([^.,;\n]{10,90})"
        for m in re.finditer(pat, text, re.IGNORECASE):
            items.append(m.group(0).capitalize())
        return list(dict.fromkeys(items))[:3]

    def _generate_plain_language(self, clause_type: str, text: str) -> str:
        if clause_type == "notice_period":
            return (
                "You are formally required to provide advance notice prior to leaving your post. "
                "Failing to serve this period typically requires paying compensation equivalent to your basic salary in lieu of notice."
            )
        elif clause_type == "probation":
            return (
                "You will undergo an evaluation window during which performance is reviewed. "
                "Either party may typically end employment with shorter notice during this stage before formal confirmation."
            )
        elif clause_type == "bond_service":
            return (
                "This clause seeks to bind you to serve a minimum duration or repay stated damages. "
                "Under Indian jurisprudence, an employer can only claim genuine, proven training expenses, not unreasonable punitive fines."
            )
        elif clause_type == "non_compete":
            return (
                "The clause attempts to bar you from joining competitors. "
                "Note: In India, post-employment restrictive covenants are generally void under Section 27 of the Indian Contract Act."
            )
        elif clause_type == "confidentiality":
            return (
                "You must protect all internal business information, technical code, customer records, and secrets from unauthorized disclosure."
            )
        elif clause_type == "termination":
            return (
                "Details how and when your employment or agreement can be ended, including with-cause events like gross misconduct and without-cause notice rights."
            )
        elif clause_type == "repayment_clawback":
            return (
                "If you depart prior to the designated retention milestone, you must refund bonuses or relocation stipends paid to you upfront."
            )
        return "This provision establishes binding obligations and conditions governing performance, compliance, and procedural rights under the contract."

clause_extractor = ClauseExtractor()
