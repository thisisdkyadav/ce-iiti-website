const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const PUBLIC_REFRESH_INTERVAL_MS = 60_000;

const publicContentCache = new Map();
const publicContentInflight = new Map();
const unsupportedPublicKeys = new Set();

const optionalPublicEndpointFetcher = (path) => async () => {
  return requestJson(path);
};

const publicContentFetchers = {
  bootstrap: {
    fetcher: () => requestJson("/api/public/bootstrap"),
    optional: false,
  },
  home: {
    fetcher: () => requestJson("/api/public/home"),
    optional: false,
  },
  about: {
    fetcher: () => requestJson("/api/public/about"),
    optional: false,
  },
  academics: {
    fetcher: () => requestJson("/api/public/academics"),
    optional: false,
  },
  people: {
    fetcher: optionalPublicEndpointFetcher("/api/public/people"),
    optional: false,
  },
  specializations: {
    fetcher: optionalPublicEndpointFetcher("/api/public/specializations"),
    optional: false,
  },
  events: {
    fetcher: optionalPublicEndpointFetcher("/api/public/events"),
    optional: true,
  },
  contact: {
    fetcher: optionalPublicEndpointFetcher("/api/public/contact"),
    optional: true,
  },
};

const publicRouteKeyMap = {
  "/": "home",
  "/about": "about",
  "/academics": "academics",
  "/people": "people",
  "/specializations": "specializations",
  "/events": "events",
  "/contact": "contact",
};

function isNotFoundError(error) {
  return /404/.test(String(error?.message || ""));
}

