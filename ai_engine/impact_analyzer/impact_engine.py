import re
from typing import Dict, Any, List

class ImpactAnalyzer:
    """
    Hypothetical Impact Simulation & Consequence Analysis Engine.
    Simulates outcomes for user decisions (e.g. early resignation, bond violation, breach)
    grounded in extracted clauses and statutory context with strict informational disclaimers.
    """

    def analyze_scenario(
        self,
        user_question: str,
        clauses: List[Dict[str, Any]],
        document_text: str = ""
    ) -> Dict[str, Any]:
        q_lower = user_question.lower()

        # 1. Match relevant clauses
        matched_clauses = self._find_relevant_clauses(q_lower, clauses)

        # 2. Extract conditions & timelines
        related_conditions = []
        possible_outcomes = []
        financial_implications = []
        relevant_exceptions = []
        missing_information = []
        source_citations = []

        # Check for early exit / resignation before probation / bond
        if any(w in q_lower for w in ["leave", "resign", "quit", "before six months", "before 6 months", "probation"]):
            related_conditions.append("Probation review status: Confirm whether you are within the official probationary window.")
            related_conditions.append("Notice period requirement: Serving stipulated days (e.g. 15 to 30 days during probation, or 60 to 90 days if confirmed).")
            related_conditions.append("Asset & Access Return: Formal return of company laptop, credentials, and confidential files.")

            possible_outcomes.append("Relieving Letter & Experience Certificate: Conditioned upon proper notice service and formal handover sign-off.")
            possible_outcomes.append("Notice Pay Deduction: If leaving immediately without serving notice, company will deduct notice buyout from final settlement.")
            possible_outcomes.append("Exit Record: Proper departure maintains clean background verification (BGV) record for future employers.")

            for c in clauses:
                if c.get("clause_type") in ("notice_period", "probation", "bond_service", "repayment_clawback"):
                    source_citations.append({
                        "title": c.get("title"),
                        "page": c.get("source_page", 1),
                        "snippet": c.get("original_text", "")[:180] + "..."
                    })
                    if c.get("financial_implications"):
                        financial_implications.extend(c.get("financial_implications"))

            relevant_exceptions.append("Medical emergency or genuine health incapacity documented by registered medical practitioner.")
            relevant_exceptions.append("Mutual written separation agreement waiving notice obligation.")

            missing_information.append("Exact date of joining and formal confirmation letter status.")
            missing_information.append("Whether signing bonus or relocation allowance was disbursed subject to clawback.")

            direct_answer = (
                "If you leave before completing six months (typically within probation), you are legally permitted to resign, "
                "but you must serve the probation notice period (usually 15-30 days) or pay basic salary in lieu of notice. "
                "Any sign-on bonus or relocation allowance received may be subject to full clawback."
            )

        elif any(w in q_lower for w in ["bond", "penalty", "break bond", "training fee"]):
            related_conditions.append("Proof of actual specialized training provided by the company with invoices.")
            related_conditions.append("Stipulated bond tenure (e.g. 1 or 2 years) and liquidated damages amount.")

            possible_outcomes.append("Company HR may issue a demand letter requesting the bond amount.")
            possible_outcomes.append("Under Indian jurisprudence (Supreme Court precedent in *Niranjan Shankar Golikari* and *Toshniwal*), employers cannot extract punitive damages. Only reasonable actual training costs proven in court can be recovered.")
            possible_outcomes.append("Employer may delay issuing Relieving Letter, though holding back employee statutory documents (like PF clearance) is unlawful.")

            financial_implications.append("Company may attempt to deduct bond damages from the Full and Final (F&F) settlement.")
            relevant_exceptions.append("If employer fundamentally altered job duties, workplace harassment, or failure to pay agreed salary.")

            missing_information.append("Did the company incur actual third-party training fees with verifiable certification?")

            direct_answer = (
                "Breaking an employment bond cannot lead to criminal charges or forced servitude in India. "
                "The employer can only legally claim actual, documented expenses incurred on your training, not punitive penalties. "
                "However, resolving the exit professionally is necessary to obtain your Relieving Letter without disputes."
            )

        elif any(w in q_lower for w in ["compete", "competitor", "freelance", "side project", "moonlighting"]):
            related_conditions.append("Exclusive employment commitment during active work hours.")
            related_conditions.append("Non-disclosure of confidential client data, trade secrets, and source code.")

            possible_outcomes.append("During active employment, dual employment or working for direct competitors is valid grounds for termination.")
            possible_outcomes.append("Post-employment: Restraining an employee from practicing a lawful profession is void under Section 27 of the Indian Contract Act.")

            missing_information.append("Does the secondary project utilize any company hardware, software licenses, or work hours?")

            direct_answer = (
                "During active tenure, working for a competitor or unauthorized moonlighting is a valid ground for termination. "
                "However, once your employment terminates, post-departure non-compete clauses are unenforceable under Indian law."
            )

        else:
            # Generic clause analysis
            direct_answer = (
                f"Analyzing your scenario regarding: '{user_question}'. "
                f"The document establishes strict compliance requirements. "
                "Ensure any deviation is agreed in writing with authorized management."
            )
            related_conditions.append("Documentary compliance with signed terms and conditions.")
            possible_outcomes.append("Non-compliance could result in contract dispute, financial deductions, or refusal to issue clearance.")
            missing_information.append("Internal company HR policy manual details and supplementary addendums.")

        # If matched clauses exist, enhance source citations
        if not source_citations and matched_clauses:
            for mc in matched_clauses:
                source_citations.append({
                    "title": mc.get("title", "Relevant Clause"),
                    "page": mc.get("source_page", 1),
                    "snippet": mc.get("original_text", "")[:180] + "..."
                })

        return {
            "user_question": user_question,
            "direct_answer": direct_answer,
            "retrieved_clauses": matched_clauses,
            "related_conditions": related_conditions,
            "possible_outcomes": possible_outcomes,
            "financial_implications": financial_implications or ["No specific monetary penalty explicitly mandated in extracted text."],
            "relevant_exceptions": relevant_exceptions or ["Mutual written waiver executed by authorized company signatory."],
            "missing_information": missing_information,
            "source_citations": source_citations,
            "risk_level": "High" if "bond" in q_lower or "penalty" in q_lower else "Moderate",
            "legal_disclaimer": (
                "PaperLens AI provides informational analysis grounded in the document text. "
                "This is not formal legal advice. Contractual enforceability and exceptions depend on applicable statutory law "
                "and individual facts. Consult qualified legal counsel for binding determinations."
            )
        }

    def _find_relevant_clauses(self, query: str, clauses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        matched = []
        for c in clauses:
            c_text = f"{c.get('title', '')} {c.get('plain_language', '')} {c.get('original_text', '')}".lower()
            # Simple keyword overlap
            q_words = [w for w in query.split() if len(w) > 3]
            overlap = sum(1 for w in q_words if w in c_text)
            if overlap >= 1:
                matched.append(c)
        return matched[:3]

impact_analyzer = ImpactAnalyzer()
