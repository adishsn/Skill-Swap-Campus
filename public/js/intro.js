// ==========================================================================
// SkillSwap - Premium 3D Graduation Cap Intro & Cinematic Reveal Controller
// Timeline: ~3.0s total duration
// Stages:
//  0.0s - 0.4s: Stage 1 (Initial appearance & brand fade-in)
//  0.4s - 1.2s: Stage 2 (3D physical rotation & tassel physics)
//  1.2s - 1.9s: Stage 3 (Cap opens & knowledge light burst)
//  1.9s - 2.6s: Stage 4 (Cinematic aperture reveal of live homepage)
//  2.6s - 3.0s: Stage 5 (Dissolve & unlock homepage interactions)
// ==========================================================================

const SkillSwapIntro = (() => {
  // Configuration options
  const CONFIG = {
    enabled: true,               // Set to false to disable intro completely
    autoPlayOnLoad: true,        // Automatically run on fresh page load
    totalDuration: 3000,         // ~3.0 seconds total
    skipStorageKey: 'skillswap_intro_played_session'
  };

  let isPlaying = false;
  let animTimer = null;
  let rafId = null;

  // DOM Elements cache
  let overlay = null;
  let gimbal = null;
  let mortarboard = null;
  let innerChamber = null;
  let glowAura = null;
  let tasselHanging = null;
  let brandBlock = null;
  let aperture = null;

  function init() {
    if (!CONFIG.enabled) {
      removeIntroImmediate();
      return;
    }

    // Check accessibility: prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      removeIntroImmediate();
      return;
    }

    // Cache elements
    overlay = document.getElementById('skillswapIntroOverlay');
    gimbal = document.getElementById('cap3dGimbal');
    mortarboard = document.getElementById('cap3dMortarboard');
    innerChamber = document.getElementById('cap3dInnerChamber');
    glowAura = document.getElementById('introGlowAura');
    tasselHanging = document.getElementById('cap3dTasselHanging');
    brandBlock = document.getElementById('introBrandBlock');
    aperture = document.getElementById('introRevealAperture');

    if (!overlay) return;

    // Prevent body scrolling while intro is running
    document.body.style.overflow = 'hidden';

    // Keyboard listener: Escape key skips intro
    document.addEventListener('keydown', handleKeyDown);

    if (CONFIG.autoPlayOnLoad) {
      // Start animation after a tiny paint frame
      requestAnimationFrame(() => {
        play();
      });
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && isPlaying) {
      skip();
    }
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;

    // Reset visual states
    resetStates();
    overlay.classList.remove('intro-hidden', 'intro-fadeout');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();

    // -------------------------------------------------------------
    // STAGE 1: Initial Appearance (0.0s – 0.4s)
    // -------------------------------------------------------------
    requestAnimationFrame(() => {
      if (brandBlock) brandBlock.classList.add('visible');
      if (glowAura) glowAura.style.opacity = '1';
    });

    // -------------------------------------------------------------
    // STAGE 2: 3D Rotation (0.4s – 1.2s, 800ms duration)
    // Smooth 3D turn with horizontal tilt & tassel momentum
    // -------------------------------------------------------------
    const stage2Delay = 400;
    const stage2Duration = 800;

    animTimer = setTimeout(() => {
      if (!isPlaying) return;

      // Trigger tassel dynamic sway
      if (tasselHanging) tasselHanging.classList.add('sway-active');

      const rotateStart = performance.now();

      function animateRotation(now) {
        if (!isPlaying) return;
        const elapsed = now - rotateStart;
        const progress = Math.min(elapsed / stage2Duration, 1);

        // Smooth cubic-bezier easing for physical feel
        // EaseInOutCubic: progress < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentRotY = eased * 360;
        // Subtle tilt oscillation around X-axis for realistic floating weight
        const currentTiltX = 16 + Math.sin(progress * Math.PI) * 6;

        if (gimbal) {
          gimbal.style.transform = `rotateX(${currentTiltX}deg) rotateY(${currentRotY}deg)`;
        }

        if (progress < 1) {
          rafId = requestAnimationFrame(animateRotation);
        } else {
          // Finish rotation aligned squarely
          if (gimbal) gimbal.style.transform = `rotateX(16deg) rotateY(360deg)`;
          startStage3();
        }
      }

      rafId = requestAnimationFrame(animateRotation);
    }, stage2Delay);
  }

  // -------------------------------------------------------------
  // STAGE 3: Cap Opens (1.2s – 1.9s, ~700ms duration)
  // Mortarboard lifts & tilts back; inner gold/blue light bursts out
  // -------------------------------------------------------------
  function startStage3() {
    if (!isPlaying) return;

    // Apply opened transform class to stage assembly
    const stage = document.getElementById('cap3dStage');
    if (stage) stage.classList.add('cap3d-opened');

    // Inner knowledge core illumination
    if (innerChamber) innerChamber.classList.add('burst-active');
    if (glowAura) glowAura.classList.add('glow-active');

    // -------------------------------------------------------------
    // STAGE 4: Cinematic Homepage Reveal (1.9s – 2.6s)
    // Aperture expands outward from cap center to reveal real homepage
    // -------------------------------------------------------------
    animTimer = setTimeout(() => {
      if (!isPlaying) return;

      if (aperture) aperture.classList.add('expand-active');

      // -------------------------------------------------------------
      // STAGE 5: Final Dissolve & Complete (2.6s – 3.0s)
      // -------------------------------------------------------------
      animTimer = setTimeout(() => {
        complete();
      }, 700);

    }, 700);
  }

  function complete() {
    if (!isPlaying) return;
    isPlaying = false;

    // Fade out overlay
    if (overlay) overlay.classList.add('intro-fadeout');

    // Restore page scroll & interactions
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);

    // Hide overlay completely after fadeout transition
    setTimeout(() => {
      if (overlay) overlay.classList.add('intro-hidden');
    }, 450);
  }

  function skip() {
    if (!isPlaying) return;
    isPlaying = false;

    if (rafId) cancelAnimationFrame(rafId);
    if (animTimer) clearTimeout(animTimer);

    if (overlay) {
      overlay.classList.add('intro-fadeout');
      setTimeout(() => {
        overlay.classList.add('intro-hidden');
      }, 300);
    }

    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
  }

  function resetStates() {
    if (rafId) cancelAnimationFrame(rafId);
    if (animTimer) clearTimeout(animTimer);

    const stage = document.getElementById('cap3dStage');
    if (stage) stage.classList.remove('cap3d-opened');
    if (gimbal) gimbal.style.transform = 'rotateX(16deg) rotateY(0deg)';
    if (innerChamber) innerChamber.classList.remove('burst-active');
    if (glowAura) glowAura.classList.remove('glow-active');
    if (tasselHanging) tasselHanging.classList.remove('sway-active');
    if (brandBlock) brandBlock.classList.remove('visible');
    if (aperture) aperture.classList.remove('expand-active');
  }

  function removeIntroImmediate() {
    const el = document.getElementById('skillswapIntroOverlay');
    if (el) el.classList.add('intro-hidden');
    document.body.style.overflow = '';
  }

  // Public API
  return {
    init,
    play,
    skip,
    enable: () => { CONFIG.enabled = true; },
    disable: () => { CONFIG.enabled = false; removeIntroImmediate(); }
  };
})();

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SkillSwapIntro.init);
} else {
  SkillSwapIntro.init();
}

// Global hook for presentation demo replaying
window.SkillSwapIntro = SkillSwapIntro;
