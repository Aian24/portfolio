// AI Chat functionality
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const chatSend = document.getElementById('chatSend');
const chatBubble = document.getElementById('chatBubble');
const chatBubbleText = document.getElementById('chatBubbleText');
const chatBubbleClose = document.getElementById('chatBubbleClose');
const chatNotification = document.getElementById('chatNotification');

// Bubble messages array
const bubbleMessages = [
  "💡 Ask me about Mark's work experience!",
  "💡 Want to know about his skills? Just ask!",
  "💡 Curious about his projects? I can help!",
  "💡 Ask me anything about Mark's background!",
  "💡 Need info about his education? Ask away!",
  "💡 Want to know what Mark does? I'm here to help!",
  "💡 Ask me about Mark's technical expertise!",
  "💡 Curious about his current role? Just ask!",
  "👋 Hi! I can answer questions about Mark!",
  "💬 Click me to chat about Mark's experience!"
];

let bubbleTimeout;
let inactivityTimeout;
let lastActivity = Date.now();
let bubbleDismissed = false;
let conversationHistory = []; // Store conversation history for context

// Resume/Portfolio context for AI
const resumeContext = `
Mark Adrian Basagre - Web Developer
Email: aianbasagre@gmail.com
Location: Antipolo City, Rizal

PROFESSIONAL EXPERIENCE:

1. Programmer at RustyLopez (Current, 2 years and 1 month)
   - Created web-based system for temporary Acknowledge Report Receipt using HTML, CSS (Bootstrap), PHP, MySQL, and JavaScript
   - Developed web-based Shoe Name Picker using HTML, CSS (Tailwind), PHP, MySQL, and JavaScript
   - Managing RustyLopez E-commerce website (WordPress)
   - Updating database of PC count for Audit department using MySQL Server and RPro9
   - Troubleshooting computers of all departments
   - Reprogramming/Formatting Windows OS
   - Created Android barcode scanning application using Android Studio and Java
   - Developed lclopezresources.com for daily collection management, integrated with Sunmi V2S POS system

2. UI/UX and Frontend at TabulateCRM (Remote, USA-based)
   - Led UI/UX and frontend implementation for TabulateCRM interfaces
   - Built responsive components and pages using Tailwind CSS, HTML, and JavaScript
   - Created visual assets and layouts using Canva
   - Collaborated asynchronously across time zones in remote setup

TECHNICAL SKILLS:
- Web: HTML, CSS, JavaScript, PHP, MySQL, Tailwind CSS, Bootstrap
- CMS: WordPress
- Mobile: Android Studio, Java
- Systems: POS Systems, Computer Troubleshooting

PROJECTS:
- LC Lopez Resources Website: Comprehensive website for managing daily collections from tenants, integrated with Sunmi V2S POS
- Acknowledge Report Receipt System: Web-based system for managing and generating temporary acknowledge report receipts
- Shoe Name Picker System: Specialized web app to manage and organize shoe names
- Barcode Scanner Application: Mobile app for efficient barcode scanning and inventory management
- TabulateCRM: UI/UX and Frontend work for USA-based CRM

EDUCATION:
- BSIT, Our Lady of Fatima University (2019-2023)
- STEM, Our Lady of Fatima University (2017-2019)

OBJECTIVE:
A highly disciplined and hard-working individual looking for opportunities to enhance skills and knowledge while contributing to organizational growth.
`;

// Show chat bubble
function showChatBubble(message) {
  if (!chatBubble || bubbleDismissed) return;

  chatBubbleText.textContent = message;
  chatBubble.classList.remove('hidden');
  // Use requestAnimationFrame to ensure smooth transition
  requestAnimationFrame(() => {
    chatBubble.style.opacity = '1';
    chatBubble.style.transform = 'translateY(0)';
  });
  if (chatNotification) {
    chatNotification.classList.remove('hidden');
  }

  // Auto hide after 8 seconds
  clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => {
    hideChatBubble();
  }, 8000);
}

