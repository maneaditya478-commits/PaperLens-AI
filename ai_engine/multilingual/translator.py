from typing import Dict, Any

class MultilingualEngine:
    """
    Multilingual support for English, Hindi (हिंदी), and Marathi (मराठी).
    Translates document insights, explanations, and key warnings into regional languages.
    """

    TRANSLATIONS = {
        "Hindi": {
            "notice_period": "नोटिस अवधि: इस्तीफा देने से पहले आवश्यक अग्रिम सूचना अवधि।",
            "probation": "परिवीक्षा अवधि (Probation): सेवा में स्थायी होने से पहले का मूल्यांकन समय।",
            "bond": "रोजगार बांड (Bond): न्यूनतम सेवा अवधि या प्रशिक्षण लागत की भरपाई की शर्त।",
            "confidentiality": "गोपनीयता समझौता: कंपनी की गुप्त जानकारी साझा न करने का दायित्व।",
            "non_compete": "गैर-प्रतिस्पर्धा खंड: प्रतिस्पर्धी कंपनियों में काम करने पर प्रतिबंध।",
            "disclaimer": "सूचनात्मक अस्वीकरण: यह कानूनी सलाह नहीं है। केवल दस्तावेज़ विश्लेषण के लिए है।",
            "greeting": "नमस्ते! मैं PaperLens AI हूँ। आपके दस्तावेज़ को समझने में मैं आपकी कैसे मदद कर सकता हूँ?",
            "notFound": "प्रदान किए गए दस्तावेज़ में इस प्रश्न के संबंध में पर्याप्त साक्ष्य नहीं मिले।"
        },
        "Marathi": {
            "notice_period": "नोटीस कालावधी: राजीनामा देण्यापूर्वी देणे आवश्यक असलेली पूर्वसूचना.",
            "probation": "परिविक्षा कालावधी (Probation): सेवेत कायम होण्यापूर्वी कामाच्या मूल्यमापनाचा काळ.",
            "bond": "सेवा करार / बाँड: किमान सेवा कालावधी किंवा प्रशिक्षण खर्च परत करण्याची अट.",
            "confidentiality": "गोपनीयता करार: कंपनीची अंतर्गत माहिती उघड न करण्याची कायदेशीर जबाबदारी.",
            "non_compete": "गैर-स्पर्धा कलम: प्रतिस्पर्धी कंपन्यांमध्ये काम करण्यावर निर्बंध.",
            "disclaimer": "माहितीपर अस्वीकरण: हा औपचारिक कायदेशीर सल्ला नाही. केवळ दस्तऐवज स्पष्टीकरणासाठी आहे.",
            "greeting": "नमस्कार! मी PaperLens AI आहे. आपल्या दस्तऐवजातील अटी व शर्ती समजून घेण्यासाठी मी कशी मदत करू शकेन?",
            "notFound": "दिलेल्या दस्तऐवजात या प्रश्नाशी संबंधित पुरेसा पुरावा आढळला नाही."
        }
    }

    def localize_text(self, text: str, target_lang: str = "English") -> str:
        if target_lang.lower() == "english":
            return text

        lang_key = "Hindi" if "hind" in target_lang.lower() else "Marathi" if "marath" in target_lang.lower() else "English"
        if lang_key == "English":
            return text

        dict_lang = self.TRANSLATIONS.get(lang_key, {})

        # Add localized header
        prefix = f"[{'हिंदी स्पष्टीकरण' if lang_key == 'Hindi' else 'मराठी स्पष्टीकरण'}]:\n"
        disclaimer = f"\n\n**{dict_lang.get('disclaimer')}**"

        # Provide localized translated summary and key points
        if "notice" in text.lower():
            return f"{prefix}• {dict_lang.get('notice_period')}\n\n{text}{disclaimer}"
        elif "bond" in text.lower():
            return f"{prefix}• {dict_lang.get('bond')}\n\n{text}{disclaimer}"
        elif "probation" in text.lower():
            return f"{prefix}• {dict_lang.get('probation')}\n\n{text}{disclaimer}"
        elif "confidential" in text.lower():
            return f"{prefix}• {dict_lang.get('confidentiality')}\n\n{text}{disclaimer}"
        elif "compet" in text.lower():
            return f"{prefix}• {dict_lang.get('non_compete')}\n\n{text}{disclaimer}"

        return f"{prefix}{text}{disclaimer}"

    def get_greeting(self, lang: str = "English") -> str:
        lang_key = "Hindi" if "hind" in lang.lower() else "Marathi" if "marath" in lang.lower() else "English"
        if lang_key in self.TRANSLATIONS:
            return self.TRANSLATIONS[lang_key]["greeting"]
        return "Hello! I am PaperLens AI. How can I help you understand this document?"

multilingual_engine = MultilingualEngine()
