const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve the HTML, CSS, and JS directly from this file
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-commerce Chatbot</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            
            .chat-container {
                display: flex;
                width: 80vw;
                height: 80vh;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
                background-color: white;
            }
            
            .instructions {
                width: 30%;
                padding: 15px;
                background-color: #007bff;
                color: white;
                font-size: 14px;
                line-height: 1.5;
                border-right: 1px solid #ccc;
                overflow-y: auto;
                height: 100%;
            }
            
            #chatbox {
                width: 70%;
                padding: 10px;
                max-height: 90%;
                overflow-y: auto;
                border-bottom: 1px solid #ccc;
            }
            
            .chat-message {
                padding: 8px;
                margin: 5px 0;
                border-radius: 5px;
                max-width: 80%;
                word-wrap: break-word;
            }
            
            .bot-message {
                background-color: #e1ffc7;
                align-self: flex-start;
            }
            
            .user-message {
                background-color: #add8e6;
                align-self: flex-end;
            }
            
            input[type="text"] {
                width: 70%;
                padding: 10px;
                border: none;
                border-top: 1px solid #ccc;
                box-sizing: border-box;
                font-size: 16px;
            }
            
            button {
                width: 50%;
                border: none;
                background-color: #007bff;
                color: white;
                font-size: 16px;
                padding: 10px;
                cursor: pointer;
                margin-left: 10px;
            }
            
            button:hover {
                background-color: #0056b3;
            }
            
            .option-button {
                display: block;
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                background-color: #007bff;
                color: white;
                border: none;
                text-align: left;
                cursor: pointer;
            }
            
            .option-button:hover {
                background-color: #0056b3;
            }
            
            .language-selector {
                margin: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="chat-container">
            <div class="instructions">
                <h3>General Instructions</h3>
                <ul>
                    <li>This is an automated chatbot.</li>
                    <li>Responses are pre-generated for common queries.</li>
                    <li>If your question isn't answered, please contact customer support.</li>
                    <li>This bot handles inquiries about orders, refunds, and general questions.</li>
                    <li>Personal information should not be shared here for security reasons.</li>
                    <li>If you have an urgent issue, call us at 99xxxxxx or email xyz@gmail.com.</li>
                </ul>
            </div>
            <div id="chatbox">
                <div class="chat-message bot-message">
                    Hello! How can I assist you today?
                </div>
            </div>
            <div style="display: flex; align-items: center; padding: 10px;">
                <input id="userInput" type="text" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Send</button>
            </div>
            <div class="language-selector">
                <label for="language">Choose Language:</label>
                <select id="language" onchange="changeLanguage()">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
        </div>
        <script>
            let currentLanguage = 'en';
            
            function sendMessage() {
                const inputField = document.getElementById("userInput");
                const message = inputField.value.trim();
                if (message) {
                    displayMessage(message, "user-message");
                    processUserMessage(message);
                    inputField.value = "";
                }
            }
            
            function displayMessage(message, className) {
                const chatbox = document.getElementById("chatbox");
                const messageDiv = document.createElement("div");
                messageDiv.className = \`chat-message \${className}\`;
                messageDiv.textContent = message;
                chatbox.appendChild(messageDiv);
                chatbox.scrollTop = chatbox.scrollHeight;
            }

            function displayOptions(options) {
                const chatbox = document.getElementById("chatbox");
                options.forEach(option => {
                    const optionButton = document.createElement("button");
                    optionButton.className = "option-button";
                    optionButton.textContent = option;
                    optionButton.onclick = () => handleOptionClick(option);
                    chatbox.appendChild(optionButton);
                });
                chatbox.scrollTop = chatbox.scrollHeight;
            }

            function handleOptionClick(option) {
                displayMessage(option, "user-message");
                setTimeout(() => {
                    displayMessage("We have received your response and are currently processing. We will soon reach out to you.", "bot-message");
                }, 500);
            }

            async function processUserMessage(message) {
                try {
                    const response = await fetch('/message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            language: currentLanguage
                        }),
                    });

                    const data = await response.json();
                    displayMessage(data.reply, "bot-message");
                    
                    if (data.options) {
                        displayOptions(data.options);
                    }
                } catch (error) {
                    displayMessage("Sorry, there was an error processing your request.", "bot-message");
                }
            }
            
            function handleKeyPress(event) {
                if (event.key === "Enter") {
                    sendMessage();
                }
            }
            
            function changeLanguage() {
                const languageSelect = document.getElementById("language");
                currentLanguage = languageSelect.value;
                displayMessage(\`Language changed to \${currentLanguage === 'en' ? 'English' : 'Hindi'}\`, "bot-message");
            }
        </script>
    </body>
    </html>
    `);
});

