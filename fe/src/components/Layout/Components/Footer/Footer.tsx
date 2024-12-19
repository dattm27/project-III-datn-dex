import React from 'react';


const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.container}>
      {/* Social Media Section */}
      <div style={styles.left}>
        <a href="#" style={styles.icon} aria-label="GitHub">
          <i className="fab fa-github"></i>
        </a>
        <a href="#" style={styles.icon} aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" style={styles.icon} aria-label="Discord">
          <i className="fab fa-discord"></i>
        </a>
      </div>

      {/* Navigation Section */}
      <div style={styles.right}>
        <div style={styles.column}>
          <h3 style={styles.title}>App</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Swap</a></li>
            <li><a href="#" style={styles.link}>Explore</a></li>
            <li><a href="#" style={styles.link}>Pool</a></li>
          </ul>
        </div>
        <div style={styles.column}>
          <h3 style={styles.title}>Company</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Careers</a></li>
            <li><a href="#" style={styles.link}>Blog</a></li>
            <li><a href="#" style={styles.link}>Brand Assets</a></li>
          </ul>
        </div>
        <div style={styles.column}>
          <h3 style={styles.title}>Need Help?</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Help Center</a></li>
            <li><a href="#" style={styles.link}>Contact Us</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div style={styles.bottom}>
      <p>© 2024 Bamboo Finance. All rights reserved.</p>
      <p>
        <a href="#" style={styles.bottomLink}>Trademark Policy</a> | 
        <a href="#" style={styles.bottomLink}>Privacy Policy</a>
      </p>
    </div>
  </footer>
);

const styles = {
  footer: {
    backgroundColor: '#f8f9fa',
    color: '#333',
    padding: '20px 40px',
    marginTop: 'auto',
    // borderTop: '1px solid #e1e1e1',
    fontSize: '14px',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px',
  },
  left: {
    display: 'flex',
    gap: '15px',
  },
  icon: {
    color: '#555',
    fontSize: '18px',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  iconHover: {
    color: '#007bff',
  },
  right: {
    display: 'flex',
    gap: '40px',
  },
  column: {
    flex: '1',
  },
  title: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#000',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: '#555',
    textDecoration: 'none',
    transition: 'color 0.3s',
    marginBottom: '8px',
    display: 'block',
  },
  linkHover: {
    color: '#007bff',
  },
  bottom: {
    marginTop: '20px',
    textAlign: 'center',
    borderTop: '1px solid #e1e1e1',
    paddingTop: '15px',
    fontSize: '12px',
    color: '#777',
  },
  bottomLink: {
    color: '#555',
    textDecoration: 'none',
  },
  bottomLinkHover: {
    color: '#007bff',
  },
};

export default Footer;
