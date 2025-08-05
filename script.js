// Menu Functionality
function myMenuFunction(){
    var navMenu = document.getElementById('navMenu');

    if (navMenu.className === "nav_menu") {
        navMenu.className += " responsive";
    }
    else{
        navMenu.className = "nav_menu";
    }
}

function menuClose(){
    var navMenu = document.getElementById('navMenu');

    navMenu.className = "nav_menu";
}

// Modal Functionality
var modals = document.querySelectorAll(".modal");
var btn = document.querySelectorAll("a.link");
var closeBtn = document.getElementsByClassName("close");
const mediaQuery = window.matchMedia("(max-width: 1084px)");

function handleMediaQueryChange(event) {
    if (event.matches) {
        for(var i = 0; i < btn.length; i++) {
            btn[i].onclick = function(e) {
                e.preventDefault();
                var modal = document.querySelector(e.target.getAttribute("href"));
                modal.style.display = "block";
            }
        }
        for(var i = 0; i < closeBtn.length; i++) {
            closeBtn[i].onclick = function() {
                for (var index in modals) {
                    if (typeof modals[index].style !== 'undefined') {
                        modals[index].style.display = "none";
                    }
                }
            }
        }
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                for (var index in modals) {
                    if (typeof modals[index].style !== 'undefined') {
                        modals[index].style.display = "none";
                    }
                }
            }
        }
    }
    else{
        for(var i = 0; i < btn.length; i++) {
            btn[i].onclick = function(e) {
                e.preventDefault();
                var modal = document.querySelector(e.target.getAttribute("href"));
                modal.style.display = "none";
            }
        }
    }
}

handleMediaQueryChange(mediaQuery)
mediaQuery.addListener(handleMediaQueryChange)

// Navigation Links
const navLink = document.querySelectorAll(".link");

function linkAction(){
    const navMenu = document.getElementById("navMenu");

    navMenu.classList.remove("responsive");
}

navLink.forEach(n => n.addEventListener('click', linkAction));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking
            if(window.innerWidth <= 1084) {
                menuClose();
            }
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation would go here
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Typed.js for hero text
setTimeout(() => {
    new Typed(".multiText",{
        strings: ["Designer","Coder","Developer"],
        loop: true,
        typeSpeed: 100,
        backSpeed: 80,
        backDelay: 2000
    });
}, 1000);

// Chatbot Functionality
const chatbotBtn = document.getElementById("chatbotBtn");
const chatModal = document.getElementById("chatModal");
const closeChat = document.getElementById("closeChat");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendMessageBtn = document.getElementById("sendMessage");

// Open chat modal
chatbotBtn.addEventListener('click', () => {
    chatModal.classList.add("active");
});

// Close chat modal
closeChat.addEventListener('click', () => {
    chatModal.classList.remove("active");
});

// Send message
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    try {
        // Get OpenRouter AI response
        const response = await getOpenRouterResponse(message);
        removeTyping();
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error:', error);
        removeTyping();
        addMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot');
    }
}

// Handle Enter key press
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send button click
sendMessageBtn.addEventListener('click', sendMessage);

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        typingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get OpenRouter AI response
async function getOpenRouterResponse(message) {
    const apiKey = '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';
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    // System context about abdelmoez boucetta
    const systemContext = "You are an AI assistant for abdelmoez boucetta's portfolio website. Abdelmoez is a frontend web developer with 10+ years of experience. " +
        "His skills include HTML, CSS, JavaScript, React, python, C, TypeScript, and Tailwind CSS. " +
        "Projects include E-commerce Website, Task Management App, and Travel Blog Platform. " +
        "Services offered: Web Development, Web Design, Web Hosting, Software Development. " +
        "Contact: boucettamoez23@gmail.com, +213 65 99 01 101, biskra. " +
        "Be professional, concise, and helpful.";
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://abdelmoez-portfolio.com',
            'X-Title': 'abdelmoez boucetta Portfolio'
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
                { role: "system", content: systemContext },
                { role: "user", content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    } else {
        throw new Error('No response from AI');
    }
}
// ---------- File Upload ----------
const fileInput  = document.getElementById('fileInput');
const uploadBtn  = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFile);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  // Only allow small images or text for demo
  if (!file.type.startsWith('image/') && !file.type.startsWith('text/')) {
    alert('Unsupported file type.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const fileHTML = file.type.startsWith('image/')
      ? `<img class="file-preview" src="${reader.result}" alt="upload">`
      : `<pre class="file-preview">${reader.result}</pre>`;
    addMessage(fileHTML, 'user', true); // allow html
  };
  reader.readAsDataURL(file); // images
  if (file.type.startsWith('text/')) reader.readAsText(file);
}

// ---------- Emoji Picker ----------
const emojiBtn   = document.getElementById('emojiBtn');
const emojiPick  = document.getElementById('emojiPicker');

emojiBtn.addEventListener('click', () => {
  emojiPick.classList.toggle('hidden');
});
emojiPick.addEventListener('emoji-click', e => {
  chatInput.value += e.detail.unicode;
  emojiPick.classList.add('hidden');
  chatInput.focus();
});

// ---------- Allow HTML in addMessage ----------
function addMessage(text, sender, isHTML = false) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  if (isHTML) msg.innerHTML = text;
  else msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
