# Job Search Agent Frontend

This is a production-ready React frontend for the Job Search Agent system.

## Features

- 🎯 Resume upload with PDF/TXT support
- 🔍 Intelligent job search
- 📊 AI-powered job matching and ranking
- 🎓 Skill gap analysis
- 🔗 Direct apply links to job postings
- 📱 Responsive design with Tailwind CSS

## Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

### Backend Connection

Ensure the Flask backend is running on `http://localhost:5000`

```bash
cd ..
pip install -r requirements.txt
python app.py
```

## Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ResumeUploader.js
│   │   └── JobResults.js
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## API Endpoints Used

- `POST /api/upload-resume` - Upload and parse resume
- `POST /api/search-jobs` - Search jobs with resume context
- `GET /api/health` - Health check

## Technologies

- React 18
- Tailwind CSS
- Axios for API calls
- React Icons