// Bot responses
const botResponses = {
    en: {
        greeting: "Hello! How can I assist you today?",
        help: "I'm here to help you with any questions you might have.",
        fallback: "I'm sorry, I didn't understand that. Could you please rephrase?",
        refund: "Refunds are processed within 5-7 business days. When did you apply for a refund?",
        thanks: "We are glad to help you. If there is anything we can help you with, we would love to do so.",
        transaction: "You can track your transaction through your account dashboard. Would you like more details?",
        office: "Our main office is located at 123 Main Street, Your City, Your Country.",
        terms: "You can review our terms and conditions on our website under the 'Legal' section. Would you like the link?",
        order: "You can track your order status through your account dashboard. When did you place the order?"
    },
    hi: {
        greeting: "नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
        help: "मैं यहाँ आपके किसी भी सवाल में आपकी सहायता के लिए हूँ।",
        fallback: "मुझे खेद है, मैं समझ नहीं पाया। कृपया इसे दोबारा कहें।",
        refund: "रिफंड 5-7 व्यावसायिक दिनों के भीतर संसाधित किए जाते हैं। आपने रिफंड के लिए कब आवेदन किया था?",
        thanks: "हम आपकी सहायता करके खुश हैं। अगर कोई और चीज़ है जिसमें हम आपकी मदद कर सकते हैं, तो हमें बताएं।",
        transaction: "आप अपने खाते के डैशबोर्ड के माध्यम से अपनी लेन-देन को ट्रैक कर सकते हैं। क्या आप और विवरण चाहेंगे?",
        office: "हमारा मुख्य कार्यालय 123 मेन स्ट्रीट, आपका शहर, आपका देश में स्थित है।",
        terms: "आप हमारी वेबसाइट के 'लीगल' सेक्शन में हमारी शर्तें और नीतियां देख सकते हैं। क्या आप लिंक चाहते हैं?",
        order: "आप अपने खाते के डैशबोर्ड के माध्यम से अपनी ऑर्डर स्थिति को ट्रैक कर सकते हैं। आपने ऑर्डर कब किया था?"
    }
};

// POST endpoint to process the user message
app.post('/message', (req, res) => {
    const { message, language } = req.body;

    let reply;
    let options;

    if (message.toLowerCase().includes("help")) {
        reply = botResponses[language].help;
    } else if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
        reply = botResponses[language].greeting;
    } else if (message.toLowerCase().includes("refund")) {
        reply = botResponses[language].refund;
        options = ["1 day ago", "a week ago", "1 month ago"];
    } else if (message.toLowerCase().includes("thanks") || message.toLowerCase().includes("thank you")) {
        reply = botResponses[language].thanks;
    } else if (message.toLowerCase().includes("transaction")) {
        reply = botResponses[language].transaction;
        options = ["Track my transaction", "Need more details"];
    } else if (message.toLowerCase().includes("office")) {
        reply = botResponses[language].office;
    } else if (message.toLowerCase().includes("terms")) {
        reply = botResponses[language].terms;
        options = ["Yes, please", "No, thanks"];
    } else if (message.toLowerCase().includes("order")) {
        reply = botResponses[language].order;
        options = ["1 day ago", "a week ago", "1 month ago"];
    } else {
        reply = botResponses[language].fallback;
    }

    res.json({ reply, options });
});

app.listen(port, () => {
console.log(`Server running on port ${port}`);});
