---
layout: search
title: Search
permalink: /search/
---

# Laravel 13 Cheat Sheet — Search

Use the search bar below to find topics across the entire cheat sheet.

<div id="search-container">
  <input 
    type="text" 
    id="search-input" 
    placeholder="Search topics (e.g., 'authentication', 'database', 'routing')..."
    class="search-input"
  />
</div>

<div id="search-results" class="search-results"></div>

<script src="{{ '/assets/js/lunr.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/search.js' | relative_url }}"></script>
