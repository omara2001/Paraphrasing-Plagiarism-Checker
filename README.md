# Academic Paraphrasing & Plagiarism Checker 

![Academic Paraphrasing & Plagiarism Checker]

A modern, responsive web application that helps students paraphrase text academically and check for plagiarism using Google's Gemini AI.

## 🌟 Features

### ✏️ Academic Paraphrasing
- Transform your text into a unique, academically appropriate version
- Maintain the original meaning while using different vocabulary and sentence structures
- Get instant word count statistics

### 🔍 Plagiarism Detection
- Compare two texts and receive a detailed similarity analysis
- Get a percentage similarity score with visual representation
- View detailed matches between texts with highlighting for different match types
- Receive recommendations for improving originality

### 💻 User-Friendly Interface
- Clean, modern UI with intuitive navigation
- Responsive design that works on all devices (desktop, tablet, mobile)
- Real-time feedback and notifications
- Copy functionality for easy use of results

## 🚀 Live Demo

Try the application: [Academic Paraphrasing & Plagiarism Checker](https://web-production-8f71.up.railway.app/)

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with flexbox and CSS variables
- **JavaScript**: Dynamic functionality and API integration
- **Google Gemini AI**: Powering the paraphrasing and plagiarism detection

## 📋 Usage Guide

### Paraphrasing Tool

1. Navigate to the "Paraphrase" tab
2. Enter or paste your original text in the left panel
3. Click the "Paraphrase" button
4. View your paraphrased text in the right panel
5. Use the "Copy" button to copy the result to your clipboard

### Plagiarism Checker

1. Navigate to the "Plagiarism Check" tab
2. Enter or paste the original text in the first text area
3. Enter or paste the comparison text in the second text area
4. Click the "Check Plagiarism" button
5. View the similarity score and detailed analysis
6. Review matched content and recommendations

## 🔧 Setup for Local Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript (for development)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/omara2001/Paraphrasing-Plagiarism-Checker.git
   cd Paraphrasing-Plagiarism-Checker
   ```

2. Open the frontend directory:
   ```bash
   cd frontend
   ```

3. Start a local server:
   - Using Python:
     ```bash
     # Python 3
     python -m http.server 8000
     # Python 2
     python -m SimpleHTTPServer 8000
     ```
   - Using Node.js:
     ```bash
     # Install http-server if you haven't already
     npm install -g http-server
     # Start the server
     http-server -p 8000
     ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## 🧩 Project Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🔄 API Integration

The frontend communicates with a Flask backend API that uses Google's Gemini AI for:

- Text paraphrasing
- Plagiarism detection and analysis

API endpoints:
- `/api/paraphrase`: Transforms input text into an academically paraphrased version
- `/api/check-plagiarism`: Analyzes two texts for similarity and provides detailed results

## 🎨 UI Features

- **Tab Navigation**: Easy switching between paraphrasing and plagiarism checking
- **Loading Indicators**: Visual feedback during API processing
- **Toast Notifications**: User-friendly status messages
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Buttons with hover effects and visual feedback
- **Syntax Highlighting**: Colored formatting for JSON data in plagiarism results

### 🔄 JSON Formatting

The plagiarism checker includes advanced JSON formatting capabilities:

- **Syntax Highlighting**: Color-coded display of JSON data for better readability
- **Structured Display**: Properly formatted and indented JSON results
- **Fallback Mechanisms**: Multiple approaches to handle various response formats
- **Error Handling**: Graceful handling of unexpected response structures

## 🛡️ Error Handling

The application includes robust error handling for:
- Empty text submissions
- API connection failures
- Unexpected response formats
- JSON parsing issues

## 🆕 Recent Improvements

- **Enhanced JSON Handling**: Improved parsing and display of plagiarism check results
- **Better Error Recovery**: Multiple fallback mechanisms for handling various response formats
- **Improved UI for Results**: More readable and user-friendly display of analysis data
- **Syntax Highlighting**: Color-coded JSON for better readability
- **Responsive Feedback**: Better toast notifications with appropriate styling

## 🔮 Future Enhancements

- Dark mode toggle
- Save results to PDF
- History of previous paraphrases and checks
- Additional language support
- Enhanced text formatting options
- Export results in different formats

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Omar A](https://github.com/omara2001)

## 🙏 Acknowledgements

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powering the AI capabilities
- [Font Awesome](https://fontawesome.com/) for the icons
- [Railway](https://railway.app/) for hosting the backend API
