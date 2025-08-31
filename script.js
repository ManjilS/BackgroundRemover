class BackgroundRemover {
    constructor() {
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.originalImage = document.getElementById('originalImage');
        this.processedImage = document.getElementById('processedImage');
        this.imageContainer = document.getElementById('imageContainer');
        this.controls = document.getElementById('controls');
        this.processBtn = document.getElementById('processBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.loading = document.getElementById('loading');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.uploadBtn.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.processBtn.addEventListener('click', () => this.processImage());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage.src = e.target.result;
            this.imageContainer.style.display = 'grid';
            this.controls.style.display = 'block';
            this.processedImage.style.display = 'none';
            this.downloadBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    async processImage() {
        this.loading.style.display = 'flex';
        this.processedImage.style.display = 'none';
        this.processBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:5000/remove-background', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: this.originalImage.src
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.processedImage.src = result.image;
                this.processedImage.style.display = 'block';
                this.downloadBtn.style.display = 'inline-block';
            } else {
                alert('Error processing image: ' + result.error);
            }
        } catch (error) {
            alert('Error connecting to server. Make sure Python backend is running.');
        }

        this.loading.style.display = 'none';
        this.processBtn.disabled = false;
    }



    downloadImage() {
        const link = document.createElement('a');
        link.download = 'background-removed.png';
        link.href = this.processedImage.src;
        link.click();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundRemover();
});