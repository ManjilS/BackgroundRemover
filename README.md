# Background Remover App

AI-powered background removal web application using Flask and rembg.

## Deploy to Render

1. Push this repository to GitHub
2. Connect your GitHub repository to Render
3. Create a new Web Service on Render
4. Use the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Environment: Python 3

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

Visit `http://localhost:5000` to use the app.