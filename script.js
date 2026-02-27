const { useState, useEffect } = React;


const MOCK_DATA = [
  { title: "Understanding React Development", description: "A deep dive into how components, state, and props work.", url: "#", urlToImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400" },
  { title: "Next.js 15 Features", description: "Exploring server components and streaming capabilities.", url: "#", urlToImage: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400" },
  { title: "AI in Software Engineering", description: "How LLMs are changing the way developers debug.", url: "#", urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
  { title: "Cybersecurity Basics", description: "Protecting your web applications from vulnerabilities.", url: "#", urlToImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
  { title: "The Future of Web 3.0", description: "Decentralized applications and user ownership.", url: "#", urlToImage: "https://images.unsplash.com/photo-1621416895569-26154d5d3ba7?w=400" }
];

const TRENDING_DATA = [
  { title: "SpaceX Starship Launch", description: "Latest countdown and mission objectives.", url: "#", urlToImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400" },
  { title: "New Smartphone Launch", description: "All the leaked specs for the upcoming flagship.", url: "#", urlToImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" },
  { title: "Global Climate Summit", description: "Renewable energy policy shifts.", url: "#", urlToImage: "https://images.unsplash.com/photo-1473341617437-09edad10d144?w=400" }
];

function App() {
  const [news, setNews] = useState([]);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favs");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("home"); 

  const API_KEY = "7c1c91bedcc54850babad03ad4a4f1e3";

  
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
         
          setNews(view === "trending" ? TRENDING_DATA : MOCK_DATA);
        }
        setLoading(false);
      })
      .catch(() => {
       
        setNews(view === "trending" ? TRENDING_DATA : MOCK_DATA);
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
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0',
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
