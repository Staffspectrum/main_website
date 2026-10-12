"use client";

import Link from "next/link";
import styles from "./post.module.css";

export default function BlogBackLink({ slug }) {
  const handleBack = (e) => {
    if (typeof window !== "undefined" && document.referrer && document.referrer.includes("/blog")) {
      // If the user came from the blog section, go back to preserve filter/search state
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <Link href={`/blog#post-${slug}`} className={styles.backLink} onClick={handleBack}>
      <svg
        className={styles.backArrow}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>Back to Blog</span>
    </Link>
  );
}
