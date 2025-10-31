import React, { useEffect } from "react";

// Lightweight meta manager that works without external deps.
// Usage: <Meta title="..." description="..." image="..." url="..." />
const ensureMeta = (attr, name) => {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  return el;
};

const setMetaContent = (attr, name, content) => {
  if (!content) return;
  const el = ensureMeta(attr, name);
  el.setAttribute("content", content);
};

const Meta = ({ title, description, image, url }) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      setMetaContent("name", "description", description);
    }

    // Open Graph
    if (title) setMetaContent("property", "og:title", title);
    if (description) setMetaContent("property", "og:description", description);
    if (image) setMetaContent("property", "og:image", image);
    if (url) setMetaContent("property", "og:url", url);

    // Twitter
    if (title) setMetaContent("name", "twitter:title", title);
    if (description) setMetaContent("name", "twitter:description", description);
    if (image) setMetaContent("name", "twitter:image", image);

    return () => {
      // noop cleanup — we intentionally don't remove tags to avoid flicker
    };
  }, [title, description, image, url]);

  return null;
};

export default Meta;
