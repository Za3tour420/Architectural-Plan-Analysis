document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check localStorage for saved preference
    if (localStorage.getItem('dark-mode') === 'true') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☀️ Light Mode';
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        toggleButton.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';

        // Save preference to localStorage
        localStorage.setItem('dark-mode', isDarkMode);
    });

    // Send message logic
    document.querySelector('button.btn-primary').addEventListener('click', sendMessage);

    function sendMessage() {
        const chatBox = document.getElementById('chat-box');
        const promptInput = document.getElementById('user-prompt');
        const fileInput = document.getElementById('file-input');

        const formData = new FormData();
        formData.append('user_prompt', promptInput.value);
        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        // Display user message in chat box
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.innerHTML = `<strong>You:</strong> ${promptInput.value}`;
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear input fields
        promptInput.value = '';
        fileInput.value = '';

        // Add placeholder for assistant's response
        const assistantMessage = document.createElement('div');
        assistantMessage.classList.add('assistant-message');
        const uniqueId = 'response-stream-' + new Date().getTime(); // Unique ID for this interaction
        assistantMessage.innerHTML = `<div id="${uniqueId}"></div>`;
        chatBox.appendChild(assistantMessage);

        // Add separator after each interaction
        const separator = document.createElement('hr');
        chatBox.appendChild(separator);

        // Initialize Markdown converter
        const converter = new showdown.Converter();

        // Stream response handling
        fetch('/analyze', {
            method: 'POST',
            body: formData
        }).then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const responseStream = document.getElementById(uniqueId); // Access dynamically created element by ID
            let buffer = ''; // Buffer for collecting the entire response

            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        // Once the stream is finished, convert the entire buffer to Markdown
                        const htmlResponse = converter.makeHtml(buffer);
                        responseStream.innerHTML = htmlResponse; // Render properly formatted response
                        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
                        return;
                    }

                    // Decode the current chunk and append it to the buffer
                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk; // Append the chunk to the buffer

                    // Update the placeholder with the plain text as it streams
                    responseStream.textContent += chunk; // Plain text while streaming
                    chatBox.scrollTop = chatBox.scrollHeight; // Scroll down
                    read(); // Continue reading
                });
            }

            read();
        });
    }
});
