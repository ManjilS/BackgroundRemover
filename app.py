from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    with open('index.html', 'r') as f:
        return f.read()

@app.route('/style.css')
def css():
    with open('style.css', 'r') as f:
        return f.read(), 200, {'Content-Type': 'text/css'}

@app.route('/script.js')
def js():
    with open('script.js', 'r') as f:
        return f.read(), 200, {'Content-Type': 'application/javascript'}

@app.route('/remove-background', methods=['POST'])
def remove_background():
    try:
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        input_image = Image.open(io.BytesIO(image_bytes))
        output_image = remove(input_image)
        
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format='PNG')
        output_base64 = base64.b64encode(output_buffer.getvalue()).decode()
        
        return jsonify({'success': True, 'image': f'data:image/png;base64,{output_base64}'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)