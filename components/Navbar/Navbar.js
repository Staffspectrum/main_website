"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

// Navigation links configuration matching the design
const drawerNavItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Services", href: "/services" },
  { name: "Industries", href: "/industries" },
  { name: "Careers", href: "/careers" },
  { name: "Training", href: "/chrmp" },
  { name: "Blog", href: "/blog" }
];

export default function Navbar() {
  const pathname = usePathname();
  const isDarkInitial =
    pathname === "/" ||
    pathname === "/chrmp" ||
    pathname === "/about-us" ||
    pathname === "/careers" ||
    pathname === "/contact-us";

  const [scrolled, setScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkInitial);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Detect background luminance behind navbar to switch glass theme
  const detectTheme = () => {
    if (typeof window === "undefined") return;

    // At top of page, determine default from route
    if (window.scrollY < 20) {
      if (
        pathname === "/" ||
        pathname === "/chrmp" ||
        pathname === "/about-us" ||
        pathname === "/careers" ||
        pathname === "/contact-us"
      ) {
        setIsDarkTheme(true);
        return;
      }
      if (pathname.startsWith("/careers/") || pathname.startsWith("/blog/")) {
        setIsDarkTheme(false);
        return;
      }
    }

    // Inspect sections/containers intersecting the navbar (y = 40)
    const sections = document.querySelectorAll("section, footer, main > div, main");
    let isDarkDetected = false;

    for (const sec of sections) {
      if (sec.tagName === "HEADER") continue;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 65 && rect.bottom >= 20) {
        const id = (sec.id || "").toLowerCase();
        const cls = (sec.className || "").toString().toLowerCase();

        // Check specific known dark sections
        if (
          id === "about-hero" ||
          id === "solutions-hero" ||
          id === "careers-hero" ||
          cls.includes("herosection") ||
          cls.includes("whatwedo") ||
          cls.includes("industriessection") ||
          cls.includes("featuredsection") ||
          cls.includes("footer")
        ) {
          isDarkDetected = true;
          break;
        }

        // Check section background color (ignore transparent sections or child cards)
        const bg = window.getComputedStyle(sec).backgroundColor;
        const nums = bg ? bg.match(/\d+/g) : null;
        if (nums && nums.length >= 3) {
          const [r, g, b, a] = nums.map(Number);
          if (nums.length < 4 || a > 0.3) {
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (luminance < 0.4) {
              isDarkDetected = true;
              break;
            }
          }
        }
      }
    }

    setIsDarkTheme(isDarkDetected);
  };

  // Monitor scroll with requestAnimationFrame and background theme state
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const isScrolledNow = window.scrollY > 20;
      setScrolled(isScrolledNow);
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectTheme();
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    const timer = setTimeout(detectTheme, 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", detectTheme, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", detectTheme);
    };
  }, [pathname]);

  // Close menu on navigation change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const [isMobile, setIsMobile] = useState(false);

  // Track viewport size for mobile animation tuning (matches mobile/tablet drawer view)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Multi-colored curtain wave enter animations
  const curtain1Variants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.25, ease: "easeOut" }
    },
    open: {
      y: 0,
      transition: { duration: isMobile ? 0.52 : 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const curtain2Variants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.25, ease: "easeOut" }
    },
    open: {
      y: 0,
      transition: {
        delay: isMobile ? 0.07 : 0.06,
        duration: isMobile ? 0.52 : 0.45,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const curtain3Variants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.25, ease: "easeOut" }
    },
    open: {
      y: 0,
      transition: {
        delay: isMobile ? 0.14 : 0.12,
        duration: isMobile ? 0.52 : 0.45,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Drawer variants (upside to down slide)
  const drawerVariants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.25, ease: "easeOut" }
    },
    open: {
      y: 0,
      transition: {
        delay: isMobile ? 0.2 : 0.18,
        duration: isMobile ? 0.56 : 0.48,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Backdrop variants
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      transition: { duration: isMobile ? 0.35 : 0.3 }
    }
  };

  // Links staggered container variants
  const containerVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.15 }
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.045 : 0.04,
        delayChildren: isMobile ? 0.28 : 0.22
      }
    }
  };

  // Link item variants
  const itemVariants = {
    closed: {
      y: 15,
      opacity: 0,
      transition: { duration: 0.15 }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: isMobile ? 0.36 : 0.3, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* Top / Floating Header */}
      <header
        className={`${styles.header} ${isDarkTheme
            ? scrolled
              ? styles.scrolledDark
              : styles.unscrolledDark
            : scrolled
              ? styles.scrolled
              : styles.unscrolled
          } ${menuOpen ? styles.headerMenuOpen : ""}`}
      >
        {/* Left: Brand Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Staffspectrum Logo"
              width={38}
              height={38}
              className={styles.logoIcon}
              priority
            />
          </div>
          <div className={styles.logoBrandWrapper}>
            <span className={styles.logoTitle}>Staffspectrum</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links (Always mounted for smooth morph) */}
        <nav
          className={`${styles.desktopNav} ${
            scrolled ? styles.desktopNavHidden : ""
          }`}
          aria-label="Main Navigation"
          aria-hidden={scrolled}
        >
          {drawerNavItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.desktopNavLink} ${
                  active ? styles.activeNavLink : ""
                }`}
                tabIndex={scrolled ? -1 : 0}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Contact Button & Menu Trigger (Continuous morph) */}
        <div className={styles.headerRight}>
          <Link
            href="/contact-us"
            className={`${styles.contactBtnPill} ${
              scrolled || menuOpen ? styles.contactBtnHidden : ""
            }`}
            tabIndex={scrolled || menuOpen ? -1 : 0}
            aria-hidden={scrolled || menuOpen}
          >
            <span>CONTACT US</span>
            <span className={styles.contactArrow}>&rarr;</span>
          </Link>

          {/* Menu / Close Toggle Trigger */}
          <button
            type="button"
            className={`${styles.menuToggle} ${
              !scrolled && !menuOpen ? styles.menuToggleCollapsed : ""
            }`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={menuOpen}
            suppressHydrationWarning
          >
            {menuOpen ? (
              <span className={styles.closeText}>
                <span className={styles.closeWord}>Close</span>
                <span className={styles.closeSymbol}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </span>
              </span>
            ) : (
              <>
                <span className={styles.menuText}>Menu</span>
                <span className={styles.menuIndicator}>
                  <span className={styles.indicatorLine}></span>
                  <span className={styles.indicatorLine}></span>
                  <span className={styles.indicatorLine}></span>
                </span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Side Drawer and Backdrop overlay (Active on Menu toggle click) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Blurred page backdrop overlay */}
            <motion.div
              key="nav-backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={styles.backdrop}
              onClick={() => setMenuOpen(false)}
            />

            {/* Curtain 1: Orange */}
            <motion.div
              key="curtain-1"
              variants={curtain1Variants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`${styles.curtain} ${styles.curtainOrange}`}
            />

            {/* Curtain 2: Dark Blue */}
            <motion.div
              key="curtain-2"
              variants={curtain2Variants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`${styles.curtain} ${styles.curtainDarkBlue}`}
            />

            {/* Curtain 3: Blue */}
            <motion.div
              key="curtain-3"
              variants={curtain3Variants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`${styles.curtain} ${styles.curtainBlue}`}
            />

            {/* Slide-down Main Drawer */}
            <motion.div
              key="nav-drawer"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={styles.drawer}
            >
              {/* Vertical link structure */}
              <motion.div
                className={styles.drawerContent}
                variants={containerVariants}
              >
                <div className={styles.linksWrapper}>
                  {drawerNavItems.map((item, index) => {
                    const normalizedPath = (pathname || "/").replace(/\/+$/, "") || "/";
                    const itemPath = item.href.replace(/\/+$/, "") || "/";
                    const active =
                      itemPath === "/"
                        ? normalizedPath === "/"
                        : normalizedPath === itemPath ||
                          normalizedPath.startsWith(itemPath + "/");

                    const isHovered = hoveredIndex === index;
                    const isAnyHovered = hoveredIndex !== null;
                    const opacityStyle = isHovered
                      ? 1
                      : isAnyHovered
                        ? 0.45
                        : active
                          ? 1
                          : 0.85;

                    return (
                      <motion.div
                        key={item.href}
                        variants={itemVariants}
                        className={styles.navItem}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{ opacity: opacityStyle }}
                      >
                        <Link
                          href={item.href}
                          className={`${styles.navLink} ${active ? styles.active : ""
                            }`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Footer Section of Drawer */}
                <motion.div
                  className={styles.drawerFooter}
                  variants={itemVariants}
                >
                  {/* Social Icons */}
                  <div className={styles.socials}>
                    <a
                      href="https://wa.me/918594000720"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="WhatsApp"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.35.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.675-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.201.05-.376-.025-.527-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.508-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.229 3.11.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.9.12.58-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.352zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.97.57 3.81 1.57 5.37L2 22l4.82-1.57c1.5 1 3.29 1.57 5.22 1.57 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96zm0 18.23c-1.68 0-3.25-.49-4.59-1.34l-.33-.21-3.39 1.1 1.13-3.31-.23-.36c-.95-1.4-1.46-3.05-1.46-4.75 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.56-3.71 8.27-8.27 8.27z"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/staffspectrum/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Instagram"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/Staffspectrum/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Facebook"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/staffspectrumservices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="LinkedIn"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.5 21.5h-5v-13h5v13zM4 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM22.5 21.5h-5v-7c0-1.8-0.7-3-2.3-3-1.2 0-2 0.8-2.3 1.6-0.1 0.3-0.1 0.7-0.1 1.1v7.3h-5s0.1-11.8 0-13h5v1.8c0.7-1 1.9-2.5 4.5-2.5 3.3 0 5.8 2.2 5.8 6.8v6.9z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://x.com/StaffSpectrum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="X (Twitter)"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                      </svg>
                    </a>
                  </div>

                  {/* Neon highlight CTA */}
                  <div className={styles.ctaWrapper}>
                    <Link
                      href="/contact-us"
                      style={{ width: "100%" }}
                      className={styles.ctaBtn}
                      onClick={() => setMenuOpen(false)}
                    >
                      Let&apos;s Connect
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
