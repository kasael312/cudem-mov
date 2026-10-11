
import axios from "axios";

export const BASE_URL = "https://vsmov.com/api";
export const IMAGE_URL = "https://vsmov.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

// API trang chủ
export const getHome = (page = 1) =>
  apiClient.get("/danh-sach/phim-moi-cap-nhat", {
    params: { page },
  });

// API danh sách phim
export const getMoviesByCategory = (slug, page = 1) =>
  apiClient.get(`/danh-sach/${slug}`, {
    params: { page },
  });

// API tìm kiếm
export const searchMovies = (keyword, page = 1) =>
  apiClient.get("/tim-kiem", {
    params: { keyword, page },
  });

// API danh sách thể loại
export const getGenres = () =>
  apiClient.get("/the-loai");

// API phim theo thể loại
export const getMoviesByGenre = (slug, page = 1) =>
  apiClient.get(`/the-loai/${slug}`, {
    params: { page },
  });

// API danh sách quốc gia
export const getCountries = () =>
  apiClient.get("/quoc-gia");

// API phim theo quốc gia
export const getMoviesByCountry = (slug, page = 1) =>
  apiClient.get(`/quoc-gia/${slug}`, {
    params: { page },
  });

// API danh sách năm phát hành
export const getYears = () =>
  apiClient.get("/nam-phat-hanh");

// API phim theo năm
export const getMoviesByYear = (year, page = 1) =>
  apiClient.get(`/nam-phat-hanh/${year}`, {
    params: { page },
  });

// API chi tiết phim
export const getMovieDetail = (slug) =>
  apiClient.get(`/phim/${slug}`);

// API diễn viên / nhân sự
export const getMoviePeople = (slug) =>
  apiClient.get(`/phim/${slug}/peoples`);

export default apiClient;
