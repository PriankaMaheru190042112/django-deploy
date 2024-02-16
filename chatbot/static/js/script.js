const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
// const API_KEY = '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'; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Creating a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Defining the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Sending POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Geting user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clearing the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Appending the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjusting the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

const dummyChatHistoryTitles = ["Conversation 1", "Conversation 2", "Conversation 3"];
const createClickableElement = (title) => {
    const clickableElement = document.createElement('div');
    clickableElement.classList.add('clickable-item');
    clickableElement.textContent = title;

    clickableElement.addEventListener('click', () => {
    console.log(`Clicked on ${title}`);
    });
    return clickableElement;
};
const renderClickableElements = () => {
    const chatHistoryList = document.querySelector('.chat-history-list');

    dummyChatHistoryTitles.forEach((title) => {
    const clickableElement = createClickableElement(title);
    chatHistoryList.appendChild(clickableElement);
    });
};
renderClickableElements();

const conversationHeader = document.getElementById("conversationHeader");
const conversationNumber = dummyChatHistoryTitles.length + 1;
conversationHeader.textContent = `Conversation ${conversationNumber}`;
      


sendChatBtn.addEventListener("click", handleChat);

// Setting the initial state to show the chatbox
document.body.classList.add("show-chatbot");
