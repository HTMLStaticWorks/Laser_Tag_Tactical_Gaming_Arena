document.addEventListener('DOMContentLoaded', () => {
  /* --- 1. THEME TOGGLE --- */
  const html = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    html.setAttribute('data-theme', 'dark');
  }

  // Update Icon Function
  const updateThemeIcons = (isDark) => {
    themeToggles.forEach(toggle => {
      // Assuming toggle is a button containing a Phosphor icon
      // Sun = ph-sun, Moon = ph-moon
      const icon = toggle.querySelector('i');
      if (icon) {
        if (isDark) {
          icon.className = 'ph ph-sun'; // Show sun to toggle light
        } else {
          icon.className = 'ph ph-moon'; // Show moon to toggle dark
        }
      }
    });
  };

  updateThemeIcons(html.getAttribute('data-theme') === 'dark');

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(!isDark);
    });
  });

  /* --- 2. RTL TOGGLE --- */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedRtl = localStorage.getItem('rtl');

  if (savedRtl === 'true') {
    html.setAttribute('dir', 'rtl');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRtl = html.getAttribute('dir') === 'rtl';
      if (isRtl) {
        html.removeAttribute('dir');
        localStorage.setItem('rtl', 'false');
      } else {
        html.setAttribute('dir', 'rtl');
        localStorage.setItem('rtl', 'true');
      }
    });
  });

  /* --- 3. NAVBAR SCROLL --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* --- 4. MOBILE DRAWER --- */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const overlay = document.querySelector('.drawer-overlay');

  const toggleDrawer = () => {
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
  };

  if (hamburger && drawer && drawerClose && overlay) {
    hamburger.addEventListener('click', toggleDrawer);
    drawerClose.addEventListener('click', toggleDrawer);
    overlay.addEventListener('click', toggleDrawer);
  }

  /* --- 5. ANIMATIONS (Intersection Observer) --- */
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if reduced motion or no observer support
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* --- 6. BASIC FORM VALIDATION --- */
  const forms = document.querySelectorAll('form[data-validate="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          if (group) group.classList.add('has-error');
        } else {
          field.classList.remove('error');
          field.classList.add('success');
          if (group) group.classList.remove('has-error');
        }

        // Email regex validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            field.classList.add('error');
            field.classList.remove('success');
            if (group) {
              group.classList.add('has-error');
              const errMsg = group.querySelector('.error-msg');
              if (errMsg) errMsg.textContent = 'Invalid email format';
            }
          }
        }
      });

      // Special check for Terms Checkbox
      const termsCheck = form.querySelector('input[name="terms"]');
      if (termsCheck && !termsCheck.checked) {
        isValid = false;
        alert('You must accept the terms and conditions.');
      }

      if (!isValid) {
        e.preventDefault(); // Stop submission
      }
    });
  });

});
