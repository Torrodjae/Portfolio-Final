/// ===== YEAR IN FOOTER =====
document.getElementById('year').textContent = new Date().getFullYear();


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

contactForm.addEventListener('submit', function(e){
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    contactStatus.textContent = "Please fill out all fields.";
    return;
  }

  const subject = encodeURIComponent("Portfolio Contact — " + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:somervilletj0@gmail.com?subject=${subject}&body=${body}`;
  contactStatus.textContent = "Message window opened.";
});


// ===== CHATBOT SETUP =====
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatLog = document.getElementById('chat-log');
const chatSend = document.getElementById('chat-send');
const chatText = document.getElementById('chat-text');

chatToggle.addEventListener('click', () => {
  if (chatWindow.style.display === "block") {
    chatWindow.style.display = "none";
  } else {
    chatWindow.style.display = "block";
    appendBot("Hi! You can ask about skills, experience, my 426 project, or availability.");
  }
});

chatSend.addEventListener('click', handleChat);
chatText.addEventListener('keydown', e => {
  if (e.key === "Enter") {
    handleChat();
  }
});

function appendBot(text){
  const div = document.createElement("div");
  div.className = "bot-msg";
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function appendUser(text){
  const div = document.createElement("div");
  div.className = "user-msg";
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function handleChat(){
  const msg = chatText.value.trim();
  if (!msg) return;

  appendUser(msg);
  chatText.value = "";
  botRespond(msg.toLowerCase());
}


// ===== SIMPLE FUZZY HELPERS (for typo support) =====
function lev(a,b){
  if (!a) return b.length;
  if (!b) return a.length;
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = Math.min(
        m[i-1][j] + 1,
        m[i][j-1] + 1,
        m[i-1][j-1] + (a[j-1] === b[i-1] ? 0 : 1)
      );
    }
  }
  return m[b.length][a.length];
}

function fuzzyContains(text, wordList, max = 2){
  const cleaned = text.replace(/[^a-z0-9\s]/g, " "); // remove punctuation
  const pieces = cleaned.split(/\s+/);
  for (const w of wordList){
    for (const p of pieces){
      if (!p) continue;
      if (p.includes(w) || w.includes(p) || lev(p, w) <= max) {
        return true;
      }
    }
  }
  return false;
}


// ===== BOT RESPONSES (handles full questions now) =====
function botRespond(q){
  // GREETINGS
  if (
    q.includes("hello") || q.includes("hi ") || q.startsWith("hi") ||
    q.includes("hey") || q.includes("yo ")
  ){
    appendBot("Hello! You can ask about skills, experience, my 426 project, or availability.");
    return;
  }

  // SKILLS (handles full questions like “what are his skills”)
  if (
    q.includes("skill") || q.includes("skills") ||
    q.includes("what can he do") ||
    fuzzyContains(q, ["skill","skills"])
  ){
    appendBot(
      "Skills: Microsoft 365 Administration (Exchange, SharePoint, Teams, OneDrive), " +
      "Active Directory & Group Policy, Zoho Creator & Deluge scripting, Power Automate & Power Apps integration, " +
      "endpoint management, database design, and technical support & staff training."
    );
    return;
  }

  // EXPERIENCE (handles “what’s his experience / experiences”)
  if (
    q.includes("experience") || q.includes("experiences") ||
    q.includes("work history") ||
    fuzzyContains(q, ["experience","experiences"])
  ){
    appendBot(
      "Experience: Account management and onboarding/offboarding across multiple houses, " +
      "automated weekly exception reporting for 9 facilities, Microsoft 365 tenant support and access troubleshooting, " +
      "and pulling data transaction forms for Walmart."
    );
    return;
  }

  // AVAILABILITY (handles “what’s his availability” etc.)
  if (
    q.includes("availability") || q.includes("available") ||
    q.includes("hours") || q.includes("schedule") ||
    q.includes("when can he work") ||
    fuzzyContains(q, ["availability","available","hours","schedule"])
  ){
    appendBot("Availability: Monday–Friday, 6:00 AM to 8:00 PM.");
    return;
  }

  // PROJECT (handles “what’s his project about” etc.)
  if (
    q.includes("project") || q.includes("426") ||
    q.includes("network") && q.includes("security") ||
    fuzzyContains(q, ["project","426","network","security"])
  ){
    appendBot(
      "My CTEC 426 project is a network and security design for a small-to-medium environment. " +
      "It covers VLAN segmentation, role-based access control, device hardening steps, and a risk mitigation checklist, " +
      "with documentation that an operations team could actually follow."
    );
    return;
  }

  // FALLBACK
  appendBot("I didn’t recognize that. Try asking about: skills, experience, my project, or availability.");
}

