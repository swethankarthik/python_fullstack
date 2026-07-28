/**
 * NRIIT Learning Management System - Enterprise Client Script
 * Features: Dark/Light Mode, Instant Search, Live Sandbox, FAQ, Chat Widget, Fee Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initActiveNavLink();
  initStatsCounter();
  initFormValidations();
  initBackToTop();
  initCodeCardTyping();
  initPythonSandbox();
  initAccordions();
  initCourseFiltersAndSearch();
  initChatWidget();
  initFeeCalculator();
});

/**
 * 1. Dark / Light Theme Mode Switcher
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('nriit_theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('nriit_theme', 'light');
      toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
      showToast('Light Theme', 'Switched to crisp light mode', 'info');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nriit_theme', 'dark');
      toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
      showToast('Dark Theme', 'Switched to dark mode', 'info');
    }
  });
}

/**
 * 2. Mobile Navigation Toggle & Accessibility
 */
function initNavbar() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (!mobileToggle || !mainNav) return;

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShown = mainNav.classList.toggle('show');
    mobileToggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
      mainNav.classList.remove('show');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('show')) {
      mainNav.classList.remove('show');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 3. Automatic Active Navigation Link Highlighter
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!href.startsWith('#') && !link.classList.contains('btn-nav-login') && !link.classList.contains('btn-nav-register')) {
      link.classList.remove('active');
    }
  });
}

/**
 * 4. Animated Stats Counter (Intersection Observer)
 */
function initStatsCounter() {
  const statItems = document.querySelectorAll('.stat-item h3');
  if (!statItems.length) return;

  const animateCounter = (el) => {
    const targetText = el.innerText.trim();
    const numericMatch = targetText.match(/\d+/);
    if (!numericMatch) return;

    const targetValue = parseInt(numericMatch[0], 10);
    const suffix = targetText.replace(numericMatch[0], '');
    let startValue = 0;
    const duration = 1600;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= targetValue) {
        el.innerText = targetValue + suffix;
        clearInterval(timer);
      } else {
        el.innerText = Math.floor(startValue) + suffix;
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statItems.forEach((item) => observer.observe(item));
}

/**
 * 5. Form Validations & Custom Toast Notifications
 */
function initFormValidations() {
  const forms = document.querySelectorAll('form:not(#chatForm)');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (form.id === 'loginForm' || form.querySelector('#loginEmail')) {
            showToast('Success', 'Welcome back! Login successful.', 'success');
            form.reset();
          } else if (form.id === 'regForm' || form.querySelector('#regEmail')) {
            showToast('Registration Successful', 'Your account has been created. Check email for details.', 'success');
            form.reset();
          } else {
            showToast('Message Sent', 'Thank you for reaching out! We will contact you soon.', 'success');
            form.reset();
          }
        }, 1200);
      }
    });
  });
}

/**
 * Custom Toast Notification System
 */
