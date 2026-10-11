import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as api from "../services/api";
import { IMAGE_URL } from "../services/api";
import "../styles/MovieDetail.css";

export default function MovieDetail() {
  const { slug } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const response = await api.getMovieDetail(slug);
        const data = response.data;

        setMovieData({
          item: data.movie,
          episodes: data.episodes || [],
        });

        const posterUrl = data.movie.poster_url || data.movie.thumb_url;

        if (typeof posterUrl === "string" && posterUrl.trim() !== "") {
          setSelectedImage(
            posterUrl.startsWith("http")
              ? posterUrl
              : `${IMAGE_URL}${posterUrl}`
          );
        } else {
          setSelectedImage(null);
        }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    fetchMovieDetail();
  }, [slug]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!movieData || !movieData.item)
    return <div className="not-found">Không tìm thấy phim</div>;

  const movie = movieData.item;

  const watchEpisode = (episode) => {
    setSelectedEpisode(episode);

    setTimeout(() => {
      document.getElementById("movie-player")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="movie-detail-container">
      <div className="movie-info-section">
        <div className="poster-container">
          <img src={selectedImage} alt={movie.name} />
        </div>
        <div className="info-content">
          <h1>{movie.name}</h1>
          {movie.origin_name && (
            <span className="original-name">{movie.origin_name}</span>
          )}

          <div className="meta-tags">
            {movie.quality && (
              <span className="tag quality">{movie.quality}</span>
            )}
            {movie.lang && <span className="tag">{movie.lang}</span>}
            {movie.year && <span className="tag">{movie.year}</span>}
            {movie.time && <span className="tag">{movie.time}</span>}
          </div>

          <div className="info-grid">
            {movie.episode_current && (
              <div className="info-item">
                <span className="label">Tình trạng</span>
                <span className="value">{movie.episode_current}</span>
              </div>
            )}
            {movie.type && (
              <div className="info-item">
                <span className="label">Thể loại</span>
                <span className="value">{movie.type}</span>
              </div>
            )}
            {movie.category && movie.category.length > 0 && (
              <div className="info-item">
                <span className="label">Danh mục</span>
                <span className="value">
                  {movie.category.map((c) => c.name).join(", ")}
                </span>
              </div>
            )}
            {movie.country && movie.country.length > 0 && (
              <div className="info-item">
                <span className="label">Quốc gia</span>
                <span className="value">
                  {movie.country.map((c) => c.name).join(", ")}
                </span>
              </div>
            )}
            {movie.actor && movie.actor.length > 0 && (
              <div className="info-item">
                <span className="label">Diễn viên</span>
                <span className="value">{movie.actor.join(", ")}</span>
              </div>
            )}
            {movie.director && movie.director.length > 0 && (
              <div className="info-item">
                <span className="label">Đạo diễn</span>
                <span className="value">{movie.director.join(", ")}</span>
              </div>
            )}
          </div>

          {movie.content && (
            <div className="description">
              <div dangerouslySetInnerHTML={{ __html: movie.content }} />
            </div>
          )}

          {movieData.episodes.length > 0 &&
            movieData.episodes[0].server_data?.length > 0 && (
              <button
                type="button"
                className="watch-movie-btn"
                onClick={() =>
                  watchEpisode(movieData.episodes[0].server_data[0])
                }
              >
                ▶ Xem phim
              </button>
            )}
        </div>
      </div>

      {selectedEpisode && (
        <div className="video-player-section" id="movie-player">
          <h2>Đang xem: {selectedEpisode.name}</h2>
          {selectedEpisode.link_embed ? (
            <div className="video-player">
              <iframe
                src={selectedEpisode.link_embed}
                title={selectedEpisode.name || "Movie player"}
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerPolicy="origin"
              />
            </div>
          ) : (
            <p>Tập phim này chưa có đường dẫn phát.</p>
          )}
        </div>
      )}

      {movieData.episodes && movieData.episodes.length > 0 && (
        <div className="episodes-section">
          {movieData.episodes.map((server, index) => (
            <div key={index} className="server-group">
              <h3>{server.server_name}</h3>
              <div className="episodes-grid">
                {(server.server_data || []).map((ep, epIndex) => (
                  <button
                    key={ep.slug || epIndex}
                    type="button"
                    className="episode-btn"
                    onClick={() => watchEpisode(ep)}
                  >
                    ▶ {ep.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}