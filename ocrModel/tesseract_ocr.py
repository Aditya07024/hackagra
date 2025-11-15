import pytesseract
import cv2
from PIL import Image
import sys

# If needed (usually not on mac/homebrew):
# pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

def ocr_image(image_path):
    print("🔍 Loading image:", image_path)

    # Read using OpenCV
    img = cv2.imread(image_path)

    if img is None:
        raise Exception("Image not found or unreadable")

    # Convert to RGB (OpenCV loads as BGR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Run OCR
    text = pytesseract.image_to_string(img_rgb)

    return text


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Usage: python tesseract_ocr.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        text = ocr_image(image_path)
        print("✅ OCR_RESULT_START")
        print(text)
        print("✅ OCR_RESULT_END")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)
