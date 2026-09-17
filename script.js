// Navbar Scroll Effect & Hide/Show Logic
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('scroll-progress');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Progress Bar Logic
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (currentScrollY / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;

    // Scrolled state (background blur & padding)
    if (currentScrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/Show navbar on scroll up/down
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        navbar.classList.add('hidden');
    } else {
        // Scrolling up
        navbar.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
});

// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const menuIcon = menuToggle.querySelector('i');

const closeMobileMenu = () => {
    mobileNav.classList.remove('active');
    menuIcon.classList.remove('ri-close-line');
    menuIcon.classList.add('ri-menu-line');
    document.body.style.overflow = 'auto';
};

menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    
    if (mobileNav.classList.contains('active')) {
        menuIcon.classList.remove('ri-menu-line');
        menuIcon.classList.add('ri-close-line');
        document.body.style.overflow = 'hidden';
    } else {
        closeMobileMenu();
    }
});

// Scroll Spy (Intersection Observer)
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

const scrollSpyOptions = {
    root: null,
    rootMargin: "-20% 0px -40% 0px", // Trigger when section is roughly in the middle
    threshold: 0
};

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // Remove active class from all links
            navItems.forEach(item => {
                item.classList.remove('active');
                
                // Add active class if href matches the section id
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, scrollSpyOptions);

sections.forEach(section => {
    scrollSpyObserver.observe(section);
});

// Smooth Scroll with Centering
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if(mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }

            // Scroll into view centering the block
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    });
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
};

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// =========================================
// Interactive macOS Terminal Logic (mdm-ai-engine.sh)
// =========================================
const terminalWidget = document.getElementById('terminalWidget');
const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
const termRedDot = document.getElementById('termRedDot');
const termYellowDot = document.getElementById('termYellowDot');
const termGreenDot = document.getElementById('termGreenDot');
const termBadges = document.querySelectorAll('.term-badge');

const terminalCommands = {
    help: `<p class="terminal-line term-info">Available Commands:</p>
           <p class="terminal-line">  <span class="term-prompt">skills</span>    - View technical stack & AI expertise</p>
           <p class="terminal-line">  <span class="term-prompt">projects</span>  - Highlights of key AI & full-stack builds</p>
           <p class="terminal-line">  <span class="term-prompt">education</span> - Academic background & publication</p>
           <p class="terminal-line">  <span class="term-prompt">whoami</span>    - Quick bio of Mark Dennis Manangan</p>
           <p class="terminal-line">  <span class="term-prompt">matrix</span>    - Run green neural rain stream</p>
           <p class="terminal-line">  <span class="term-prompt">clear</span>     - Clear terminal screen</p>`,

    skills: `<p class="terminal-line term-success">🧠 AI / Computer Vision:</p>
            <p class="terminal-line">  TensorFlow, PyTorch, CNN Architectures, Transfer Learning, OpenCV</p>
            <p class="terminal-line term-info">⚡ Full Stack & Backend:</p>
            <p class="terminal-line">  ASP.NET Core, C#, React.js, JavaScript (ES6+), HTML5/CSS3</p>
            <p class="terminal-line term-success">⚙️ Cloud, Databases & Automation:</p>
            <p class="terminal-line">  SQL Server, PostgreSQL, OneDrive Graph API, Python Scripting</p>`,

    projects: `<p class="terminal-line term-info">📌 Featured Projects:</p>
              <p class="terminal-line">1. <b>Crab Gender Classification CNN</b> - Evaluated 5 CNN models with 98% accuracy (Published in Thailand)</p>
              <p class="terminal-line">2. <b>Leslie Corp Document Automation</b> - OneDrive Graph API pipeline (99.9% reliability)</p>
              <p class="terminal-line">3. <b>Hitachi Astemo ADAS QA</b> - AI Video Data Annotation for Autonomous Driving</p>`,

    education: `<p class="terminal-line term-success">🎓 STI West Negros University (Bacolod City, Negros Occidental)</p>
               <p class="terminal-line">  Bachelor of Science in Computer Science (Sept 2020 – June 2025)</p>
               <p class="terminal-line term-info">📜 International Publication & Awards:</p>
               <p class="terminal-line">  12th Huachiew Chalermprakiet University Conference (Thailand) • Top 1 Best CS System Analyst</p>`,

    whoami: `<p class="terminal-line term-info">Mark Dennis Manangan — AI Engineer • Full Stack Developer • Automation Specialist</p>
            <p class="terminal-line">Currently Junior Web Developer @ Leslie Corporation. Passionate about AI solutions and scalable web engines.</p>`
};

function executeTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
        if (terminalOutput) terminalOutput.innerHTML = '';
        return;
    }

    if (cmd === 'matrix') {
        runMatrixRain();
        return;
    }

    // Append Command Input Line
    const cmdLine = document.createElement('p');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="term-prompt">$</span> ${escapeHtml(cmdRaw)}`;
    if (terminalOutput) terminalOutput.appendChild(cmdLine);

    // Output Response
    const responseHTML = terminalCommands[cmd] || `<p class="terminal-line" style="color:#F87171;">Command not found: '${escapeHtml(cmd)}'. Type <span class="term-prompt">'help'</span> for list of commands.</p>`;
    const responseEl = document.createElement('div');
    responseEl.className = 'term-cmd-response';
    responseEl.innerHTML = responseHTML;
    if (terminalOutput) terminalOutput.appendChild(responseEl);

    // Scroll to bottom
    const terminalBody = document.getElementById('terminalBody');
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runMatrixRain() {
    if (!terminalOutput) return;
    const cmdLine = document.createElement('p');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="term-prompt">$</span> matrix`;
    terminalOutput.appendChild(cmdLine);

    const matrixLine = document.createElement('p');
    matrixLine.className = 'terminal-line term-success';
    matrixLine.textContent = 'Executing Neural Matrix stream...';
    terminalOutput.appendChild(matrixLine);

    const chars = '010101010101010101010101010101010101';
    let count = 0;
    const interval = setInterval(() => {
        let stream = '';
        for (let i = 0; i < 40; i++) {
            stream += chars[Math.floor(Math.random() * chars.length)];
        }
        matrixLine.textContent = stream;
        count++;
        if (count > 25) {
            clearInterval(interval);
            matrixLine.textContent = '✔ Neural Matrix sync complete.';
        }
    }, 70);
}

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });
}

termBadges.forEach(badge => {
    badge.addEventListener('click', () => {
        const cmd = badge.getAttribute('data-cmd');
        if (cmd) executeTerminalCommand(cmd);
    });
});

if (termRedDot) {
    termRedDot.addEventListener('click', () => {
        if (terminalOutput) terminalOutput.innerHTML = '';
    });
}

if (termYellowDot) {
    termYellowDot.addEventListener('click', () => {
        if (terminalWidget) terminalWidget.classList.toggle('collapsed');
    });
}

if (termGreenDot) {
    termGreenDot.addEventListener('click', () => {
        if (terminalWidget) terminalWidget.classList.toggle('glow-mode');
    });
}


// =========================================
// Floating AI Assistant Modal Logic
// =========================================
const aiFabBtn = document.getElementById('aiFabBtn');
const aiModal = document.getElementById('aiModal');
const aiModalClose = document.getElementById('aiModalClose');
const aiChatBody = document.getElementById('aiChatBody');
const promptChips = document.querySelectorAll('.prompt-chip');
const aiChatForm = document.getElementById('aiChatForm');
const aiChatInput = document.getElementById('aiChatInput');

