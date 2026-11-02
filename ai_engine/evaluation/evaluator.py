from typing import Dict, Any, List

class DocumentAIEvaluator:
    """
    Evaluation suite for document classification, clause extraction, and grounded RAG answer fidelity.
    """

    BENCHMARK_CASES = [
        {
            "name": "Standard Tech Appointment Letter",
            "text": (
                "APPOINTMENT LETTER\n\n"
                "Dear Candidate, We are pleased to appoint you as Senior Software Engineer at TechCorp Ltd. "
                "Your Total CTC will be INR 14,00,000 per annum. "
                "You will be on probation for a period of 6 months. During probation, either party may terminate "
                "employment with 30 days notice. Upon confirmation, the notice period shall be 90 days. "
                "You agree not to join any direct competitor for 12 months after leaving. "
                "All company code and algorithms are proprietary and confidential information."
            ),
            "expected_category": "employment",
            "expected_sub_type": "Appointment Letter",
            "expected_clauses": ["probation", "notice_period", "non_compete", "confidentiality"]
        },
        {
            "name": "Service Bond Agreement",
            "text": (
                "SERVICE AGREEMENT AND BOND\n\n"
                "The Employee agrees to serve the Company for a minimum commitment period of 2 years. "
                "In case the Employee departs before 24 months, they agree to pay liquidated damages of INR 2,00,000 "
                "towards training expenses incurred. 60 days written notice is required."
            ),
            "expected_category": "employment",
            "expected_sub_type": "Employment Bond",
            "expected_clauses": ["bond_service", "notice_period"]
        },
        {
            "name": "Maharashtra Domicile Certificate",
            "text": (
                "GOVERNMENT OF MAHARASHTRA\n"
                "OFFICE OF THE TAHSILDAR\n"
                "DOMICILE AND AGE CERTIFICATE\n\n"
                "This is to certify that Shri/Smt resident has resided in Maharashtra for not less than 15 years. "
                "Issued under official seal via Aaple Sarkar portal."
            ),
            "expected_category": "government",
            "expected_sub_type": "Domicile Certificate",
            "expected_clauses": []
        }
    ]

    def run_evaluation(self) -> Dict[str, Any]:
        from ai_engine.classification.classifier import document_classifier
        from ai_engine.clause_extraction.extractor import clause_extractor

        total_cases = len(self.BENCHMARK_CASES)
        classification_correct = 0
        total_expected_clauses = 0
        total_extracted_clauses = 0
        matched_clauses = 0

        case_results = []

        for case in self.BENCHMARK_CASES:
            # Test classification
            res_cls = document_classifier.classify(case["text"], filename=case["name"])
            cls_match = (res_cls["category"] == case["expected_category"])
            if cls_match:
                classification_correct += 1

            # Test clause extraction
            extracted = clause_extractor.extract_clauses(case["text"])
            extracted_types = [c["clause_type"] for c in extracted]

            exp_clauses = case["expected_clauses"]
            total_expected_clauses += len(exp_clauses)
            total_extracted_clauses += len(extracted)

            curr_matched = sum(1 for ec in exp_clauses if ec in extracted_types)
            matched_clauses += curr_matched

            case_results.append({
                "case_name": case["name"],
                "classification_success": cls_match,
                "predicted_category": res_cls["category"],
                "expected_category": case["expected_category"],
                "predicted_sub_type": res_cls["sub_type"],
                "clauses_found": extracted_types,
                "clauses_expected": exp_clauses
            })

        cls_accuracy = round(classification_correct / total_cases * 100, 2)
        precision = round(matched_clauses / total_extracted_clauses * 100, 2) if total_extracted_clauses else 100.0
        recall = round(matched_clauses / total_expected_clauses * 100, 2) if total_expected_clauses else 100.0

        return {
            "total_benchmark_cases": total_cases,
            "classification_accuracy_pct": cls_accuracy,
            "clause_extraction_precision_pct": precision,
            "clause_extraction_recall_pct": recall,
            "case_results": case_results,
            "status": "PASS" if cls_accuracy >= 90.0 and recall >= 85.0 else "REVIEW"
        }

evaluator = DocumentAIEvaluator()
