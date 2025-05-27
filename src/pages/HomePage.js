import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css'; // تأكد من استيراد ملف الـ CSS

function HomePage({
  websiteActive,
  setWebsiteActive,
  passwordProtected,
  setSparksEnabled, // دالة للتحكم بالشرارات من App.js
  sparksEnabled, // قيمة حالة الشرارات من App.js
  sparks, // الشرارات نفسها
  removeSpark, // دالة إزالة الشرارات
  mousePos, // موضع الماوس
  setMousePos // لتحديث موضع الماوس
}) {
  const [query, setQuery] = useState('');
  
  // إدارة حركة الماوس للبارالاكس (تبقى في HomePage لأنها مرتبطة بعرض الفيديو)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY }); // تحديث موضع الماوس في App.js
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePos]); // أضف setMousePos هنا

  // حسابات البارالاكس بناءً على mousePos القادمة من App.js
  const parallaxX = (mousePos.x - window.innerWidth / 2) * 0.01;
  const parallaxY = (mousePos.y - window.innerHeight / 2) * 0.01;

  const handleSearch = () => {
    if (query.trim() !== '') {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleSearchUrl, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // دالة لتغيير حالة الشرارات من الإعدادات (تُمرر لـ App.js)
  // هذه الدالة الآن فقط تمرر الحدث إلى setSparksEnabled القادمة من App.js
  const handleToggleSparks = () => {
    setSparksEnabled(prev => !prev);
  };

  return (
    <> {/* Fragment لأن هذا المكون هو جزء من Route */}
      <motion.div
        className="background-video"
        animate={{ x: parallaxX, y: parallaxY }}
        transition={{ type: 'spring', stiffness: 20 }}
        style={{ opacity: websiteActive ? 1 : 0.2 }}
      >
        <video autoPlay loop muted playsInline>
          <source src="/jett-bg.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <AnimatePresence>
        {websiteActive && sparksEnabled && sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="spark-effect"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => removeSpark(spark.id)}
            style={{
              left: spark.x,
              top: spark.y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      <div className="content" style={{ opacity: websiteActive ? 1 : 0.6 }}>
        <h1 className="title">Welcome</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="just for pro player XD"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!websiteActive}
          />
          <button onClick={handleSearch} disabled={!websiteActive}>🔍</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;