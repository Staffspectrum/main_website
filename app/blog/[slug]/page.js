import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "../posts-data";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import styles from "./post.module.css";
import BlogBackLink from "./BlogBackLink";

// Generate static params for static site generation
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Staffspectrum",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Staffspectrum Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Find related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main className={styles.postContainer}>
        {/* Back Link */}
        <div className={`container ${styles.backLinkContainer}`}>
          <BlogBackLink slug={post.slug} />
        </div>

        {/* Article Header */}
        <header className={`container ${styles.postHeader}`}>
          <div className={styles.categoryRow}>
            <span className={styles.categoryTag}>{post.category}</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.postDate}>Published on {post.date}</span>
          </div>
        </header>

        {/* Article Content */}
        <article className={`container ${styles.articleBody}`}>
          <div className={styles.contentWrapper}>
            {post.content.map((block, idx) => {
              switch (block.type) {
                case "paragraph":
                  // Highlight the first paragraph for premium article dropcap style
                  const isFirstPara = idx === 0;
                  return (
                    <p
                      key={idx}
                      className={`${styles.paragraph} ${
                        isFirstPara ? styles.highlightedParagraph : ""
                      }`}
                    >
                      {block.text}
                    </p>
                  );
                case "heading":
                  return (
                    <h2 key={idx} className={styles.heading2}>
                      {block.text}
                    </h2>
                  );
                case "list-intro":
                  return (
                    <p key={idx} className={styles.listIntro}>
                      {block.text}
                    </p>
                  );
                case "list":
                  return (
                    <ul key={idx} className={styles.unorderedList}>
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx} className={styles.listItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* CTA Box */}
          <div className={styles.ctaBox} id="blog-cta">
            {post.ctaType === "chrmp" ? (
              <div className={styles.ctaContent}>
                <div className={styles.ctaLabel}>EDUCATION & CAREERS</div>
                <h3 className={styles.ctaTitle}>CHRMP – Learn Like a Professional. Work Like a Professional.</h3>
                <p className={styles.ctaText}>
                  Gain corporate HR exposure, develop industry-ready skills, and prepare for a successful HR career with Staffspectrum's Certified Human Resource Management Professional (CHRMP) program.
                </p>
                <Link href="/contact-us?interest=chrmp" className={styles.ctaBtn}>
                  Enroll in CHRMP Program
                </Link>
              </div>
            ) : (
              <div className={styles.ctaContent}>
                <div className={styles.ctaLabel}>BUSINESS SOLUTION</div>
                <h3 className={styles.ctaTitle}>Simplify Your People Operations with Staffspectrum</h3>
                <p className={styles.ctaText}>
                  Partner with Staffspectrum for complete HR solutions in Kerala. From structured recruitment to payroll and compliance support, we help you hire smarter, manage better, and grow stronger.
                </p>
                <Link href="/contact-us?interest=consultancy" className={styles.ctaBtn}>
                  Get Free HR Consultation
                </Link>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts Section */}
        <section className={styles.relatedPostsSection}>
          <div className="container">
            <h3 className={styles.relatedTitle}>Read Next</h3>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((related) => (
                <div key={related.slug} className={styles.relatedCard}>
                  <span className={styles.relatedCategory}>{related.category}</span>
                  <h4 className={styles.relatedCardTitle}>
                    <Link href={`/blog/${related.slug}`}>
                      {related.title}
                    </Link>
                  </h4>
                  <p className={styles.relatedExcerpt}>{related.excerpt}</p>
                  <Link href={`/blog/${related.slug}`} className={styles.relatedLink}>
                    Read Article &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
