// news.js
document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    const newsLoading = document.getElementById('news-loading');
    const newsError = document.getElementById('news-error');
    const retryBtn = document.getElementById('retry-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Default search query
    let currentCategory = 'indian agriculture';

    // Initialize
    fetchNews(currentCategory);

    // Event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Fetch news for new category
            currentCategory = e.target.getAttribute('data-category');
            fetchNews(currentCategory);
        });
    });

    if (retryBtn) {
        retryBtn.addEventListener('click', () => fetchNews(currentCategory));
    }

    async function fetchNews(query) {
        // Show loading state
        newsGrid.innerHTML = '';
        newsLoading.style.display = 'flex';
        newsError.style.display = 'none';

        try {
            // We use our local Python backend to proxy Bing News RSS safely 
            // and securely extract the correct images that aren't provided by standard RSS formats
            const encodedQuery = encodeURIComponent(query);
            const apiUrl = `http://127.0.0.1:5000/api/news?q=${encodedQuery}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok' || !data.items || data.items.length === 0) {
                throw new Error('Invalid data received or no news found');
            }
            
            renderNews(data.items);
            
        } catch (error) {
            console.error('Error fetching news:', error);
            newsLoading.style.display = 'none';
            newsError.style.display = 'block';
        }
    }

    function renderNews(items) {
        newsLoading.style.display = 'none';
        newsGrid.innerHTML = '';
        
        // Take up to 12 articles
        const articles = items.slice(0, 12);
        
        articles.forEach(article => {
            // Format date
            const pubDate = new Date(article.pubDate);
            const dateStr = pubDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const title = article.title;
            const source = article.source || 'Agri News';
            
            // The backend directly resolves image to the actual source image
            let imageUrl = article.image || getRandomAgriImage();
            
            // Clean up description (Bing desc tends to be clean, but we still HTML-strip)
            const cleanDesc = cleanDescription(article.description || '');
            
            const card = document.createElement('div');
            card.className = 'news-card';
            
            card.innerHTML = `
                <div class="news-image-container">
                    <span class="news-source-badge">${source}</span>
                    <img src="${imageUrl}" alt="News Image" class="news-image" loading="lazy" onerror="this.src='${getRandomAgriImage()}'">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span><i class="ph-bold ph-calendar-blank"></i> ${dateStr}</span>
                    </div>
                    <h3 class="news-title">${title}</h3>
                    <p class="news-desc">${cleanDesc}</p>
                    <div class="news-footer">
                        <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-read-more">
                            Read Full Article <i class="ph-bold ph-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            
            newsGrid.appendChild(card);
        });
    }
    
    // Helper function to extract image from RSS item html content
    function extractImage(article) {
        if (article.enclosure && article.enclosure.link) {
            return article.enclosure.link;
        }
        
        // If content contains an img tag, try to extract its src
        if (article.content) {
            const imgMatch = article.content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
                return imgMatch[1];
            }
            // Some RSS to JSON parsing has description with image
        }
        
        if (article.description) {
            const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
                return imgMatch[1];
            }
        }
        
        return null; // Let the caller use fallback image
    }
    
    // Fallback beautiful agricultural images representing Indian farming context
    function getRandomAgriImage() {
        const fallbackImages = [
            'assets/hero_bg.png',
            'assets/hero_bg 2.jpg',
            'assets/hero_bg 3.jpg',
            'assets/card_crop_id.png',
            'assets/card_dashboard.png',
            'assets/card_schemes.png'
        ];
        return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
    
    // Clean up HTML tags and "View Full Coverage" texts from Google News description
    function cleanDescription(htmlDesc) {
        // Create a temporary element to strip HTML tags
        const temp = document.createElement('div');
        temp.innerHTML = htmlDesc;
        let text = temp.textContent || temp.innerText || '';
        
        // Remove trailing texts usually added by Google News RSS
        text = text.replace(/View Full Coverage on Google News/g, '');
        
        // Truncate to a reasonable length if still too long
        if (text.length > 150) {
            text = text.substring(0, 150) + '...';
        }
        
        return text || 'Click to read more about this update in Indian agriculture sector.';
    }
});
