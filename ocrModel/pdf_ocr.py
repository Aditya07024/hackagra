import pytesseract
from pdf2image import convert_from_path
import sys
import json

def extract_text_from_pdf(pdf_path):
    print(f"📄 Converting PDF to images: {pdf_path}")

    # Convert PDF -> list of PIL images
    pages = convert_from_path(pdf_path, dpi=300)

    final_text = ""

    for i, page in enumerate(pages):
        print(f"🔍 Running OCR on page {i + 1}/{len(pages)}")

        # Convert each image to text
        text = pytesseract.image_to_string(page, config="--psm 6")

        final_text += f"\n\n----- PAGE {i+1} -----\n{text}"

    return final_text


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Usage: python pdf_ocr.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]

    try:
        text = extract_text_from_pdf(pdf_path)
        print("\n✅ OCR_RESULT_START")
        print(text)
        print("✅ OCR_RESULT_END")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)