function showToast(title, message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 360px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.style.cssText = `
    background: var(--bg-surface, #ffffff);
    border-left: 4px solid var(--primary, #ea580c);
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: flex-start;
    gap: 14px;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  const iconColor = type === 'success' ? '#ea580c' : '#3b82f6';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}" style="color: ${iconColor}; font-size: 1.25rem; margin-top: 2px;"></i>
    <div style="flex: 1;">
      <h4 style="margin: 0 0 2px 0; color: var(--dark-text, #0f172a); font-size: 0.95rem; font-weight: 700;">${title}</h4>
      <p style="margin: 0; color: var(--muted-text, #475569); font-size: 0.875rem;">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * 6. Back to Top Button
 */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.ariaLabel = 'Back to top';
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  btn.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 28px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--primary-gradient, linear-gradient(135deg, #ea580c, #d97706));
    color: #ffffff;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
    z-index: 990;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 7. Hero Code Card Cursor & Live Sandbox Runner
 */
function initCodeCardTyping() {
  const codeBody = document.querySelector('.code-body');
  if (!codeBody) return;

  const cursor = document.createElement('span');
  cursor.style.cssText = `
    display: inline-block;
    width: 8px;
    height: 16px;
    background: #ea580c;
    margin-left: 4px;
    animation: blink 1s infinite;
    vertical-align: middle;
  `;

  const style = document.createElement('style');
  style.innerHTML = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
  document.head.appendChild(style);

  codeBody.appendChild(cursor);
}

function initPythonSandbox() {
  const runBtn = document.getElementById('runCodeBtn');
  const consoleOutput = document.getElementById('consoleOutput');
  if (!runBtn || !consoleOutput) return;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = `<i class="fa-solid fa-gear fa-spin"></i> Running...`;

    setTimeout(() => {
      consoleOutput.style.display = 'block';
      consoleOutput.innerHTML = `
        <div>[NRIIT Flask Server v2.4 initialized]</div>
        <div>* Running on http://127.0.0.1:5000/api/students/placed</div>
        <div style="color: #6ee7b7; margin-top: 4px;">GET /api/students/placed HTTP/1.1 200 OK — {"status": "success", "placements": "98%"}</div>
      `;
      runBtn.disabled = false;
      runBtn.innerHTML = `<i class="fa-solid fa-play"></i> Re-Run Server`;
      showToast('Flask API Online', 'Simulated Python server is running cleanly on port 5000', 'success');
    }, 800);
  });
}

/**
 * 8. Accordions (FAQ & Syllabus)
 */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      const parentGroup = item.parentElement;
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-item').forEach((sibling) => {
          sibling.classList.remove('active');
        });
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 9. Dynamic Course Filters & Instant Search Input
 */
function initCourseFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('courseSearchInput');
  const courseCards = document.querySelectorAll('.course-card');

  if (!courseCards.length) return;

  let activeCategory = 'all';

  const filterCards = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    courseCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const textContent = card.innerText.toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !query || textContent.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        filterCards();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/**
 * 10. Floating Admissions Live Chat Widget
 */
function initChatWidget() {
  const chatBtn = document.createElement('button');
  chatBtn.id = 'chatWidgetBtn';
  chatBtn.className = 'chat-widget-btn';
  chatBtn.innerHTML = `<i class="fa-solid fa-comments"></i> <span>Admissions Help</span>`;
  document.body.appendChild(chatBtn);

  const chatModal = document.createElement('div');
  chatModal.id = 'chatModal';
  chatModal.className = 'chat-modal';
  chatModal.innerHTML = `
    <div class="chat-header">
      <h4><i class="fa-solid fa-headset" style="color: var(--primary);"></i> NRIIT Admissions Live Chat</h4>
      <button id="closeChat" style="background:none; border:none; color:#ffffff; cursor:pointer; font-size:1rem;"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="chat-body" id="chatBody">
      <div class="chat-msg bot">Hello! Welcome to Dr. RVR & NRIIT. How can we help you with your enrollment today?</div>
    </div>
    <form id="chatForm" class="chat-footer">
      <input type="text" id="chatInput" class="form-control" placeholder="Ask a question..." required>
      <button type="submit" class="btn btn-primary" style="padding: 8px 14px;"><i class="fa-solid fa-paper-plane"></i></button>
    </form>
  `;
  document.body.appendChild(chatModal);

  chatBtn.addEventListener('click', () => {
    const isVisible = chatModal.style.display === 'flex';
    chatModal.style.display = isVisible ? 'none' : 'flex';
  });

  document.getElementById('closeChat').addEventListener('click', () => {
    chatModal.style.display = 'none';
  });

  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerText = userMsg;
    chatBody.appendChild(userDiv);
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.innerText = "Thank you! An NRIIT Admissions Advisor will reach out shortly. You can also call +91 9876543210.";
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
  });
}

/**
 * 11. Interactive Fee Calculator Widget
 */
function initFeeCalculator() {
  const calcForm = document.getElementById('feeCalcForm');
  if (!calcForm) return;

  const trackSelect = document.getElementById('calcTrack');
  const modeSelect = document.getElementById('calcMode');
  const typeSelect = document.getElementById('calcType');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const batchDisplay = document.getElementById('calcBatchDisplay');

  const updateCalculation = () => {
    let baseFee = 25000;
    if (trackSelect.value === 'frontend') baseFee = 15000;
    if (trackSelect.value === 'backend') baseFee = 12000;

    if (modeSelect.value === 'online') baseFee *= 0.9;
    if (typeSelect.value === 'nriit') baseFee *= 0.8; // 20% discount for NRIIT students

    priceDisplay.innerText = `₹${Math.round(baseFee).toLocaleString('en-IN')}`;
    batchDisplay.innerText = modeSelect.value === 'online' ? 'Next Batch: Monday (Online)' : 'Next Batch: 1st & 15th of Every Month (Campus)';
  };

  [trackSelect, modeSelect, typeSelect].forEach((el) => {
    if (el) el.addEventListener('change', updateCalculation);
  });

  updateCalculation();
}

/**
 * Helper to trigger Syllabus Download Simulation
 */
function downloadSyllabus(courseName) {
  showToast('Downloading Syllabus', `Downloading curriculum guide PDF for ${courseName}...`, 'success');
}
