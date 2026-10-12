"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { blogPosts } from "./posts-data";
import styles from "./blog.module.css";

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "HR Systems", "Careers & Training", "Business Solutions"];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className={styles.blogWrapper}>
      {/* Dark Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>BLOGS</h1>
        </div>
      </section>

      {/* Overview Section in Content Page */}
      <section className={`container ${styles.overviewSection}`}>
        <div className={styles.overviewCard}>
          <p className={styles.overviewText}>
            Expert perspectives, tactical guides, and updates on HR systems, recruitment, professional training, and scaling organizations.
          </p>
        </div>
      </section>

      {/* Main Listing & Filters Section */}
      <section className={`container ${styles.listingSection}`}>
        {/* Filter and Search Controls */}
        <div className={styles.controlsRow}>
          {/* Categories list */}
          <div className={styles.categoriesList}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryTab} ${
                  activeCategory === cat ? styles.categoryTabActive : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Article Cards Grid */}
        {filteredPosts.length > 0 ? (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <article key={post.slug} className={styles.postCard} id={`post-${post.slug}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.postCategory}>{post.category}</span>
                  <span className={styles.postReadTime}>{post.readTime}</span>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.postTitle}>
                    <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.metaRow}>
                    <span className={styles.postDate}>{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className={styles.readMoreBtn}>
                    <span>Read Article</span>
                    <svg
                      className={styles.arrowIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No articles found</h3>
            <p>We couldn't find any articles matching your search criteria. Try a different term or clear the filter.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