async function requestJson(path, options = {}) {
  const { method = "GET", body, credentials = "same-origin" } = options;

  const requestOptions = {
    method,
    credentials,
    headers: {},
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed: ${response.status}`
    );
  }

  return data;
}

export async function fetchPublicContentByKey(key, options = {}) {
  const { force = false } = options;
  const config = publicContentFetchers[key];

  if (!config) {
    return null;
  }

  if (unsupportedPublicKeys.has(key)) {
    return null;
  }

  if (!force && publicContentCache.has(key)) {
    return publicContentCache.get(key).data;
  }

  if (publicContentInflight.has(key)) {
    return publicContentInflight.get(key);
  }

  const requestPromise = config
    .fetcher()
    .then((data) => {
      publicContentCache.set(key, {
        data,
        updatedAt: Date.now(),
      });
      return data;
    })
    .catch((error) => {
      if (config.optional && isNotFoundError(error)) {
        unsupportedPublicKeys.add(key);
        return null;
      }

      throw error;
    })
    .finally(() => {
      publicContentInflight.delete(key);
    });

  publicContentInflight.set(key, requestPromise);
  return requestPromise;
}

export function getCachedPublicContentByKey(key) {
  if (!publicContentCache.has(key)) {
    return null;
  }

  return publicContentCache.get(key).data;
}

export function getPublicContentKeyFromPath(pathname) {
  return publicRouteKeyMap[pathname] || null;
}

export function getBackgroundPublicContentKeys(priorityKey = null) {
  const keys = Object.keys(publicContentFetchers).filter(
    (key) => !unsupportedPublicKeys.has(key)
  );

  if (!priorityKey || !keys.includes(priorityKey)) {
    return keys;
  }

  return [priorityKey, ...keys.filter((key) => key !== priorityKey)];
}

export async function prefetchPublicContent(keys, options = {}) {
  const { force = false } = options;

  for (const key of keys) {
    try {
      await fetchPublicContentByKey(key, { force });
    } catch (_error) {
      // Keep background prefetch resilient and continue with next keys.
    }
  }
}

export function startPublicContentAutoRefresh(
  keys,
  intervalMs = PUBLIC_REFRESH_INTERVAL_MS
) {
  const intervalId = setInterval(() => {
    prefetchPublicContent(keys, { force: true });
  }, intervalMs);

  return () => clearInterval(intervalId);
}

export async function fetchBootstrapContent(options = {}) {
  return fetchPublicContentByKey("bootstrap", options);
}

export async function fetchHomeContent(options = {}) {
  return fetchPublicContentByKey("home", options);
}

function adminRequest(path, options = {}) {
  return requestJson(path, {
    ...options,
    credentials: "include",
  });
}

export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

export function adminLogin(username, password) {
  return adminRequest("/api/admin/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function adminLogout() {
  return adminRequest("/api/admin/auth/logout", {
    method: "POST",
  });
}

export function fetchAdminSession() {
  return adminRequest("/api/admin/auth/session");
}

export function fetchAdminContent() {
  return adminRequest("/api/admin/content");
}

export function uploadAdminImage(file, category = "general") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", category);

  return adminRequest("/api/admin/uploads/image", {
    method: "POST",
    body: formData,
  });
}

export function updateSiteSettings(payload) {
  return adminRequest("/api/admin/site-settings", {
    method: "PUT",
    body: payload,
  });
}

export function createNavigationItem(payload) {
  return adminRequest("/api/admin/navigation-items", {
    method: "POST",
    body: payload,
  });
}

export function updateNavigationItem(id, payload) {
  return adminRequest(`/api/admin/navigation-items/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteNavigationItem(id) {
  return adminRequest(`/api/admin/navigation-items/${id}`, {
    method: "DELETE",
  });
}

export function createSocialLink(payload) {
  return adminRequest("/api/admin/social-links", {
    method: "POST",
    body: payload,
  });
}

export function updateSocialLink(id, payload) {
  return adminRequest(`/api/admin/social-links/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteSocialLink(id) {
  return adminRequest(`/api/admin/social-links/${id}`, {
    method: "DELETE",
  });
}

export function createFooterLink(payload) {
  return adminRequest("/api/admin/footer-links", {
    method: "POST",
    body: payload,
  });
}

export function updateFooterLink(id, payload) {
  return adminRequest(`/api/admin/footer-links/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteFooterLink(id) {
  return adminRequest(`/api/admin/footer-links/${id}`, {
    method: "DELETE",
  });
}

export function updateHomeContent(payload) {
  return adminRequest("/api/admin/home-content", {
    method: "PUT",
    body: payload,
  });
}

export function updateAboutContent(payload) {
  return adminRequest("/api/admin/about-content", {
    method: "PUT",
    body: payload,
  });
}

export function updateAcademicsContent(payload) {
  return adminRequest("/api/admin/academics-content", {
    method: "PUT",
    body: payload,
  });
}

export function updateSpecializationsContent(payload) {
  return adminRequest("/api/admin/specializations-content", {
    method: "PUT",
    body: payload,
  });
}

export function createHeroSlide(payload) {
  return adminRequest("/api/admin/home/hero-slides", {
    method: "POST",
    body: payload,
  });
}

export function updateHeroSlide(id, payload) {
  return adminRequest(`/api/admin/home/hero-slides/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteHeroSlide(id) {
  return adminRequest(`/api/admin/home/hero-slides/${id}`, {
    method: "DELETE",
  });
}

export function createHomeStat(payload) {
  return adminRequest("/api/admin/home/stats", {
    method: "POST",
    body: payload,
  });
}

export function updateHomeStat(id, payload) {
  return adminRequest(`/api/admin/home/stats/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteHomeStat(id) {
  return adminRequest(`/api/admin/home/stats/${id}`, {
    method: "DELETE",
  });
}

export function createNewsItem(payload) {
  return adminRequest("/api/admin/news", {
    method: "POST",
    body: payload,
  });
}

export function updateNewsItem(id, payload) {
  return adminRequest(`/api/admin/news/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteNewsItem(id) {
  return adminRequest(`/api/admin/news/${id}`, {
    method: "DELETE",
  });
}

export function createPeopleEntry(payload) {
  return adminRequest("/api/admin/people", {
    method: "POST",
    body: payload,
  });
}

export function updatePeopleEntry(id, payload) {
  return adminRequest(`/api/admin/people/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deletePeopleEntry(id) {
  return adminRequest(`/api/admin/people/${id}`, {
    method: "DELETE",
  });
}

export { API_BASE_URL };