// Hide chat bubble
function hideChatBubble() {
  if (!chatBubble) return;
  chatBubble.style.opacity = '0';
  setTimeout(() => {
    if (chatBubble.style.opacity === '0') {
      chatBubble.classList.add('hidden');
    }
  }, 300); // Wait for transition
  if (chatNotification) {
    chatNotification.classList.add('hidden');
  }
}

// Show random bubble message
function showRandomBubble() {
  if (bubbleDismissed || !chatWidget.classList.contains('hidden')) return;
  const randomMessage = bubbleMessages[Math.floor(Math.random() * bubbleMessages.length)];
  showChatBubble(randomMessage);
}

// Reset inactivity timer
function resetInactivityTimer() {
  lastActivity = Date.now();
  clearTimeout(inactivityTimeout);

  // Show bubble after 20 seconds of inactivity if chat is closed
  if (chatWidget.classList.contains('hidden') && !bubbleDismissed) {
    inactivityTimeout = setTimeout(() => {
      if (chatWidget.classList.contains('hidden') && !bubbleDismissed) {
        showRandomBubble();
      }
    }, 20000);
  }
}

// Close bubble button
if (chatBubbleClose) {
  chatBubbleClose.addEventListener('click', (e) => {
    e.stopPropagation();
    bubbleDismissed = true;
    hideChatBubble();
  });
}

// Show initial bubble after page load
setTimeout(() => {
  if (!bubbleDismissed) {
    showChatBubble("👋 Hi! Click me to ask about Mark's experience, skills, or projects!");
  }
}, 2000);

// Show bubble periodically when chat is closed
setInterval(() => {
  if (chatWidget.classList.contains('hidden') && !bubbleDismissed && Math.random() > 0.7) {
    showRandomBubble();
  }
}, 45000); // Every 45 seconds

// Toggle chat widget
chatToggle.addEventListener('click', () => {
  chatWidget.classList.toggle('hidden');
  hideChatBubble(); // Hide bubble when opening chat

  if (!chatWidget.classList.contains('hidden')) {
    chatInput.focus();
    resetInactivityTimer();
    // Reset conversation if it's the first time opening
    if (conversationHistory.length === 0) {
      conversationHistory = [];
    }
  } else {
    clearTimeout(inactivityTimeout);
    // Show bubble again after closing chat
    setTimeout(() => {
      if (!bubbleDismissed) {
        showChatBubble("💬 Ask me anything about Mark!");
      }
    }, 1000);
  }
});

chatClose.addEventListener('click', () => {
  chatWidget.classList.add('hidden');
  clearTimeout(inactivityTimeout);
  // Show bubble after closing
  setTimeout(() => {
    if (!bubbleDismissed) {
      showChatBubble("💬 I'm here if you have questions!");
    }
  }, 1000);
});

// Track user activity
chatInput.addEventListener('input', resetInactivityTimer);
chatInput.addEventListener('focus', resetInactivityTimer);
chatForm.addEventListener('submit', resetInactivityTimer);

