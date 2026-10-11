
import { useState, useEffect } from "react";
import * as api from "../services/api";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";

const getItems = (response) => {
  // Hỗ trợ cả Axios response và dữ liệu đã được bóc response.data
  const payload = response?.data ?? response;
  const data = payload?.data ?? payload;

  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.items?.items)) return data.items.items;
  if (Array.isArray(data?.list)) return data.list;

  return [];
};

export default function Home() {
  const [sections, setSections] = useState({
    featured: [],
    phimLe: [],
    phimBo: [],
    tvShows: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHome = async () => {
      try {
        setLoading(true);
        setError(null);

        const [homeRes, phimLeRes, phimBoRes] =
          await Promise.all([
            api.getHome(1),
            api.getMoviesByCategory("phim-le", 1),
            api.getMoviesByCategory("phim-bo", 1),
          ]);

        if (cancelled) return;

        const homeItems = getItems(homeRes);
        const phimLeItems = getItems(phimLeRes);
        const phimBoItems = getItems(phimBoRes);

        setSections({
          featured: homeItems.slice(0, 15),
          phimLe: phimLeItems.slice(0, 15),
          phimBo: phimBoItems.slice(0, 15),
          tvShows: homeItems.slice(15, 30),
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Fetch home failed:", err);
        setError(
          err.response
            ? `API lỗi ${err.response.status}: ${
                err.response.statusText || "Request failed"
              }`
            : err.message || "Không thể tải danh sách phim."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHome();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <button
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  const renderSection = (title, movies) => {
    if (!movies.length) return null;

    return (
      <section className="home-section" key={title}>
        <h2 className="section-title">{title}</h2>
        <div className="movies-row">
          <div className="movies-slider">
            {movies.map((movie, index) => (
              <div
                key={movie._id || movie.id || movie.slug || index}
                className="movie-item"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="home-container">
      {renderSection("🔥 Phim Mới Cập Nhật", sections.featured)}
      {renderSection("🎬 Phim Lẻ Mới", sections.phimLe)}
      {renderSection("📺 Phim Bộ Hot", sections.phimBo)}
      {renderSection("⭐ Xu Hướng", sections.tvShows)}
    </div>
  );
}
