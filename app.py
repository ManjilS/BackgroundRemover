from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Background Remover API is running!'

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
    app.run(debug=True, port=5000)