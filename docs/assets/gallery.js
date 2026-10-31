// Slides the phone through the app's screens; without JS the screens can still be swiped.
(function () {
  var gallery = document.querySelector('.gallery');
  var track = gallery.querySelector('.slides');
  var slides = Array.prototype.slice.call(track.children);
  var caption = gallery.querySelector('.slide-caption');
  var controls = gallery.querySelector('.controls');
  var toggle = gallery.querySelector('.toggle');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var settle;
  var paused = reduced;

  var segments = slides.map(function (slide, i) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'segment';
    button.setAttribute('aria-label', 'Show screen ' + (i + 1) + ': ' + slide.dataset.caption);
    button.innerHTML = '<span></span>';
    button.addEventListener('click', function () { go(i); });
    button.firstChild.addEventListener('animationend', function () { go((index + 1) % slides.length); });
    controls.insertBefore(button, toggle);
    return button;
  });

  function show(i) {
    index = i;
    segments.forEach(function (segment, n) {
      segment.classList.toggle('done', n < i);
      segment.classList.toggle('active', n === i);
      if (n === i) segment.setAttribute('aria-current', 'true');
      else segment.removeAttribute('aria-current');
    });
    caption.textContent = slides[i].dataset.caption;
  }

  function go(i) {
    // Looping back jumps straight to the start rather than rewinding through every screen
    var jump = reduced || Math.abs(i - index) > 1;
    show(i);
    track.scrollTo({ left: i * track.clientWidth, behavior: jump ? 'auto' : 'smooth' });
  }

  function setPaused(value) {
    paused = value;
    gallery.classList.toggle('paused', paused);
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-pressed', String(paused));
  }

  // Follow the user's own swipes once a scroll has settled
  track.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () {
      var current = Math.round(track.scrollLeft / track.clientWidth);
      if (current !== index) show(current);
    }, 120);
  }, { passive: true });

  toggle.addEventListener('click', function () { setPaused(!paused); });

  gallery.classList.add('ready');
  setPaused(paused);
  show(0);
})();
