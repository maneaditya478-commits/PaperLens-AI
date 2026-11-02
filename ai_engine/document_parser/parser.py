import re
from typing import Dict, List, Any

class DocumentParser:
    """
    Parses document structure, extracting sections, headers, and key-value fields.
    """

    def parse_structure(self, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        full_text = extracted_data.get("full_text", "")
        pages = extracted_data.get("pages", [])
        blocks = extracted_data.get("blocks", [])

        sections = self._identify_sections(full_text)
        key_fields = self._extract_key_fields(full_text)

        return {
            "sections": sections,
            "key_fields": key_fields,
            "page_count": len(pages),
            "total_blocks": len(blocks),
            "has_tabular_content": self._detect_tables(full_text)
        }

    def _identify_sections(self, text: str) -> List[Dict[str, Any]]:
        # Common section heading patterns (e.g. 1. TERMS OF EMPLOYMENT, SECTION 2, etc.)
        lines = text.split("\n")
        sections = []
        current_section = {"title": "General Overview", "content": []}

        heading_pattern = re.compile(
            r"^(?:\d+[\.\)]|[A-Z\s]{4,}|(?:ARTICLE|SECTION|CLAUSE)\s+\d+|TERMS|CONDITIONS|ANNEXURE)",
            re.IGNORECASE
        )

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            if len(stripped) < 70 and (heading_pattern.match(stripped) or stripped.isupper()):
                if current_section["content"]:
                    current_section["content"] = "\n".join(current_section["content"])
                    sections.append(current_section)
                current_section = {"title": stripped, "content": []}
            else:
                current_section["content"].append(stripped)

        if current_section["content"]:
            current_section["content"] = "\n".join(current_section["content"])
            sections.append(current_section)

        return sections

    def _extract_key_fields(self, text: str) -> Dict[str, Any]:
        fields = {}

        # 1. Dates
        date_pattern = r"\b(?:\d{1,2}[-/th|st|nd|rd\s]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s,]+\d{2,4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b"
        dates = re.findall(date_pattern, text, re.IGNORECASE)
        if dates:
            fields["dates_mentioned"] = list(dict.fromkeys(dates))[:5]

        # 2. Financial / Salary / Bond Amounts
        money_pattern = r"(?:(?:INR|Rs\.?|₹|\$|USD)\s*[\d,]+(?:\.\d{2})?|\b[\d,]+(?:\.\d{2})?\s*(?:LPA|Lakhs?|Per\s*Annum|Rupees|USD))\b"
        amounts = re.findall(money_pattern, text, re.IGNORECASE)
        if amounts:
            fields["financial_amounts"] = list(dict.fromkeys(amounts))[:6]

        # 3. Notice Period
        notice_pattern = r"(\b\d+\s*(?:days?|months?|weeks?)\s*(?:notice|notice\s*period))\b"
        notice_match = re.search(notice_pattern, text, re.IGNORECASE)
        if notice_match:
            fields["notice_period"] = notice_match.group(1)

        # 4. Probation Period
        probation_pattern = r"(\b\d+\s*(?:months?|weeks?|days?)\s*(?:probation|probationary\s*period))\b"
        probation_match = re.search(probation_pattern, text, re.IGNORECASE)
        if probation_match:
            fields["probation_period"] = probation_match.group(1)

        # 5. Service Bond duration
        bond_pattern = r"(\b(?:bond|minimum\s*service|commitment)\s*(?:period\s*of\s*)?\b\d+\s*(?:years?|months?))\b"
        bond_match = re.search(bond_pattern, text, re.IGNORECASE)
        if bond_match:
            fields["service_bond"] = bond_match.group(1)

        # 6. Organization or Employer
        org_pattern = r"(?:Company|Employer|Organization|Institution|University|Authority)\s*[:\-]\s*([^\n\r]+)"
        org_match = re.search(org_pattern, text, re.IGNORECASE)
        if org_match:
            fields["issuing_party"] = org_match.group(1).strip()

        # 7. Candidate / Employee / Holder
        candidate_pattern = r"(?:Candidate|Employee|Applicant|Holder|Name)\s*[:\-]\s*([^\n\r]+)"
        cand_match = re.search(candidate_pattern, text, re.IGNORECASE)
        if cand_match:
            fields["recipient_party"] = cand_match.group(1).strip()

        return fields

    def _detect_tables(self, text: str) -> bool:
        return "|" in text or "\t" in text or bool(re.search(r"(\w+\s{3,}\w+){3,}", text))

document_parser = DocumentParser()