const responses = {
    skills: "Mark specializes in **AI & Computer Vision** (TensorFlow, CNNs, Transfer Learning), **Full Stack Development** (React, ASP.NET, C#), **Database Architecture** (SQL Server, PostgreSQL), and **Workflow Automations** (OneDrive Graph API, Python pipelines).",
    experience: "Mark is currently a **Junior Web Developer at Leslie Corporation** (built automated document pipelines & optimized SQL APIs). Previously, he was an **AI Data & QA Contributor at Anosupo** (Hitachi Astemo ADAS & ZOZO NEXT AI virtual try-on).",
    thesis: "Mark co-authored an internationally published research paper at the **12th Huachiew Chalermprakiet University International Academic Conference (Thailand)** evaluating 5 CNN architectures for Blue Swimming Crab Gender Classification with 98% accuracy!",
    projects: "Key featured builds include:\n• **Crab CNN Classifier** (98% Accuracy, 5 Models Evaluated)\n• **Leslie Corp Automated Document Pipeline** (OneDrive Graph API)\n• **Hitachi ADAS AI QA** (Video Dataset Annotations)",
    education: "Mark graduated with a **Bachelor of Science in Computer Science** from **STI West Negros University** (Bacolod City, Negros Occidental) in June 2025.",
    contact: "You can reach Mark directly via email at **mmanangan021@gmail.com**, phone **+63 970 980 4794**, or connect on GitHub (**markdennis2121**) and LinkedIn!"
};

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
}

function getAiResponse(userText) {
    const q = userText.toLowerCase();
    if (q.includes('skill') || q.includes('stack') || q.includes('technology') || q.includes('python')) {
        return responses.skills;
    } else if (q.includes('exp') || q.includes('work') || q.includes('job') || q.includes('company') || q.includes('leslie')) {
        return responses.experience;
    } else if (q.includes('research') || q.includes('paper') || q.includes('cnn') || q.includes('crab') || q.includes('thesis')) {
        return responses.thesis;
    } else if (q.includes('project') || q.includes('build') || q.includes('app')) {
        return responses.projects;
    } else if (q.includes('edu') || q.includes('degree') || q.includes('school') || q.includes('university') || q.includes('college')) {
        return responses.education;
    } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach')) {
        return responses.contact;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello there! 👋 How can I assist you with Mark's portfolio today?";
    } else {
        return "Mark is an AI Engineer and Full Stack Developer! Feel free to ask about his **skills**, **experience**, **projects**, **CNN research**, or **contact information**.";
    }
}

