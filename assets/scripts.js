const app = {
    files: [],
    categories: {},
    currentTheme: localStorage.getItem('theme') || 'dark',

    async init() {
        this.setupTheme();
        await this.loadFileIndex();
        this.renderSidebar();
        this.renderHome();
        this.setupEventListeners();
    },

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateHighlightTheme();
    },

    updateThemeIcon() {
        const toggle = document.getElementById('themeToggle');
        toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    },

    updateHighlightTheme() {
        const lightStyle = document.getElementById('hljs-light');
        const darkStyle = document.getElementById('hljs-dark');
        if (this.currentTheme === 'dark') {
            lightStyle.disabled = true;
            darkStyle.disabled = false;
        } else {
            lightStyle.disabled = false;
            darkStyle.disabled = true;
        }
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.setupTheme();
    },

    async loadFileIndex() {
        this.categories = {
            '01-core': {
                title: '📌 Core Framework',
                files: [
                    { name: 'artisan', path: 'docs/cheatsheet/01-core/artisan.md' },
                    { name: 'application-bootstrap', path: 'docs/cheatsheet/01-core/application-bootstrap.md' },
                    { name: 'config', path: 'docs/cheatsheet/01-core/config.md' },
                    { name: 'routing', path: 'docs/cheatsheet/01-core/routing.md' },
                    { name: 'middleware', path: 'docs/cheatsheet/01-core/middleware.md' }
                ]
            },
            '02-http': {
                title: '🌐 HTTP',
                files: [
                    { name: 'controllers', path: 'docs/cheatsheet/02-http/controllers.md' },
                    { name: 'requests', path: 'docs/cheatsheet/02-http/requests.md' },
                    { name: 'responses', path: 'docs/cheatsheet/02-http/responses.md' },
                    { name: 'redirects', path: 'docs/cheatsheet/02-http/redirects.md' },
                    { name: 'views-blade', path: 'docs/cheatsheet/02-http/views-blade.md' }
                ]
            },
            '03-database': {
                title: '💾 Database',
                files: [
                    { name: 'eloquent-orm', path: 'docs/cheatsheet/03-database/eloquent-orm.md' },
                    { name: 'eloquent-scopes', path: 'docs/cheatsheet/03-database/eloquent-scopes.md' },
                    { name: 'factories', path: 'docs/cheatsheet/03-database/factories.md' },
                    { name: 'query-builder', path: 'docs/cheatsheet/03-database/query-builder.md' },
                    { name: 'schema-migrations', path: 'docs/cheatsheet/03-database/schema-migrations.md' }
                ]
            },
            '04-auth': {
                title: '🔐 Auth & Authorization',
                files: [
                    { name: 'authentication-sanctum', path: 'docs/cheatsheet/04-auth/authentication-sanctum.md' },
                    { name: 'authorization', path: 'docs/cheatsheet/04-auth/authorization.md' }
                ]
            },
            '05-communication': {
                title: '💬 Communication',
                files: [
                    { name: 'notifications', path: 'docs/cheatsheet/05-communication/notifications.md' },
                    { name: 'mail', path: 'docs/cheatsheet/05-communication/mail.md' }
                ]
            },
            '06-utilities': {
                title: '🛠️ Utilities',
                files: [
                    { name: 'http-client', path: 'docs/cheatsheet/06-utilities/http-client.md' },
                    { name: 'cache', path: 'docs/cheatsheet/06-utilities/cache.md' },
                    { name: 'session', path: 'docs/cheatsheet/06-utilities/session.md' },
                    { name: 'cookies', path: 'docs/cheatsheet/06-utilities/cookies.md' },
                    { name: 'storage', path: 'docs/cheatsheet/06-utilities/storage.md' },
                    { name: 'logging', path: 'docs/cheatsheet/06-utilities/logging.md' }
                ]
            },
            '07-patterns': {
                title: '🏗️ Patterns',
                files: [
                    { name: 'service-container', path: 'docs/cheatsheet/07-patterns/service-container.md' },
                    { name: 'service-providers', path: 'docs/cheatsheet/07-patterns/service-providers.md' }
                ]
            },
            '08-data': {
                title: '📊 Data Processing',
                files: [
                    { name: 'collections', path: 'docs/cheatsheet/08-data/collections.md' },
                    { name: 'strings', path: 'docs/cheatsheet/08-data/strings.md' },
                    { name: 'arrays', path: 'docs/cheatsheet/08-data/arrays.md' },
                    { name: 'helpers', path: 'docs/cheatsheet/08-data/helpers.md' }
                ]
            },
            '09-validation': {
                title: '✅ Validation',
                files: [
                    { name: 'validation', path: 'docs/cheatsheet/09-validation/validation.md' }
                ]
            },
            '10-advanced': {
                title: '🚀 Advanced',
                files: [
                    { name: 'events-listeners', path: 'docs/cheatsheet/10-advanced/events-listeners.md' },
                    { name: 'jobs-queues', path: 'docs/cheatsheet/10-advanced/jobs-queues.md' },
                    { name: 'task-scheduling', path: 'docs/cheatsheet/10-advanced/task-scheduling.md' },
                    { name: 'testing', path: 'docs/cheatsheet/10-advanced/testing.md' }
                ]
            }
        };

        this.files = [];
        Object.entries(this.categories).forEach(([key, cat]) => {
            cat.files.forEach(file => {
                this.files.push({
                    ...file,
                    displayName: file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    category: cat.title,
                    categoryKey: key
                });
            });
        });
    },

    renderSidebar() {
        const sidebar = document.getElementById('sidebarContent');
        sidebar.innerHTML = '';
        Object.entries(this.categories).forEach(([_key, cat]) => {
            const section = document.createElement('div');
            section.className = 'sidebar-section collapsed';

            // Create title with toggle
            const title = document.createElement('div');
            title.className = 'sidebar-title';
            title.innerHTML = `
                <div class="sidebar-title-text">
                    <span class="sidebar-toggle">▶</span>
                    <span>${cat.title}</span>
                </div>
            `;

            // Create links container
            const linksContainer = document.createElement('div');
            linksContainer.className = 'sidebar-links';

            cat.files.forEach(file => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'sidebar-link';
                link.textContent = file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.loadFile(file.path, file.displayName);
                });
                linksContainer.appendChild(link);
            });

            // Toggle collapse/expand
            title.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });

            section.appendChild(title);
            section.appendChild(linksContainer);
            sidebar.appendChild(section);
        });
    },

    renderHome() {
        const grid = document.getElementById('homeGrid');
        grid.innerHTML = '';
        Object.entries(this.categories).forEach(([key, cat]) => {
            const card = document.createElement('a');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${cat.title}</div>
                <div class="category-card-count">${cat.files.length} sections</div>
            `;
            card.onclick = (e) => {
                e.preventDefault();
                this.showCategory(key);
            };
            grid.appendChild(card);
        });
        this.showView('homeView');
        this.updateTOC([]);
    },

    showHome(e) {
        if (e) {
            e.preventDefault();
        }
        document.getElementById('searchInput').value = '';
        this.renderHome();
    },

    showCategory(categoryKey) {
        const cat = this.categories[categoryKey];
        document.getElementById('categoryTitle').textContent = cat.title;
        const grid = document.getElementById('categoryGrid');
        grid.innerHTML = '';
        cat.files.forEach(file => {
            const card = document.createElement('a');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div class="category-card-count">${cat.title}</div>
            `;
            card.onclick = (e) => {
                e.preventDefault();
                this.loadFile(file.path, file.displayName);
            };
            grid.appendChild(card);
        });
        this.showView('categoryView');
        this.updateTOC([]);
    },

    async loadFile(path, title) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`File not found (HTTP ${response.status}). Path: ${path}`);
            }
            let content = await response.text();
            if (!content.trim()) {
                throw new Error('File is empty');
            }

            const { html, headings } = this.markdownToHtml(content);
            document.getElementById('fileContent').innerHTML = `<h1>${title}</h1>${html}`;
            this.showView('fileView');
            this.updateTOC(headings);
            setTimeout(() => hljs.highlightAll(), 100);
        } catch (error) {
            console.error('Load file error:', error);
            const fileContent = document.getElementById('fileContent');
            fileContent.innerHTML = `
                <h1>${title}</h1>
                <div style="background: rgba(255, 45, 32, 0.1); border-left: 4px solid #ff2d20; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                    <strong>Error loading file:</strong> ${error.message}
                    <br><small style="margin-top: 0.5rem; display: block; color: var(--text-secondary);">Path: ${path}</small>
                </div>
            `;
            this.showView('fileView');
            this.updateTOC([]);
        }
    },

    markdownToHtml(md) {
        let html = md;
        const headings = [];

        const languageAliases = {
            'blade': 'html',
            'html': 'html',
            'php': 'php',
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'sh': 'bash',
            'sql': 'sql',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'css': 'css'
        };

        // Process code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            const mappedLang = languageAliases[language.toLowerCase()] || language;
            const trimmedCode = code.trim();

            let highlighted = trimmedCode;
            try {
                highlighted = hljs.highlight(trimmedCode, { language: mappedLang }).value;
            } catch (e) {
                highlighted = trimmedCode;
            }

            const langLabel = language !== 'plaintext' ? `<div class="code-label">${language}</div>` : '';
            return `<div class="code-block"><div class="code-block-header">${langLabel}</div><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`;
        });

        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Collect headings for TOC
        html = html.replace(/^(#{1,6}) (.*?)$/gm, (match, hashes, title) => {
            const level = hashes.length;
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ level, title, id });
            const tag = `h${level}`;
            return `<${tag} id="${id}">${title}</${tag}>`;
        });

        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle internal wiki-style links [[link-text]]
        html = html.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
            const displayText = linkText.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const fileKey = linkText.toLowerCase();

            // Find matching file
            const matchingFile = this.files.find(f =>
                f.name.toLowerCase() === fileKey ||
                f.displayName.toLowerCase() === displayText.toLowerCase()
            );

            if (matchingFile) {
                return `<a href="#" onclick="app.loadFile('${matchingFile.path}', '${matchingFile.displayName}'); return false;" style="color: var(--primary); text-decoration: none; border-bottom: 1px solid var(--primary);">${displayText}</a>`;
            } else {
                return `<span style="color: var(--text-secondary); opacity: 0.6;" title="Link not found: ${displayText}">${displayText}</span>`;
            }
        });

        html = html.replace(/^- (.*?)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        html = html.split('\n\n')
            .map(para => {
                if (para.trim().startsWith('<h') || para.trim().startsWith('<ul') ||
                    para.trim().startsWith('<pre') || para.trim().startsWith('<div class="code-block"')) {
                    return para;
                }
                return para.trim() ? `<p>${para.trim()}</p>` : '';
            })
            .join('');

        return { html, headings };
    },

    updateTOC(headings) {
        const tocList = document.getElementById('tocList');
        tocList.innerHTML = '';

        if (headings.length === 0) {
            tocList.innerHTML = '<li class="toc-item"><em style="color: var(--text-secondary); font-size: 0.9rem;">No headings</em></li>';
            return;
        }

        headings.forEach(heading => {
            const li = document.createElement('li');
            li.className = `toc-item level-${heading.level}`;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'toc-link';
            link.textContent = heading.title;
            li.appendChild(link);
            tocList.appendChild(li);
        });
    },

    search() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (!query) {
            this.showHome();
            return;
        }

        const results = this.files.filter(file =>
            file.displayName.toLowerCase().includes(query) ||
            file.category.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            this.showView('emptyView');
            return;
        }

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';
        results.forEach(file => {
            const card = document.createElement('a');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-title">${file.displayName}</div>
                <div class="category-card-count">${file.category}</div>
            `;
            card.onclick = (e) => {
                e.preventDefault();
                this.loadFile(file.path, file.displayName);
            };
            resultsContainer.appendChild(card);
        });

        this.showView('searchView');
        this.updateTOC([]);
    },

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    },

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => this.search());

        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Scroll to Top Button
        const scrollToTopBtn = document.getElementById('scrollToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

app.init();
