// Laravel 13 Cheat Sheet - Search Functionality
// Simple, fast client-side search without external dependencies

(function() {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let searchIndex = [];

  // Load search index
  async function loadSearchIndex() {
    try {
      const response = await fetch(getBasePath() + '/search-index.json');
      const data = await response.json();
      searchIndex = Array.isArray(data) ? data : (data.docs || []);
      console.log(`Loaded ${searchIndex.length} documents into search index`);
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  // Get base path for relative URLs
  function getBasePath() {
    const meta = document.querySelector('meta[property="og:url"]');
    if (meta && meta.content) {
      const url = new URL(meta.content);
      return url.pathname.replace(/\/$/, '');
    }
    return '';
  }

  // Perform search
  function performSearch(query) {
    if (!query || query.trim().length === 0) {
      searchResults.innerHTML = '';
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const matches = searchIndex.filter(doc => {
      const title = doc.title.toLowerCase();
      const category = doc.category.toLowerCase();
      return title.includes(normalizedQuery) || category.includes(normalizedQuery);
    });

    displayResults(matches, normalizedQuery);
  }

  // Display search results
  function displayResults(matches, query) {
    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="no-results">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
          <p>Try searching for: routing, database, authentication, validation, testing</p>
        </div>
      `;
      return;
    }

    let html = `<div class="results-header">Found ${matches.length} result${matches.length !== 1 ? 's' : ''}</div>`;
    html += '<ul class="search-results-list">';

    matches.forEach(match => {
      const categoryLabel = formatCategoryLabel(match.category);
      html += `
        <li class="search-result-item">
          <a href="${escapeHtml(match.url)}">
            <span class="result-title">${escapeHtml(match.title)}</span>
            <span class="result-category">${escapeHtml(categoryLabel)}</span>
          </a>
        </li>
      `;
    });

    html += '</ul>';
    searchResults.innerHTML = html;
  }

  // Format category label from folder name
  function formatCategoryLabel(category) {
    const labels = {
      '01-core': '📌 Core Framework',
      '02-http': '🌐 HTTP',
      '03-database': '💾 Database',
      '04-auth': '🔐 Auth & Authorization',
      '05-communication': '💬 Communication',
      '06-utilities': '🛠️ Utilities',
      '07-patterns': '🏗️ Patterns',
      '08-data': '📊 Data Processing',
      '09-validation': '✅ Validation',
      '10-advanced': '🚀 Advanced'
    };
    return labels[category] || category;
  }

  // Escape HTML special characters
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    // Focus on Cmd+K or Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Load index on page load
  loadSearchIndex();
})();