function addChatMessage(sender, text) {
    if (!aiChatBody) return;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<p>${formatMarkdown(text)}</p>`;
    aiChatBody.appendChild(msg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

if (aiFabBtn && aiModal) {
    aiFabBtn.addEventListener('click', () => {
        aiModal.classList.toggle('active');
        if (aiModal.classList.contains('active') && aiChatInput) {
            setTimeout(() => aiChatInput.focus(), 200);
        }
    });

    if (aiModalClose) {
        aiModalClose.addEventListener('click', () => {
            aiModal.classList.remove('active');
        });
    }

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const promptType = chip.getAttribute('data-prompt');
            const userText = chip.textContent;
            const answer = responses[promptType] || getAiResponse(userText);

            addChatMessage('user', userText);

            setTimeout(() => {
                addChatMessage('bot', answer);
            }, 350);
        });
    });

    if (aiChatForm) {
        aiChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = aiChatInput.value.trim();
            if (!text) return;

            addChatMessage('user', text);
            aiChatInput.value = '';

            const answer = getAiResponse(text);

            setTimeout(() => {
                addChatMessage('bot', answer);
            }, 350);
        });
    }
}


// =========================================
// Hero Typewriter Engine
// =========================================
const typewriterText = document.getElementById('typewriterText');
if (typewriterText) {
    const roles = [
        "AI & Computer Vision",
        "Full-Stack Web & Backend Engineering",
        "Workflow Automation & System Architecture",
        "Deep Learning & Neural Networks"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2200; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before new word
        }

        setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
}


// =========================================
// Animated Stat Counter Engine
// =========================================
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    let animated = false;

    function startCounters() {
        if (animated) return;
        animated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            const suffix = stat.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = Math.ceil(target / 40);
            const duration = 1500;
            const stepTime = Math.abs(Math.floor(duration / (target / increment)));

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current + suffix;
            }, stepTime);
        });
    }

    // Trigger counters when Hero section loads
    setTimeout(startCounters, 300);
}


// =========================================
// Interactive 3D Cyber Profile Card Tilt
// =========================================
const cyberCardWrapper = document.getElementById('cyberCardWrapper');
const cyberCard = document.getElementById('cyberCard');

if (cyberCardWrapper && cyberCard) {
    cyberCardWrapper.addEventListener('mousemove', (e) => {
        const rect = cyberCardWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 18;
        const rotateY = (x / rect.width) * 18;

        cyberCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cyberCardWrapper.addEventListener('mouseleave', () => {
        cyberCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}


// =========================================
// Neural Particle Canvas Background
// =========================================
const canvas = document.getElementById('neuralCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 65);
    let mouse = { x: null, y: null, maxDist: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.25 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < mouse.maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - mdist / mouse.maxDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
}


// =========================================
// Project Category Filter Handler
// =========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});


// =========================================
// Skill Search Filter Engine
// =========================================
const skillSearchInput = document.getElementById('skillSearchInput');
const skillCategories = document.querySelectorAll('.skill-category');

if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        skillCategories.forEach(cat => {
            const items = cat.querySelectorAll('.skill-pill');
            let hasMatch = false;

            items.forEach(item => {
                const text = (item.getAttribute('data-skill') || item.textContent).toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'inline-flex';
                    hasMatch = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (hasMatch || !query) {
                cat.classList.remove('hidden-skill');
            } else {
                cat.classList.add('hidden-skill');
            }
        });
    });
}


// =========================================
// Quick Copy Buttons & Toast Notifications
// =========================================
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyPhoneBtn = document.getElementById('copyPhoneBtn');
const toastNotif = document.getElementById('toastNotif');

function showToast(message) {
    if (!toastNotif) return;
    toastNotif.innerHTML = `<i class="ri-checkbox-circle-fill" style="color:#4ADE80;"></i> ${message}`;
    toastNotif.classList.add('active');

    setTimeout(() => {
        toastNotif.classList.remove('active');
    }, 2800);
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('mmanangan021@gmail.com');
        showToast('Email address copied to clipboard!');
    });
}

if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('+63 970 980 4794');
        showToast('Phone number copied to clipboard!');
    });
}


// =========================================
// Interactive Glass Contact Form Handler (Web3Forms API + Anti-Spam Rate Limiter)
// =========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();

        // 1. Honeypot Anti-Spam Verification
        const botcheck = contactForm.querySelector('input[name="botcheck"]');
        if (botcheck && botcheck.checked) {
            console.warn('Bot submission blocked via Honeypot field.');
            if (formStatus) {
                formStatus.className = 'form-status success';
                formStatus.textContent = `✔ Thank you, ${name}! Your message has been sent directly to Mark's inbox.`;
            }
            contactForm.reset();
            return;
        }

        // 2. Client-Side Rate Limiter (30s Cooldown & Max 5 Messages / Hour)
        const COOLDOWN_MS = 30 * 1000;
        const MAX_PER_HOUR = 5;
        const now = Date.now();
        const lastSubmit = parseInt(localStorage.getItem('contact_last_submit') || '0', 10);
        const submitHistory = JSON.parse(localStorage.getItem('contact_submit_history') || '[]');

        const recentSubmissions = submitHistory.filter(time => now - time < 60 * 60 * 1000);

        if (now - lastSubmit < COOLDOWN_MS) {
            const remainingSec = Math.ceil((COOLDOWN_MS - (now - lastSubmit)) / 1000);
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = `⏳ Please wait ${remainingSec} second${remainingSec > 1 ? 's' : ''} before sending another message.`;
            }
            showToast(`Rate limit active: Please wait ${remainingSec}s before retrying.`);
            return;
        }

        if (recentSubmissions.length >= MAX_PER_HOUR) {
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = `⚠️ Hourly submission limit reached (max ${MAX_PER_HOUR} messages/hour). Please reach out directly on LinkedIn!`;
            }
            showToast('Hourly limit reached. Please contact via LinkedIn directly.');
            return;
        }

        // Update button state to sending
        if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.innerHTML = `Sending... <i class="ri-loader-4-line ri-spin"></i>`;
        }

        if (formStatus) {
            formStatus.className = 'form-status info';
            formStatus.textContent = 'Transmitting message to Mark...';
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Record submission timestamp in localStorage
                recentSubmissions.push(now);
                localStorage.setItem('contact_last_submit', now.toString());
                localStorage.setItem('contact_submit_history', JSON.stringify(recentSubmissions));

                if (formStatus) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = `✔ Thank you, ${name}! Your message has been sent directly to Mark's inbox.`;
                }
                contactForm.reset();
                showToast('Message sent! Mark will reply to your email soon.');
            } else {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = `❌ ${data.message || 'Something went wrong. Please try again.'}`;
                }
            }
        } catch (err) {
            if (formStatus) {
                formStatus.className = 'form-status error';
                formStatus.textContent = '❌ Connection error. Please check your internet connection and try again.';
            }
        } finally {
            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.innerHTML = `Send Message <i class="ri-send-plane-line"></i>`;
            }

            setTimeout(() => {
                if (formStatus) formStatus.textContent = '';
            }, 6000);
        }
    });
}


