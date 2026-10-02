// Paste into the DevTools console of index.html served by cap_server.py.
// Renders the 32 s loop frame by frame at 1080x1350 and uploads JPEG frames to the server.
(async () => {
  const FPS = 30, SECONDS = 32;
  const frame = document.getElementById('frame');
  frame.style.width = '1080px';
  frame.style.height = '1350px';
  document.body.style.overflow = 'auto';
  dispatchEvent(new Event('resize'));
  await new Promise(r => setTimeout(r, 300));
  const cv = document.getElementById('c');
  window.__sortpump.pause(true);
  for (let i = 0; i < FPS * SECONDS; i++) {
    window.__sortpump.render(i / FPS);
    const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.93));
    await fetch('/f' + String(i).padStart(4, '0') + '.jpg', { method: 'POST', body: blob });
  }
  console.log('done', cv.width + 'x' + cv.height);
})();
