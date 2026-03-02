const articleFeed = document.getElementById("article-feed");
const loadMoreBtn = document.getElementById("load-more");
const latestMain = document.getElementById("latest-main");
const latestSide = document.getElementById("latest-side");

if (articleFeed && loadMoreBtn && latestMain && latestSide) {
  const articles = [
    { slug: "dubai-rental-yield-guide", title: "Dubai Rental Yield Guide (2026)", category: "UAE Property", image: "https://picsum.photos/seed/post1/900/540" },
    { slug: "free-zone-business-checklist", title: "UAE Free Zone Business Checklist", category: "UAE Business", image: "https://picsum.photos/seed/post2/900/540" },
    { slug: "us-dividend-stocks-beginner", title: "US Dividend Stocks for Beginners", category: "US Stock Investment", image: "https://picsum.photos/seed/post3/900/540" },
    { slug: "abu-dhabi-neighborhoods", title: "Best Abu Dhabi Neighborhoods for Expats", category: "UAE Lifestyle", image: "https://picsum.photos/seed/post4/900/540" },
    { slug: "uae-property-roi-mistakes", title: "5 ROI Mistakes in UAE Property", category: "UAE Property", image: "https://picsum.photos/seed/post5/900/540" },
    { slug: "dubai-rental-yield-guide", title: "How to Read Dubai Community Reports", category: "UAE Property", image: "https://picsum.photos/seed/post6/900/540" },
    { slug: "free-zone-business-checklist", title: "Business Bank Account Setup in UAE", category: "UAE Business", image: "https://picsum.photos/seed/post7/900/540" },
    { slug: "us-dividend-stocks-beginner", title: "ETF vs Individual Stocks: Practical Comparison", category: "US Stock Investment", image: "https://picsum.photos/seed/post8/900/540" },
    { slug: "abu-dhabi-neighborhoods", title: "Weekend Lifestyle Guide: Dubai & Abu Dhabi", category: "UAE Lifestyle", image: "https://picsum.photos/seed/post9/900/540" },
    { slug: "uae-property-roi-mistakes", title: "Mortgage Basics for UAE Residents", category: "UAE Property", image: "https://picsum.photos/seed/post10/900/540" }
  ];

  const latestArticles = articles.slice(0, 5);
  const feedArticles = articles.slice(5);
  const PAGE_SIZE = 4;
  let rendered = 0;

  const postLink = (slug) => `/posts/${slug}/`;

  function createCard(article) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <a href="${postLink(article.slug)}">
        <img src="${article.image}" alt="${article.title}" loading="lazy" width="900" height="540" />
        <div class="card-content">
          <p class="muted">${article.category}</p>
          <h3>${article.title}</h3>
        </div>
      </a>
    `;
    return card;
  }

  function renderLatest() {
    const [main, ...side] = latestArticles;
    latestMain.innerHTML = `
      <a href="${postLink(main.slug)}">
        <img src="${main.image}" alt="${main.title}" loading="eager" fetchpriority="high" width="900" height="540" />
        <div class="card-content">
          <p class="muted">${main.category}</p>
          <h3>${main.title}</h3>
        </div>
      </a>
    `;
    side.forEach((article) => latestSide.appendChild(createCard(article)));
  }

  function renderNextBatch() {
    const next = feedArticles.slice(rendered, rendered + PAGE_SIZE);
    next.forEach((article) => articleFeed.appendChild(createCard(article)));
    rendered += next.length;
    if (rendered >= feedArticles.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "No More Articles";
    }
  }

  loadMoreBtn.addEventListener("click", renderNextBatch);
  renderLatest();
  renderNextBatch();
}
