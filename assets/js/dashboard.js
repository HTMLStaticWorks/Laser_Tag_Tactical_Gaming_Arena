document.addEventListener('DOMContentLoaded', () => {
  /* --- 1. DASHBOARD TAB SWITCHING --- */
  const tabLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all
      tabLinks.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Add active to clicked
      link.classList.add('active');
      const targetId = link.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // On mobile, clicking a tab should close the sidebar drawer
      if (window.innerWidth <= 1024) {
        document.querySelector('.dashboard-sidebar').classList.remove('open');
        document.querySelector('.sidebar-overlay').classList.remove('active');
      }
    });
  });

  /* --- 2. MOBILE SIDEBAR TOGGLE --- */
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  const toggleSidebar = () => {
    if(sidebar && sidebarOverlay) {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('active');
    }
  };

  if (sidebarToggle && sidebarOverlay) {
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
  }

  /* --- 3. WAIVER LOGIC (localStorage) --- */
  const waiverForm = document.getElementById('waiver-form');
  const waiverSignedStatus = document.getElementById('waiver-signed-status');
  const waiverBadge = document.getElementById('overview-waiver-badge');

  const checkWaiverStatus = () => {
    const isSigned = localStorage.getItem('waiverSigned') === 'true';
    if (isSigned) {
      if (waiverForm) waiverForm.style.display = 'none';
      if (waiverSignedStatus) waiverSignedStatus.style.display = 'block';
      if (waiverBadge) {
        waiverBadge.textContent = '✅ Signed';
        waiverBadge.classList.add('signed');
      }
    } else {
      if (waiverForm) waiverForm.style.display = 'block';
      if (waiverSignedStatus) waiverSignedStatus.style.display = 'none';
      if (waiverBadge) {
        waiverBadge.textContent = '⚠ Action Required';
        waiverBadge.classList.remove('signed');
      }
    }
  };

  if (waiverForm) {
    waiverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation handled by HTML5 required attributes
      localStorage.setItem('waiverSigned', 'true');
      const date = new Date();
      localStorage.setItem('waiverDate', date.toLocaleDateString());
      checkWaiverStatus();
    });
  }

  // Initial Check
  checkWaiverStatus();

  /* --- 4. MULTI-STEP WIZARD (Booking/Packages) --- */
  // Reusable function for wizards
  const initWizard = (wizardContainer) => {
    if (!wizardContainer) return;
    
    let currentStep = 1;
    const steps = wizardContainer.querySelectorAll('.wizard-step');
    const nextBtns = wizardContainer.querySelectorAll('.btn-next');
    const prevBtns = wizardContainer.querySelectorAll('.btn-prev');
    const progressIndicators = wizardContainer.querySelectorAll('.progress-step');

    const showStep = (stepIndex) => {
      steps.forEach((step, idx) => {
        if (idx + 1 === stepIndex) {
          step.style.display = 'block';
        } else {
          step.style.display = 'none';
        }
      });

      progressIndicators.forEach((indicator, idx) => {
        if (idx + 1 <= stepIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    };

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Here you would add validation before proceeding
        if (currentStep < steps.length) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });

    // Form submission simulation for wizard
    const form = wizardContainer.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const successMsg = wizardContainer.querySelector('.inline-success');
        if (successMsg) {
          form.style.display = 'none';
          
          // Generate random reference
          const ref = 'BG-' + Math.floor(100000 + Math.random() * 900000);
          const refSpan = successMsg.querySelector('.booking-ref');
          if (refSpan) refSpan.textContent = ref;

          successMsg.style.display = 'block';
        }
      });
    }

    // Initialize first step
    showStep(currentStep);
  };

  // Initialize both generic booking wizard and package wizard if they exist
  const bookingWizard = document.getElementById('booking-wizard');
  const packageWizard = document.getElementById('package-wizard');
  
  initWizard(bookingWizard);
  initWizard(packageWizard);

  /* --- 5. NOTIFICATIONS MARK AS READ --- */
  const notifItems = document.querySelectorAll('.notif-item');
  const markAllBtn = document.getElementById('mark-all-read');

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      notifItems.forEach(item => item.classList.add('read'));
      const badge = document.querySelector('.notif-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  notifItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.add('read');
    });
  });

});
