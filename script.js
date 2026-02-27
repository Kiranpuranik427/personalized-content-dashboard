const { useState, useEffect } = React;

// Fallback data for when the API limit is hit or blocked on GitHub
const MOCK_DATA = [
  {
    title: "Understanding React Development",
    description: "A deep dive into how components, state, and props drive modern web applications.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"
  },
  {
    title: "The Future of Web Interfaces",
    description: "Exploring CSS variables, Tailwind, and the evolution of UI/UX design.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1547658719-da2b51069d6e?w=400"
  }
];

function App() {
  const [news, setNews] = useState([]);
  // Load favorites from LocalStorage if they exist
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favs");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("home");

  const API_KEY = "7c1c91bedcc54850babad03ad4a4f1e3";

  // Save favorites to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (view === "favorites") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const query = view === "trending" ? "top-headlines?country=us" : "everything?q=india";
    const url = `https://newsapi.org/v2/${query}&apiKey=${API_KEY}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok" && data.articles.length > 0) {
          setNews(data.articles);
        } else {
          // If API fails or returns no articles, show mock data
          setNews(MOCK_DATA);
        }
        setLoading(false);
      })
      .catch(() => {
        // If network fails, show mock data
        setNews(MOCK_DATA);
        setLoading(false);
      });
  }, [view]);

  const toggleFavorite = (article) => {
    const isAlreadyFav = favorites.some(fav => fav.url === article.url);
    if (isAlreadyFav) {
      setFavorites(favorites.filter(fav => fav.url !== article.url));
    } else {
      setFavorites([...favorites, article]);
    }
  };

  const currentList = view === "favorites" ? favorites : news;

  const filteredNews = currentList.filter(item => 
    item.title && 
    item.urlToImage && 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wrapper">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>🏠 Home</div>
        <div className={`nav-item ${view === 'trending' ? 'active' : ''}`} onClick={() => setView('trending')}>🔥 Trending</div>
        <div className={`nav-item ${view === 'favorites' ? 'active' : ''}`} onClick={() => setView('favorites')}>⭐ Favorites</div>
        <div className="nav-item">⚙️ Settings</div>
      </aside>

      <main className="main-content">
        <div className="search-container">
          <input 
            type="text" 
            placeholder={`Search ${view}...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <header style={{marginBottom: '2rem'}}>
          <h1 style={{margin: 0}}>
            {view === 'home' && 'Personalized Feed'}
            {view === 'trending' && 'Trending Now'}
            {view === 'favorites' && 'Your Saved Stories'}
          </h1>
        </header>

        {loading && <p>Loading articles...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}

        <div className="grid">
          {!loading && filteredNews.length === 0 && (
            <p>{view === "favorites" ? "No favorited articles found." : "No articles found."}</p>
          )}
          {filteredNews.map((item, index) => {
            const isFav = favorites.some(fav => fav.url === item.url);
            return (
              <div key={index} className="card">
                <img src={item.urlToImage} alt="news-thumbnail" />
                <div className="card-content">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px'}}>
                    <h3 style={{fontSize: '1rem', margin: '0 0 10px 0'}}>{item.title}</h3>
                    <button 
                      onClick={() => toggleFavorite(item)}
                      style={{
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '1.2rem',
                        padding: '0',
                        color: isFav ? '#ef4444' : '#cbd5e1'
                      }}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p>{item.description ? item.description.slice(0, 85) + "..." : "No description available."}</p>
                  <a href={item.url} target="_blank" className="read-more">Read More →</a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
