from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Import the translation functions
from model import translate_to_english, translate_to_indic, detect_language

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Translation service is running"})


@app.route('/translate/to-english', methods=['POST'])
def translate_input_to_english():
    """Translate user input from any Indian language to English"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Detect language
        lang_code = detect_language(text)
        
        # If already English, return as is
        if lang_code == "en":
            return jsonify({
                "detected_language": "en",
                "original_text": text,
                "translated_text": text,
                "is_english": True
            })
        
        # Translate to English
        translated_text = translate_to_english(text, lang_code)
        
        return jsonify({
            "detected_language": lang_code,
            "original_text": text,
            "translated_text": translated_text,
            "is_english": False
        })
    
    except Exception as e:
        print(f"Error in translate_to_english: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500


@app.route('/translate/to-native', methods=['POST'])
def translate_output_to_native():
    """Translate LLM output from English to user's native language"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        target_lang = data.get('target_language', 'hi')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # If target is English, return as is
        if target_lang == "en":
            return jsonify({
                "original_text": text,
                "translated_text": text,
                "target_language": "en"
            })
        
        # Translate to target language
        translated_text = translate_to_indic(text, target_lang)
        
        return jsonify({
            "original_text": text,
            "translated_text": translated_text,
            "target_language": target_lang
        })
    
    except Exception as e:
        print(f"Error in translate_to_native: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500


@app.route('/translate/full-pipeline', methods=['POST'])
def full_translation_pipeline():
    """
    Complete pipeline: 
    1. Detect user's language
    2. Translate to English for LLM
    3. Process with LLM (done externally)
    4. Translate response back to user's language
    """
    try:
        data = request.get_json()
        user_input = data.get('user_input', '')
        llm_response = data.get('llm_response', '')
        
        if not user_input:
            return jsonify({"error": "user_input is required"}), 400
        
        # Step 1 & 2: Detect language and translate to English
        lang_code = detect_language(user_input)
        
        if lang_code == "en":
            english_input = user_input
        else:
            english_input = translate_to_english(user_input, lang_code)
        
        result = {
            "detected_language": lang_code,
            "original_input": user_input,
            "english_input": english_input,
        }
        
        # Step 3: If LLM response is provided, translate it back
        if llm_response:
            if lang_code == "en":
                native_response = llm_response
            else:
                native_response = translate_to_indic(llm_response, lang_code)
            
            result["english_response"] = llm_response
            result["native_response"] = native_response
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in full_pipeline: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500


@app.route('/detect-language', methods=['POST'])
def detect_lang():
    """Detect the language of given text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        lang_code = detect_language(text)
        
        return jsonify({
            "text": text,
            "detected_language": lang_code
        })
    
    except Exception as e:
        print(f"Error in detect_language: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Translation API Server")
    print("=" * 60)
    print("\nAvailable endpoints:")
    print("  POST /translate/to-english    - Translate input to English")
    print("  POST /translate/to-native     - Translate output to native language")
    print("  POST /translate/full-pipeline - Complete translation pipeline")
    print("  POST /detect-language         - Detect language of text")
    print("  GET  /health                  - Health check")
    print("\n" + "=" * 60)
    
    app.run(host='0.0.0.0', port=5001, debug=False)
