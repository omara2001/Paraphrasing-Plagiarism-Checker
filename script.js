document.addEventListener('DOMContentLoaded', function() {
    // API endpoint (change this to your Railway deployment URL when deployed)
    const API_BASE_URL = 'https://web-production-8f71.up.railway.app'; // Update with your actual Railway URL

    // Function to format JSON output in a more readable way
    function formatJsonOutput(jsonString) {
        try {
            // Clean up the input if it's a string
            let cleanedInput = jsonString;
            if (typeof jsonString === 'string') {
                // Remove any leading/trailing whitespace
                cleanedInput = jsonString.trim();

                // If the string starts with "```json" and ends with "```", extract the JSON part
                if (cleanedInput.startsWith('```json') && cleanedInput.endsWith('```')) {
                    cleanedInput = cleanedInput.substring(7, cleanedInput.length - 3).trim();
                }
                // If the string just starts with "```" and ends with "```", extract the content
                else if (cleanedInput.startsWith('```') && cleanedInput.endsWith('```')) {
                    cleanedInput = cleanedInput.substring(3, cleanedInput.length - 3).trim();
                }
            }

            // Try to parse the JSON if it's a string
            const jsonData = typeof cleanedInput === 'string' ? JSON.parse(cleanedInput) : cleanedInput;

            // Format the JSON with syntax highlighting
            return formatJsonWithHighlighting(jsonData);
        } catch (e) {
            console.error("JSON parsing error:", e);

            // If parsing fails, try to clean up and format the string for better readability
            if (typeof jsonString === 'string') {
                // Convert the raw string to a more readable format
                return formatRawJsonString(jsonString);
            } else {
                // If it's not a string, just stringify it
                return `<pre class="json-raw">${JSON.stringify(jsonString, null, 2)}</pre>`;
            }
        }
    }

    // Function to format a raw JSON string that couldn't be parsed
    function formatRawJsonString(rawString) {
        // Clean up the string
        let cleanedString = rawString.trim();

        // Remove markdown code blocks if present
        if (cleanedString.startsWith('```json') && cleanedString.endsWith('```')) {
            cleanedString = cleanedString.substring(7, cleanedString.length - 3).trim();
        } else if (cleanedString.startsWith('```') && cleanedString.endsWith('```')) {
            cleanedString = cleanedString.substring(3, cleanedString.length - 3).trim();
        }

        // Apply basic formatting to make it more readable
        // Add line breaks, indentation, and color for better readability
        let formatted = cleanedString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(".*?")/g, '<span class="json-string">$1</span>')
            .replace(/(\d+)/g, '<span class="json-number">$1</span>')
            .replace(/(true|false)/g, '<span class="json-boolean">$1</span>')
            .replace(/(null)/g, '<span class="json-null">$1</span>')
            .replace(/(".*?"):/g, '<span class="json-key">$1</span>:');

        return `<div class="json-raw-container"><pre class="json-raw">${formatted}</pre></div>`;
    }

    // Function to format JSON with syntax highlighting
    function formatJsonWithHighlighting(json) {
        // Convert the JSON object to a formatted string
        const formattedJson = JSON.stringify(json, null, 4);

        // Apply syntax highlighting
        const highlighted = formattedJson
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                function(match) {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'json-boolean';
                    } else if (/null/.test(match)) {
                        cls = 'json-null';
                    }
                    return `<span class="${cls}">${match}</span>`;
                }
            );

        return `<pre class="json-formatted">${highlighted}</pre>`;
    }

    // Function to extract and format JSON data from a string
    function extractJsonFromString(str) {
        // Try to find JSON-like patterns in the string
        const jsonPattern = /{[\s\S]*}/;
        const match = str.match(jsonPattern);

        if (match) {
            try {
                // Try to parse the matched JSON
                const jsonData = JSON.parse(match[0]);
                return jsonData;
            } catch (e) {
                console.error("Failed to parse extracted JSON:", e);
            }
        }

        return null;
    }

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Word count functionality
    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    const originalText = document.getElementById('original-text');
    const originalWordCount = document.getElementById('original-word-count');

    originalText.addEventListener('input', () => {
        originalWordCount.textContent = countWords(originalText.value);
    });

    // Paraphrase functionality
    const paraphraseBtn = document.getElementById('paraphrase-btn');
    const paraphrasedText = document.getElementById('paraphrased-text');
    const paraphrasedWordCount = document.getElementById('paraphrased-word-count');
    const loadingParaphrase = document.getElementById('loading-paraphrase');

    paraphraseBtn.addEventListener('click', async () => {
        const text = originalText.value.trim();
        if (!text) {
            showToast('Please enter some text to paraphrase', 'error');
            return;
        }

        try {
            loadingParaphrase.classList.remove('hidden');
            paraphrasedText.innerHTML = '';

            const response = await fetch(`${API_BASE_URL}/api/paraphrase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (data.paraphrased) {
                paraphrasedText.innerHTML = data.paraphrased;
                paraphrasedWordCount.textContent = countWords(data.paraphrased);
                showToast('Text paraphrased successfully!', 'success');
            } else {
                showToast(`Error: ${data.error || 'Failed to paraphrase text'}`, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to connect to the server. Please try again later.', 'error');
        } finally {
            loadingParaphrase.classList.add('hidden');
        }
    });

    // Plagiarism check functionality
    const checkPlagiarismBtn = document.getElementById('check-plagiarism-btn');
    const plagiarismOriginal = document.getElementById('plagiarism-original');
    const plagiarismComparison = document.getElementById('plagiarism-comparison');
    const plagiarismScore = document.getElementById('plagiarism-score');
    const plagiarismAnalysis = document.getElementById('plagiarism-analysis');
    const loadingPlagiarism = document.getElementById('loading-plagiarism');

    checkPlagiarismBtn.addEventListener('click', async () => {
        const original = plagiarismOriginal.value.trim();
        const comparison = plagiarismComparison.value.trim();

        if (!original || !comparison) {
            showToast('Please enter both original and comparison texts', 'error');
            return;
        }

        try {
            loadingPlagiarism.classList.remove('hidden');
            plagiarismAnalysis.innerHTML = '';
            plagiarismScore.textContent = '0%';

            const response = await fetch(`${API_BASE_URL}/api/check-plagiarism`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ original, comparison })
            });

            const data = await response.json();

            // Format and display the plagiarism results
            console.log("Received data:", data); // Debug log

            // First, try to handle the response as a properly structured JSON
            if (data.score !== undefined) {
                displayFormattedPlagiarismResults(data);
            }
            // If we have a result field, it might be a JSON string or an object
            else if (data.result) {
                // Try multiple approaches to parse and display the data
                handlePlagiarismResult(data);
            }
            // If we have neither score nor result, show an error
            else {
                showToast(`Error: ${data.error || 'Failed to check plagiarism'}`, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to connect to the server. Please try again later.', 'error');
        } finally {
            loadingPlagiarism.classList.add('hidden');
        }
    });

    // Copy paraphrased text functionality
    const copyBtn = document.getElementById('copy-paraphrased');

    copyBtn.addEventListener('click', () => {
        const text = paraphrasedText.innerText;
        if (!text) {
            showToast('No text to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Text copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy text to clipboard', 'error');
            });
    });

    // Function to display formatted plagiarism results
    function displayFormattedPlagiarismResults(data) {
        // Update the score circle with the actual percentage
        plagiarismScore.textContent = `${data.score}%`;

        // Update the score circle background gradient
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.style.background = `conic-gradient(
            var(--accent-color) ${data.score}%,
            var(--light-gray) ${data.score}%
        )`;

        // Create formatted HTML for the analysis
        let analysisHtml = `<div class="analysis-content">
            <h3>Analysis</h3>
            <p>${data.analysis}</p>`;

        if (data.matches && data.matches.length > 0) {
            analysisHtml += `<h3>Matched Content</h3>
            <div class="matches-container">`;

            data.matches.forEach(match => {
                analysisHtml += `
                <div class="match-item">
                    <div class="match-type ${match.type || 'unknown'}">${match.type || 'Match'}</div>
                    <div class="match-content">
                        <div class="match-original">
                            <strong>Original:</strong> ${match.original}
                        </div>
                        <div class="match-comparison">
                            <strong>Comparison:</strong> ${match.comparison}
                        </div>
                    </div>
                </div>`;
            });

            analysisHtml += `</div>`;
        }

        if (data.recommendation) {
            analysisHtml += `<h3>Recommendation</h3>
            <p>${data.recommendation}</p>`;
        }

        analysisHtml += `</div>`;
        plagiarismAnalysis.innerHTML = analysisHtml;

        showToast('Plagiarism check completed!', 'success');
    }

    // Function to handle plagiarism result data that might be in various formats
    function handlePlagiarismResult(data) {
        // First, try to parse the result if it's a JSON string
        try {
            // The result could be a string or an object
            let jsonData;

            if (typeof data.result === 'string') {
                // Try to extract JSON from the string (it might be wrapped in markdown code blocks)
                // First, try to parse it directly
                try {
                    jsonData = JSON.parse(data.result);
                } catch (parseError) {
                    // If direct parsing fails, try to extract JSON from the string
                    jsonData = extractJsonFromString(data.result);

                    // If extraction fails, throw an error to fall back to raw display
                    if (!jsonData) {
                        throw new Error("Could not extract valid JSON");
                    }
                }
            } else {
                // If it's already an object, use it directly
                jsonData = data.result;
            }

            // If we have a valid JSON object with a score, display it in a formatted way
            if (jsonData && jsonData.score !== undefined) {
                displayFormattedPlagiarismResults(jsonData);
            } else {
                // If the JSON doesn't have the expected structure, display it as formatted JSON
                displayRawJsonResult(data.result);
            }
        } catch (e) {
            console.error("Error handling plagiarism result:", e);
            // If all parsing attempts fail, display the raw result
            displayRawJsonResult(data.result);
        }
    }

    // Function to display raw JSON result with better formatting
    function displayRawJsonResult(result) {
        // Set a placeholder score
        plagiarismScore.textContent = '?%';

        // Format the raw JSON for better readability
        const formattedJson = formatJsonOutput(result);

        // Create a container with a title and the formatted JSON
        const container = `
        <div class="analysis-content">
            <h3>Plagiarism Analysis Results</h3>
            <p class="json-note">The results below show the detailed plagiarism analysis:</p>
            <div class="json-viewer">${formattedJson}</div>
        </div>`;

        // Update the UI
        plagiarismAnalysis.innerHTML = container;

        // Show a toast notification
        showToast('Results displayed in raw format', 'info');
    }

    // Toast notification functionality
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const closeToast = document.querySelector('.close');

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.classList.add('active');

        // Change toast color based on type
        toast.className = 'toast active';
        toast.classList.add(type);

        // Auto close after 5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);
    }

    closeToast.addEventListener('click', () => {
        toast.classList.remove('active');
    });
});