// =========================================
// Flying Rocket Back-to-Top Handler
// =========================================
const scrollTopRocket = document.getElementById('scrollTopRocket');

if (scrollTopRocket) {
    // Show rocket when user scrolls down past 350px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            scrollTopRocket.classList.add('visible');
        } else {
            scrollTopRocket.classList.remove('visible');
        }
    });

    // Handle rocket launch on click
    scrollTopRocket.addEventListener('click', () => {
        // Trigger thruster & launch animation
        scrollTopRocket.classList.add('flying');

        // Smooth scroll to top of main page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Reset rocket icon after animation completes
        setTimeout(() => {
            scrollTopRocket.classList.remove('flying');
        }, 900);
    });
}


// =========================================
// 1. Synthesized Web Audio Sci-Fi Sound Engine
// =========================================
let audioCtx = null;
let isAudioMuted = localStorage.getItem('mdm_audio_muted') === 'true';

const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
    if (isAudioMuted) soundToggleBtn.classList.add('muted');

    soundToggleBtn.addEventListener('click', () => {
        isAudioMuted = !isAudioMuted;
        localStorage.setItem('mdm_audio_muted', isAudioMuted);
        soundToggleBtn.classList.toggle('muted', isAudioMuted);
        const icon = soundToggleBtn.querySelector('.sound-icon');
        if (icon) {
            icon.className = isAudioMuted ? 'ri-volume-mute-line sound-icon' : 'ri-volume-up-line sound-icon';
        }
        if (!isAudioMuted) playUiSound('toggle');
    });
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playUiSound(type) {
    // Disabled to maintain a clean corporate engineering aesthetic
}

// Attach sound listeners to UI triggers
document.querySelectorAll('.btn, .nav-item, .prompt-chip, .skill-pill, .term-badge').forEach(el => {
    el.addEventListener('mouseenter', () => playUiSound('click'));
});

if (scrollTopRocket) {
    scrollTopRocket.addEventListener('click', () => playUiSound('rocket'));
}


// =========================================
// 2. Cyber Sci-Fi Custom Cursor Engine
// =========================================
const customCursor = document.getElementById('customCursor');
if (customCursor && window.matchMedia('(pointer: fine)').matches) {
    const dot = customCursor.querySelector('.cursor-dot');
    const ring = customCursor.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover effect on interactive elements
    const hoverTargets = 'a, button, .project-card, .skill-pill, .prompt-chip, .contact-item, .cyber-profile-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
    });
}


