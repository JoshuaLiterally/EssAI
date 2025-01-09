// src/HomePage/HomePage.jsx
import { Link } from 'react-router-dom';
import './HomePage.css';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="homepage__gradient-blur"></div>
      <header className="homepage__header">
        <motion.div 
          className="homepage__logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          EssAI
        </motion.div>
        <nav className="homepage__nav">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/documents" className="homepage__link" style={{ marginRight: '1rem' }}>My Documents</Link>
            <Link to="/login" className="homepage__link homepage__link--primary">Login</Link>
          </motion.div>
        </nav>
      </header>
      
      <main className="homepage__main">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Write with confidence
          <br />
          <span className="gradient-text">powered by AI</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Experience the future of document creation with intelligent assistance.
        </motion.p>
        
        <motion.div 
          className="homepage__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link to="/login" className="homepage__button homepage__button--glow">
            Try EssAI
            <span className="homepage__button-icon">→</span>
          </Link>
          <Link to="/examples" className="homepage__button homepage__button--secondary">
            View examples
          </Link>
        </motion.div>

        <motion.div 
          className="homepage__features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <div className="homepage__feature">
            <span className="homepage__feature-icon">✨</span>
            <span>AI-Powered Writing</span>
          </div>
          <div className="homepage__feature">
            <span className="homepage__feature-icon">🚀</span>
            <span>Instant Improvements</span>
          </div>
          <div className="homepage__feature">
            <span className="homepage__feature-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
        </motion.div>
      </main>

      <footer className="homepage__footer">
        <motion.div 
          className="homepage__footer-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          © 2024 EssAI. All rights rejected.
        </motion.div>
      </footer>
    </div>
  );
}