// Add message to chat
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} opacity-0 animate-slideUp`;
  messageDiv.style.animation = 'slideUp 0.3s ease-out forwards';

  const avatar = document.createElement('div');
  avatar.className = `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-slate-700' : 'bg-slate-700'
    }`;

  if (!isUser) {
    avatar.innerHTML = `
      <svg class="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;
  } else {
    avatar.innerHTML = `
      <svg class="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;
  }

  const content = document.createElement('div');
  content.className = `flex-1 ${isUser ? 'text-right' : ''}`;
  const textP = document.createElement('p');
  textP.className = `text-sm ${isUser ? 'text-white bg-slate-700 inline-block px-3 py-2 rounded-lg' : 'text-slate-300'}`;
  textP.textContent = text;
  content.appendChild(textP);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Reset inactivity timer
  resetInactivityTimer();
}

// Show loading state
function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loadingMessage';
  loadingDiv.className = 'flex items-start gap-3';
  loadingDiv.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
      <svg class="w-4 h-4 text-slate-300 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <div class="flex-1">
      <p class="text-sm text-slate-300">Thinking...</p>
    </div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoading() {
  const loading = document.getElementById('loadingMessage');
  if (loading) loading.remove();
}

// Get API key from config or use fallback
async function getApiKey() {
  try {
    const response = await fetch('assets/js/config.json');
    const config = await response.json();
    const apiKey = config.openaiApiKey;

    // Check if API key is valid
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 20) {
      return apiKey;
    }
    return null;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

// Generate AI response using OpenAI API
async function generateAIResponse(userMessage) {
  const apiKey = await getApiKey();

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    // Fallback: Improved pattern matching with conversation context
    return generateFallbackResponse(userMessage);
  }

  try {
    // Add user message to conversation history
    conversationHistory.push({ role: 'user', content: userMessage });

    // Keep only last 10 messages for context (to avoid token limits)
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Mark Adrian Basagre's AI assistant. You are confident, knowledgeable, and conversational. You represent Mark professionally and enthusiastically.

IMPORTANT INSTRUCTIONS:
- Be natural and conversational, like a real person chatting
- When asked about Mark's abilities or if he's a good developer, be confident and positive based on his experience
- Use the information below to answer questions, but be conversational, not robotic
- If someone asks "is Mark a great developer?" or similar, confidently highlight his experience, skills, and projects
- Be friendly, engaging, and show enthusiasm about Mark's work
- Keep responses natural and human-like, not like a FAQ bot
- You can give opinions and assessments based on Mark's background

MARK'S BACKGROUND:
${resumeContext}

Remember: You're representing Mark, so be proud of his accomplishments and speak confidently about his skills and experience.`
      },
      ...conversationHistory
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 400,
        temperature: 0.9 // Higher temperature for more natural, varied responses
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();

    // Add AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    return aiResponse;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Remove the user message from history if API failed
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
      conversationHistory.pop();
    }
    return generateFallbackResponse(userMessage);
  }
}

