from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
import torch

# Use M2M100 - smaller, more reliable multilingual model
model_name = "facebook/m2m100_418M"
print(f"Loading model: {model_name}")
print("This may take a few minutes on first run...")

tokenizer = M2M100Tokenizer.from_pretrained(model_name)
model = M2M100ForConditionalGeneration.from_pretrained(model_name)

# Set device
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model.to(device)
print("Model loaded successfully!")




# Language code mapping for M2M100
LANG_MAP = {
    "hi": "hi",  # Hindi
    "mr": "mr",  # Marathi
    "ta": "ta",  # Tamil
    "te": "te",  # Telugu
    "kn": "kn",  # Kannada
    "ml": "ml",  # Malayalam
    "pa": "pa",  # Punjabi
    "gu": "gu",  # Gujarati
    "bn": "bn",  # Bengali
    "or": "or",  # Oriya
    "as": "as",  # Assamese
    "en": "en",  # English
}


# Indic → English
def translate_to_english(text, lang_code="hi"):
    """Translate from any supported Indic language to English"""
    # Set source language
    tokenizer.src_lang = lang_code
    
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    
    # Generate translation to English
    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=tokenizer.get_lang_id("en"),
        max_length=512,
    )
    
    return tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]


# English → Indic
def translate_to_indic(text, lang_code="hi"):
    """Translate from English to any supported Indic language"""
    # Set source language to English
    tokenizer.src_lang = "en"
    
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    
    # Generate translation to target language
    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=tokenizer.get_lang_id(lang_code),
        max_length=512,
    )
    
    return tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]



# Detect Language
from langdetect import detect


def detect_language(text):
    """Detect the language of the input text"""
    try:
        lang = detect(text)
        return LANG_MAP.get(lang, "hi")  # default to Hindi if not found
    except:
        return "hi"  # default to Hindi on error



# Full Pipeline
def multilingual_translate(text):
    """Translate text: detect language, convert to English, then back to original language"""
    lang_code = detect_language(text)
    
    print(f"Detected language: {lang_code}")
    
    # Check if text is already in English
    if lang_code == "en":
        return {
            "detected_lang": "en",
            "english": text,
            "back_translation": text,
        }
    
    # Translate to English
    print("Translating to English...")
    english_text = translate_to_english(text, lang_code)
    
    # Here you can call LLM with english_text
    # llm_output = ask_llm(english_text)
    
    # Translate back to original language
    print("Translating back to original language...")
    final_text = translate_to_indic(english_text, lang_code)
    
    return {
        "detected_lang": lang_code,
        "english": english_text,
        "back_translation": final_text,
    }



# Test
if __name__ == "__main__":
    text = "வணக்கம், எப்படி இருக்கிறீர்கள்?"

    result = multilingual_translate(text)

    print("\nInput Text:", text)
    print("Detected Language:", result["detected_lang"])
    print("English Translation:", result["english"])
    print("Back to Original:", result["back_translation"])

