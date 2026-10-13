import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footerSection}>
      <div className="container">
        <div className={styles.topContent}>
          {/* Column 1: Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.png"
                  alt="Staffspectrum Logo"
                  width={34}
                  height={34}
                  className={styles.logoIcon}
                />
              </div>
              <span className={styles.logoText}>
                <span className={styles.logoBrand}>Staff</span>
                <span className={styles.logoSub}>spectrum</span>
              </span>
            </Link>
            <h4 className={styles.brandSlogan}>Building Stronger Businesses Through Better People Solutions.</h4>
            <p className={styles.brandDesc}>
              Helping organisations across India hire smarter, manage people better, and build stronger workplaces through complete HR solutions.
            </p>
            <div className={styles.brandTagline}>Your Complete HR Solution.</div>
          </div>

          {/* Column 2: Company */}
          <div className={`${styles.col} ${styles.companyCol}`}>
            <h4 className={styles.colHeader}>Company</h4>
            <ul>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/chrmp">CHRMP</Link></li>
              <li><Link href="/industries">Industries</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className={`${styles.col} ${styles.contactCol}`}>
            <h4 className={styles.colHeader}>Contact</h4>
            <div className={styles.contactInfo}>
              <p><a href="mailto:info@staff-spectrum.com" className={styles.contactLink}>info@staff-spectrum.com</a></p>
              <p><a href="tel:+918594000720" className={styles.contactLink}>+91 8594 000 720</a></p>
            </div>
            <div className={styles.socials}>
              <a href="https://wa.me/918594000720" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.35.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.675-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.201.05-.376-.025-.527-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.508-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.229 3.11.15.201 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.9.12.58-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.352zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.97.57 3.81 1.57 5.37L2 22l4.82-1.57c1.5 1 3.29 1.57 5.22 1.57 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96zm0 18.23c-1.68 0-3.25-.49-4.59-1.34l-.33-.21-3.39 1.1 1.13-3.31-.23-.36c-.95-1.4-1.46-3.05-1.46-4.75 0-4.56 3.71-8.27 8.27-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.56-3.71 8.27-8.27 8.27z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/Staffspectrum/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.instagram.com/staffspectrum/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/staffspectrumservices/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM22.5 21.5h-5v-7c0-1.8-0.7-3-2.3-3-1.2 0-2 0.8-2.3 1.6-0.1 0.3-0.1 0.7-0.1 1.1v7.3h-5s0.1-11.8 0-13h5v1.8c0.7-1 1.9-2.5 4.5-2.5 3.3 0 5.8 2.2 5.8 6.8v6.9z"/></svg>
              </a>
              <a href="https://x.com/StaffSpectrum" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.watermark}>
          StaffSpectrum
        </div>

        <div className={styles.bottomBar}>
          <div>&copy; 2026 Staffspectrum. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