// =========================================
// 3. Live GitHub Telemetry Fetcher (markdennis2121)
// =========================================
async function fetchGithubTelemetry() {
    const ghReposCount = document.getElementById('ghReposCount');
    const ghStatusText = document.getElementById('ghStatusText');
    const ghReposGrid = document.getElementById('ghReposGrid');
    const ghAvatar = document.getElementById('ghAvatar');
    const ghBio = document.getElementById('ghBio');

    if (!ghReposCount) return;

    try {
        // Fetch User Profile Data
        const userRes = await fetch('https://api.github.com/users/markdennis2121');
        if (userRes.ok) {
            const userData = await userRes.json();
            if (ghReposCount) ghReposCount.textContent = userData.public_repos || '10+';
            if (ghAvatar && userData.avatar_url) ghAvatar.src = userData.avatar_url;
            if (ghBio && userData.bio) ghBio.textContent = userData.bio;
            if (ghStatusText) ghStatusText.textContent = 'Live Synced';
        } else {
            throw new Error('API Rate Limited');
        }

        // Fetch Repositories
        const reposRes = await fetch('https://api.github.com/users/markdennis2121/repos?sort=updated&per_page=4');
        if (reposRes.ok && ghReposGrid) {
            const repos = await reposRes.json();
            ghReposGrid.innerHTML = '';

            repos.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'gh-repo-card';
                card.innerHTML = `
                    <div class="gh-repo-header">
                        <h5><i class="ri-git-repository-line"></i> ${escapeHtml(repo.name)}</h5>
                        <a href="${repo.html_url}" target="_blank" style="color:var(--primary);"><i class="ri-external-link-line"></i></a>
                    </div>
                    <p class="gh-repo-desc">${escapeHtml(repo.description || 'Open-source software build and code repository.')}</p>
                    <div class="gh-repo-footer">
                        <span class="gh-repo-lang"><span class="gh-lang-dot"></span> ${repo.language || 'Code'}</span>
                        <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
                    </div>
                `;
                ghReposGrid.appendChild(card);
            });
        }
    } catch (err) {
        // Dynamic Fallback Data if GitHub API hits rate limit
        if (ghReposCount) ghReposCount.textContent = '10+';
        if (ghStatusText) ghStatusText.textContent = 'Cached';

        if (ghReposGrid) {
            ghReposGrid.innerHTML = `
                <div class="gh-repo-card">
                    <div class="gh-repo-header">
                        <h5><i class="ri-git-repository-line"></i> crab-gender-classification-cnn</h5>
                        <a href="https://github.com/markdennis2121" target="_blank" style="color:var(--primary);"><i class="ri-external-link-line"></i></a>
                    </div>
                    <p class="gh-repo-desc">Deep Learning 5-CNN Model Evaluation benchmark pipeline with 98% accuracy.</p>
                    <div class="gh-repo-footer">
                        <span class="gh-repo-lang"><span class="gh-lang-dot"></span> Python / TensorFlow</span>
                        <span>⭐ 15 | 🍴 4</span>
                    </div>
                </div>
                <div class="gh-repo-card">
                    <div class="gh-repo-header">
                        <h5><i class="ri-git-repository-line"></i> onedrive-document-upload-engine</h5>
                        <a href="https://github.com/markdennis2121" target="_blank" style="color:var(--primary);"><i class="ri-external-link-line"></i></a>
                    </div>
                    <p class="gh-repo-desc">Enterprise OneDrive Graph API & SQL Server queued synchronization engine.</p>
                    <div class="gh-repo-footer">
                        <span class="gh-repo-lang"><span class="gh-lang-dot"></span> C# / ASP.NET</span>
                        <span>⭐ 12 | 🍴 2</span>
                    </div>
                </div>
            `;
        }
    }
}
fetchGithubTelemetry();


// =========================================
// 4. Project Deep Dive Glass Modal Engine
// =========================================
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalBody = document.getElementById('modalBody');
const modalGithubLink = document.getElementById('modalGithubLink');
const modalLiveLink = document.getElementById('modalLiveLink');