// Fallback response system (pattern matching with conversation context)
function generateFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Greetings and casual conversation
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|sup|what's up|howdy)/i)) {
    const greetings = [
      "Hello! 👋 Nice to meet you! I'm here to help answer questions about Mark's experience, skills, projects, or background. What would you like to know?",
      "Hi there! 😊 I'd be happy to tell you about Mark. Feel free to ask me anything about his work, skills, or projects!",
      "Hey! 👋 Great to chat with you! I can help you learn about Mark's professional background. What interests you?",
      "Hello! Nice to see you! I'm here to share information about Mark. What would you like to know about him?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Thank you responses
  if (message.match(/^(thanks|thank you|ty|appreciate it)/i)) {
    return "You're welcome! 😊 Is there anything else you'd like to know about Mark?";
  }

  // How are you / how's it going
  if (message.match(/^(how are you|how's it going|how are things|what's up|how do you do)/i)) {
    return "I'm doing great, thanks for asking! 😊 I'm here and ready to help you learn about Mark. What would you like to know?";
  }

  // Experience questions
  if (message.includes('experience') || message.includes('work') || message.includes('job') || message.includes('position')) {
    return "Mark has 2+ years of experience as a Programmer at RustyLopez, where he's built web systems, managed WordPress sites, and developed mobile apps. He also worked remotely as UI/UX and Frontend developer for TabulateCRM, a USA-based company. Would you like to know more about his specific projects?";
  }

  // Skills questions
  if (message.includes('skill') || message.includes('technology') || message.includes('tech stack') || message.includes('technologies') || message.includes('what can') || message.includes('what does')) {
    return "Mark's skills include HTML, CSS, JavaScript, PHP, MySQL, Tailwind CSS, Bootstrap, WordPress, Android Studio, Java, and POS systems. He also does computer troubleshooting. He's well-versed in both front-end and back-end development!";
  }

  // Projects questions
  if (message.includes('project') || message.includes('built') || message.includes('created') || message.includes('developed') || message.includes('portfolio')) {
    return "Mark has built several projects including LC Lopez Resources website (with POS integration), Acknowledge Report Receipt System, Shoe Name Picker System, Barcode Scanner App, and worked on TabulateCRM frontend. Would you like details on any specific project?";
  }

  // Education questions
  if (message.includes('education') || message.includes('degree') || message.includes('school') || message.includes('university') || message.includes('studied') || message.includes('graduate')) {
    return "Mark has a BSIT degree from Our Lady of Fatima University (2019-2023) and completed STEM there as well (2017-2019). He's been building his skills in web development ever since!";
  }

  // Resume/CV/Download questions
  if (message.includes('resume') || message.includes('cv') || message.includes('download') || message.includes('curriculum vitae')) {
    return "You can view and download Mark's resume by clicking the 'Resume' button in the hero section at the top of the page, or you can visit the resume page directly at resume/index.html. It has all the details about his experience, skills, and education!";
  }

  // Contact questions
  if (message.includes('contact') || message.includes('email') || message.includes('reach') || message.includes('get in touch') || message.includes('connect')) {
    return "You can reach Mark at aianbasagre@gmail.com. He's located in Antipolo City, Rizal, Philippines. Feel free to reach out if you'd like to work together!";
  }

  // Current position
  if (message.includes('current') || message.includes('now') || message.includes('currently') || message.includes('where does') || message.includes('what does')) {
    return "Mark is currently working as a Programmer at RustyLopez, where he's been for 2 years and 1 month. He builds web systems, manages WordPress sites, and handles IT tasks. He's also done remote work for TabulateCRM as a UI/UX and Frontend developer!";
  }

  // Who is Mark / tell me about Mark
  if (message.includes('who is') || message.includes('tell me about') || message.includes('about mark') || message.match(/^what.*mark/i)) {
    return "Mark Adrian Basagre is a passionate web developer with 2+ years of experience. He specializes in building responsive web applications using modern technologies like HTML, CSS, JavaScript, PHP, and MySQL. He's worked on various projects from e-commerce sites to mobile apps. What specific aspect interests you?";
  }

  // Is Mark a great/good developer questions
  if (message.includes('great developer') || message.includes('good developer') || message.includes('is mark') && (message.includes('good') || message.includes('great') || message.includes('skilled') || message.includes('talented'))) {
    return "Absolutely! Mark is a skilled developer with 2+ years of professional experience. He's built multiple web systems, managed e-commerce sites, developed mobile apps, and worked on UI/UX for international clients. His experience with both front-end and back-end technologies, plus his ability to work remotely with international teams, shows he's a capable and versatile developer. He's currently working at RustyLopez and has successfully delivered projects like LC Lopez Resources and TabulateCRM frontend work.";
  }

  // Default response - more conversational
  const defaultResponses = [
    "That's interesting! I can help you learn about Mark's experience, skills, projects, education, or contact information. What would you like to know?",
    "I'd be happy to help! You can ask me about Mark's work experience, technical skills, projects he's built, his education, or how to contact him. What interests you?",
    "Great question! I can tell you about Mark's professional background, skills, projects, or education. What would you like to learn about?",
    "I'm here to help! Feel free to ask about Mark's experience, skills, projects, education, or anything else about his background. What would you like to know?"
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Add user message
  addMessage(userMessage, true);
  chatInput.value = '';
  chatSend.disabled = true;

  // Show loading
  showLoading();

  // Generate and add AI response
  const aiResponse = await generateAIResponse(userMessage);
  removeLoading();
  addMessage(aiResponse);

  chatSend.disabled = false;
  chatInput.focus();

  // Hide bubble when user starts chatting
  hideChatBubble();
});

// Allow Enter key to send
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});
