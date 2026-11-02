import os
from pathlib import Path
from typing import Dict, List, Any
import pymupdf  # PyMuPDF
from PIL import Image

class OCREngine:
    """
    Multimodal OCR and Layout Extraction Engine.
    Leverages PyMuPDF for high-precision vector text & layout block extraction,
    with OCR fallback for scanned PDFs and standalone image formats (PNG/JPG).
    """

    def __init__(self):
        self.supported_extensions = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".tiff"}

    def extract_document(self, file_path: str | Path) -> Dict[str, Any]:
        file_path = Path(file_path)
        ext = file_path.suffix.lower()

        if ext == ".pdf":
            return self._extract_pdf(file_path)
        elif ext in {".png", ".jpg", ".jpeg", ".webp", ".tiff"}:
            return self._extract_image(file_path)
        elif ext in {".docx", ".doc"}:
            return self._extract_docx(file_path)
        else:
            raise ValueError(f"Unsupported document format: {ext}")

    def _extract_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        doc = pymupdf.open(str(pdf_path))
        pages_data = []
        full_text_parts = []
        all_blocks = []

        for page_idx, page in enumerate(doc):
            page_num = page_idx + 1
            # Extract structured text with block coordinates
            # block format: (x0, y0, x1, y1, text, block_no, block_type)
            page_blocks = page.get_text("blocks")
            raw_page_text = page.get_text("text").strip()

            # If page is scanned (empty or minimal text), attempt OCR textpage
            if len(raw_page_text) < 30:
                try:
                    textpage_ocr = page.get_textpage_ocr(language="eng", dpi=200)
                    raw_page_text = textpage_ocr.extractText().strip()
                except Exception:
                    pass

            structured_blocks = []
            for b in page_blocks:
                text_content = b[4].strip() if len(b) > 4 else ""
                if text_content:
                    block_dict = {
                        "page": page_num,
                        "bbox": [round(coord, 2) for coord in b[:4]],
                        "text": text_content,
                        "block_id": b[5] if len(b) > 5 else 0,
                    }
                    structured_blocks.append(block_dict)
                    all_blocks.append(block_dict)

            pages_data.append({
                "page": page_num,
                "width": round(page.rect.width, 2),
                "height": round(page.rect.height, 2),
                "text": raw_page_text,
                "blocks": structured_blocks
            })
            if raw_page_text:
                full_text_parts.append(raw_page_text)

        total_pages = len(doc)
        doc.close()

        full_text = "\n\n".join(full_text_parts)

        return {
            "format": "pdf",
            "page_count": total_pages,
            "full_text": full_text,
            "pages": pages_data,
            "blocks": all_blocks,
            "char_count": len(full_text),
            "word_count": len(full_text.split())
        }

    def _extract_image(self, img_path: Path) -> Dict[str, Any]:
        with Image.open(img_path) as img:
            width, height = img.size

        # Create a single-page virtual doc or use OCR
        # PyMuPDF can also open raster images and generate PDF with OCR
        full_text = ""
        try:
            doc = pymupdf.open(str(img_path))
            pdf_bytes = doc.convert_to_pdf()
            doc.close()
            pdf_doc = pymupdf.open("pdf", pdf_bytes)
            page = pdf_doc[0]
            try:
                tp = page.get_textpage_ocr(language="eng", dpi=200)
                full_text = tp.extractText().strip()
            except Exception:
                full_text = page.get_text("text").strip()
            pdf_doc.close()
        except Exception:
            full_text = f"Image Document: {img_path.name} ({width}x{height}px)"

        return {
            "format": "image",
            "page_count": 1,
            "full_text": full_text or f"Scanned Document: {img_path.name}",
            "pages": [{
                "page": 1,
                "width": width,
                "height": height,
                "text": full_text,
                "blocks": [{
                    "page": 1,
                    "bbox": [0, 0, width, height],
                    "text": full_text,
                    "block_id": 0
                }]
            }],
            "blocks": [{
                "page": 1,
                "bbox": [0, 0, width, height],
                "text": full_text,
                "block_id": 0
            }],
            "char_count": len(full_text),
            "word_count": len(full_text.split())
        }

    def _extract_docx(self, docx_path: Path) -> Dict[str, Any]:
        import docx
        doc = docx.Document(str(docx_path))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        full_text = "\n\n".join(paragraphs)
        blocks = [
            {"page": 1, "bbox": [0, i * 20, 500, (i + 1) * 20], "text": p, "block_id": i}
            for i, p in enumerate(paragraphs)
        ]
        return {
            "format": "docx",
            "page_count": 1,
            "full_text": full_text,
            "pages": [{
                "page": 1,
                "width": 612,
                "height": 792,
                "text": full_text,
                "blocks": blocks
            }],
            "blocks": blocks,
            "char_count": len(full_text),
            "word_count": len(full_text.split())
        }

ocr_engine = OCREngine()