const projectDeepDives = {
    'doc-automation': {
        category: 'Automation & AI',
        title: 'AI-Powered Document Processing & Parsing Pipeline',
        github: 'https://github.com/markdennis2121',
        live: '#contact',
        body: `
            <div>
                <h4 class="modal-section-title"><i class="ri-cpu-line"></i> System Architecture</h4>
                <p>Designed a multi-stage automated document pipeline that ingests complex PDF invoices, unstructured forms, and image scans. Utilizes Python-based AI parsing engines to extract key-value data fields with 99%+ accuracy.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-line-chart-line"></i> Measurable Industry Impact</h4>
                <p>Replaced manual office entry workflows at Leslie Corporation, reducing document turnaround speed from <b>hours to seconds</b> and preventing human data entry errors.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-stack-line"></i> Technical Specifications</h4>
                <div class="cv-skills-pills">
                    <span>Python</span>
                    <span>REST API Integrations</span>
                    <span>Google Sheets API</span>
                    <span>Excel OpenPyXL</span>
                    <span>JSON Schema Validation</span>
                </div>
            </div>
        `
    },
    'onedrive-engine': {
        category: 'Full Stack & Cloud',
        title: 'OneDrive Document Upload & Synchronization Engine',
        github: 'https://github.com/markdennis2121',
        live: '#contact',
        body: `
            <div>
                <h4 class="modal-section-title"><i class="ri-server-line"></i> Enterprise Backend Architecture</h4>
                <p>Engineered a high-availability C# ASP.NET Core microservice that handles background image uploads using a queue worker system. Synchronizes binary payloads with Microsoft OneDrive Graph API while indexing transactional metadata in SQL Server.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-shield-check-line"></i> Security & Reliability Metrics</h4>
                <p>Achieved <b>99.9% fault-tolerant uptime</b> in production environments with automatic retry algorithms, Microsoft Entra ID OAuth2 authentication, and transactional SQL stored procedures.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-stack-line"></i> Technical Specifications</h4>
                <div class="cv-skills-pills">
                    <span>C# / .NET Core</span>
                    <span>Microsoft Graph API</span>
                    <span>SQL Server / T-SQL</span>
                    <span>SSMS</span>
                    <span>OAuth2 / Entra ID</span>
                </div>
            </div>
        `
    },
    'crab-cnn': {
        category: 'Deep Learning & Computer Vision',
        title: 'CNN Architectures for Blue Swimming Crab Gender Classification',
        github: 'https://github.com/markdennis2121',
        live: 'https://github.com/markdennis2121',
        body: `
            <div>
                <h4 class="modal-section-title"><i class="ri-award-line"></i> Internationally Published Research</h4>
                <p>Co-authored research published in the <b>12th Huachiew Chalermprakiet University International Academic Conference (Thailand)</b> evaluating marine species classification performance.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-brain-line"></i> Model Performance Benchmarks</h4>
                <p>Trained and benchmarked 5 distinct Deep Convolutional Neural Network architectures (ResNet, MobileNet, EfficientNet, VGG16, Custom CNN) using OpenCV preprocessing and transfer learning, achieving up to <b>98% accuracy</b>.</p>
            </div>
            <div>
                <h4 class="modal-section-title"><i class="ri-stack-line"></i> Technical Specifications</h4>
                <div class="cv-skills-pills">
                    <span>Python</span>
                    <span>TensorFlow / Keras</span>
                    <span>OpenCV</span>
                    <span>Transfer Learning</span>
                    <span>Gradio UI</span>
                </div>
            </div>
        `
    }
};

document.querySelectorAll('.project-deepdive-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('[data-project-id]');
        if (!card) return;
        const projectId = card.getAttribute('data-project-id');
        const data = projectDeepDives[projectId];

        if (data && projectModal) {
            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalBody.innerHTML = data.body;
            modalGithubLink.href = data.github;
            modalLiveLink.href = data.live;

            projectModal.classList.add('active');
            playUiSound('chime');
        }
    });
});

if (projectModalClose) {
    projectModalClose.addEventListener('click', () => {
        projectModal.classList.remove('active');
    });
}


// =========================================
// 5. Interactive CV / Resume Glass Modal Engine
// =========================================
const previewCvBtn = document.getElementById('previewCvBtn');
const cvModal = document.getElementById('cvModal');
const cvModalClose = document.getElementById('cvModalClose');

if (previewCvBtn && cvModal) {
    previewCvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cvModal.classList.add('active');
        playUiSound('chime');
    });

    if (cvModalClose) {
        cvModalClose.addEventListener('click', () => {
            cvModal.classList.remove('active');
        });
    }
}

// Close modals on Backdrop Click or Escape Key
window.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.remove('active');
    if (e.target === cvModal) cvModal.classList.remove('active');
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (projectModal) projectModal.classList.remove('active');
        if (cvModal) cvModal.classList.remove('active');
    }
});


