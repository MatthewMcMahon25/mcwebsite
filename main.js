// Dynamically load marked from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
script.onload = () => {
  // Now that marked is available globally, continue the app
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  function renderMarkdown(text) {
    return window.marked.parse(text || '');
  }

  fetch('/newsletter/posts.json')
    .then(res => res.json())
    .then(posts => {
      // === SINGLE POST PAGE ===
      if (window.location.pathname.includes('/newsletter/post.html') && postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) {
          document.body.innerHTML = "<h1>Post not found</h1>";
          return;
        }

        document.title = post.title;
        document.querySelector('#post-title').textContent = post.title;
        document.querySelector('#post-date').textContent = post.date;
        document.querySelector('#post-image').src = post.image;
        document.querySelector('#post-image').alt = post.title;

        const excerpt = document.createElement('p');
        excerpt.className = 'post-excerpt';
        excerpt.textContent = post.excerpt;
        document.querySelector('#post-date').after(excerpt);

        document.querySelector('#section-setting').innerHTML = renderMarkdown(post.setting);
        document.querySelector('#section-antagonist').innerHTML = renderMarkdown(post.antagonist);
        document.querySelector('#section-protagonist').innerHTML = renderMarkdown(post.protagonist);
        document.querySelector('#section-conclusion').innerHTML = renderMarkdown(post.conclusion);
      }

      // === HOMEPAGE GRID ===
      const container = document.querySelector('#card-grid');
      if (container) {
        posts.forEach(post => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <a href="${post.url}">
              <img src="${post.image}" alt="${post.title}">
            </a>
            <h4>${post.title}</h4>
            <p>${post.excerpt}</p>
            <a href="${post.url}" class="read-link">Read The Post →</a>
            <hr>
            <small>By Matthew McMahon • ${post.date}</small>
          `;
          container.appendChild(card);
        });
      }
    });
};

document.head.appendChild(script);