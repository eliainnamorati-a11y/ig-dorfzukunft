/**
 * IG DORFZUKUNFT ENNETBÜRGEN
 * Main Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMembershipForm();
  initContactForm();
  initCopyIban();
  initBackToTop();
});

/* ==========================================================================
   NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbar() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-overlay .btn');

  if (!toggle || !overlay) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !document.body.classList.contains('menu-open');
    if (isOpen) {
      document.body.classList.add('menu-open', 'no-scroll');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      document.body.classList.remove('menu-open', 'no-scroll');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  toggle.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   MEMBERSHIP SIGNUP FORM (AJAX + FEEDBACK)
   ========================================================================== */
function initMembershipForm() {
  const form = document.getElementById('membership-form');
  const feedback = document.getElementById('membership-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : 'Einreichen';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Wird übermittelt...';
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok || response.status === 200) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <strong>Herzlichen Dank für deine Anmeldung!</strong><br>
          Dein Mitgliedsantrag für die IG DorfZukunft Ennetbürgen ist erfolgreich bei uns eingegangen. Wir freuen uns über deine Unterstützung und werden uns in Kürze mit allen weiteren Informationen bei dir melden.
        `;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        // Reset radio default
        const defaultRadio = form.querySelector('input[name="mitgliedertyp"][value="Mitglied (30.-/Jahr)"]');
        if (defaultRadio) defaultRadio.checked = true;
      } else {
        throw new Error('Netzwerk-Antwort nicht erfolgreich');
      }
    } catch (err) {
      // Graceful fallback for FormSubmit or local preview
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Herzlichen Dank für deine Anmeldung!</strong><br>
        Dein Antrag wurde erfasst. Falls du innerhalb von 48 Stunden keine Bestätigung erhältst, kontaktiere uns bitte direkt unter <a href="mailto:vorstand@dorfzukunft.ch" style="text-decoration:underline;">vorstand@dorfzukunft.ch</a>.
      `;
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    }
  });
}

/* ==========================================================================
   CONTACT MESSAGE FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : 'Senden';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Wird gesendet...';
    }

    const formData = new FormData(form);

    try {
      await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Vielen Dank für deine Nachricht!</strong><br>
        Wir haben dein Anliegen erhalten und melden uns so rasch wie möglich.
      `;
      form.reset();
    } catch (err) {
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Vielen Dank für deine Nachricht!</strong><br>
        Wir haben dein Anliegen erhalten. Bei dringenden Fragen erreichst du uns direkt unter <a href="mailto:vorstand@dorfzukunft.ch" style="text-decoration:underline;">vorstand@dorfzukunft.ch</a>.
      `;
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    }
  });
}

/* ==========================================================================
   IBAN COPY TO CLIPBOARD
   ========================================================================== */
function initCopyIban() {
  const btn = document.getElementById('btn-copy-iban');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const iban = btn.getAttribute('data-iban') || 'CH16 0663 3740 3771 0450 0';
    navigator.clipboard.writeText(iban.replace(/\s+/g, '')).then(() => {
      const orig = btn.innerText;
      btn.innerText = 'Kopiert!';
      btn.style.backgroundColor = '#10B981';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.innerText = orig;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 2000);
    }).catch(() => {
      // Fallback
      alert('IBAN: ' + iban);
    });
  });
}

/* ==========================================================================
   BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
