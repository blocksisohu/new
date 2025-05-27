import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import HomePage from './pages/HomePage';
import AboutMePage from './pages/AboutMePage';

// مكون بسيط لرابط الشريط العلوي
const TopNavLink = ({ icon, text, to, link, onClick, className }) => {
  if (to) { // إذا كان الرابط يؤدي إلى صفحة داخلية (باستخدام React Router Link)
    return (
      <Link to={to} className={`top-nav-item ${className || ''}`} onClick={onClick}>
        {icon && <span className="icon">{icon}</span>}
        {text && <span className="text">{text}</span>}
      </Link>
    );
  } else { // إذا كان الرابط خارجي (باستخدام a tag عادي) أو لتشغيل دالة بدون انتقال
    return (
      <a href={link} target={link && link.startsWith('http') ? "_blank" : "_self"} rel={link && link.startsWith('http') ? "noopener noreferrer" : undefined} className={`top-nav-item ${className || ''}`} onClick={onClick}>
        {icon && <span className="icon">{icon}</span>}
        {text && <span className="text">{text}</span>}
      </a>
    );
  }
};


function App() {
  // -----------------------------------------------------
  // حالات عامة للتطبيق (يجب أن تكون موجودة هنا)
  // -----------------------------------------------------
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // موقع الماوس للبارالاكس والشرارات
  const [sparks, setSparks] = useState([]); // الشرارات نفسها
  const [sparksEnabled, setSparksEnabled] = useState(true); // تفعيل/تعطيل الشرارات (من الإعدادات)
  const [query, setQuery] = useState(''); // حقل البحث في الصفحة الرئيسية

  const passwordInputRef = useRef(null); // Ref لحقل كلمة المرور
  const fileInputRef = useRef(null); // Ref لحقل رفع الصورة

  // حالات التحكم بالقوائم المنبثقة
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // حالات الإعدادات
  const [websiteActive, setWebsiteActive] = useState(true); // حالة تفعيل/تعطيل الموقع
  const [passwordProtected, setPasswordProtected] = useState(false); // حماية الموقع بكلمة مرور
  const [sitePassword, setSitePassword] = useState(''); // كلمة المرور المدخلة في الـ prompt
  const [promptMessage, setPromptMessage] = useState(''); // رسالة مربع كلمة المرور
  const [expectedPassword, setExpectedPassword] = useState(''); // كلمة المرور الصحيحة
  const [neonColor, setNeonColor] = useState('#00ffff'); // لون التوهج النيون
  const [fontFamily, setFontFamily] = useState('Orbitron, sans-serif'); // الخط المختار

  // حالات نظام الحسابات
  const [user, setUser] = useState(null); // بيانات المستخدم المسجل دخوله
  const [username, setUsername] = useState(''); // اسم المستخدم في واجهة تسجيل الدخول
  const [authMessage, setAuthMessage] = useState(''); // رسالة تسجيل الدخول/الخروج
  const [profileImage, setProfileImage] = useState(null); // صورة البروفايل

  // -----------------------------------------------------
  // useEffects لإدارة الأحداث وتحميل البيانات عند التحميل
  // -----------------------------------------------------
  useEffect(() => {
    // تحميل البيانات من Local Storage
    const storedUser = localStorage.getItem('currentUser');
    const storedImage = localStorage.getItem('profileImage');
    const storedFont = localStorage.getItem('selectedFontFamily');
    const storedNeonColor = localStorage.getItem('selectedNeonColor');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedImage) setProfileImage(storedImage);
    if (storedFont) setFontFamily(storedFont);
    if (storedNeonColor) setNeonColor(storedNeonColor);

    // إدارة حركة الماوس لتأثير البارالاكس والشرارات
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      // الشرارات يتم إضافتها هنا في App.js لأن حالتها موجودة هنا
      if (sparksEnabled && websiteActive) {
        const newSpark = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };
        setSparks((prevSparks) => {
          const updatedSparks = [...prevSparks, newSpark];
          return updatedSparks.slice(Math.max(updatedSparks.length - 20, 0)); // الاحتفاظ بحد أقصى من الشرارات
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // إغلاق جميع القوائم المنبثقة عند النقر خارجها
    const handleClickOutside = (event) => {
      const isSettingsClick = event.target.closest('.settings-menu') || event.target.closest('.top-nav-item.settings');
      const isStatusClick = event.target.closest('.status-menu') || event.target.closest('.top-nav-item.status');
      const isAuthClick = event.target.closest('.auth-menu') || event.target.closest('.top-nav-item.profile');

      if (showSettingsMenu && !isSettingsClick) setShowSettingsMenu(false);
      if (showStatusMenu && !isStatusClick) setShowStatusMenu(false);
      if (showAuthMenu && !isAuthClick) { setShowAuthMenu(false); setAuthMessage(''); }
    };
    window.addEventListener('mousedown', handleClickOutside);

    // التركيز على حقل كلمة المرور عند ظهور الـ prompt
    if (showPasswordPrompt && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }

    // تنظيف الـ event listeners عند إزالة المكون
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu, showStatusMenu, showPasswordPrompt, showAuthMenu, sparksEnabled, websiteActive]); // أضف sparksEnabled و websiteActive هنا للـ useEffect

  // دالة لإزالة الشرارات (يتم تمريرها إلى HomePage)
  const removeSpark = (id) => {
    setSparks((prevSparks) => prevSparks.filter((spark) => spark.id !== id));
  };

  // -----------------------------------------------------
  // دوال تبديل ظهور القوائم
  // -----------------------------------------------------
  const closeAllMenus = (menuToExclude = null) => {
    if (menuToExclude !== 'settings') setShowSettingsMenu(false);
    if (menuToExclude !== 'status') setShowStatusMenu(false);
    if (menuToExclude !== 'auth') {
      setShowAuthMenu(false);
      setAuthMessage('');
    }
  };

  const toggleSettingsMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); // منع إغلاق القائمة فوراً
    closeAllMenus('settings'); // أغلق كل القوائم عدا Settings
    setShowSettingsMenu(prev => !prev); // ثم افتح هذه القائمة
  };

  const toggleStatusMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllMenus('status'); // أغلق كل القوائم عدا Status
    setShowStatusMenu(prev => !prev); // ثم افتح هذه القائمة
  };

  const toggleAuthMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllMenus('auth'); // أغلق كل القوائم عدا Auth
    setShowAuthMenu(prev => !prev);
    setUsername('');
  };

  // دالة الانتقال لصفحة AboutMe (بما أنها الآن React Router Link، لا تحتاج منطق Show)
  const navigateToAboutMe = (e) => {
    closeAllMenus(); // أغلق كل القوائم عند الانتقال
  };

  // -----------------------------------------------------
  // دوال التحكم بكلمة المرور وحالة الموقع (Online/Offline)
  // -----------------------------------------------------
  const handlePasswordSubmit = () => {
    if (promptMessage.includes('Enter new password')) { // تعيين كلمة مرور جديدة
      if (sitePassword.length > 0) {
        setExpectedPassword(sitePassword);
        setPasswordProtected(true);
        setPromptMessage('Password set! Now confirm to change status.');
      } else {
        setPromptMessage('Password cannot be empty. Please enter a new password.');
      }
    } else { // التحقق من كلمة المرور لتغيير الحالة
      if (sitePassword === expectedPassword) {
        setWebsiteActive(prev => !prev); // تبديل حالة الموقع
        setPasswordProtected(true);
        setShowPasswordPrompt(false);
        setSitePassword('');
        setPromptMessage('');
      } else {
        setPromptMessage('Incorrect password. Try again!');
      }
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const promptForPassword = (actionMessage, currentExpectedPassword = '') => {
    setPromptMessage(actionMessage);
    setExpectedPassword(currentExpectedPassword);
    setSitePassword('');
    setShowPasswordPrompt(true);
  };

  const handleWebsiteStatusChange = (status) => {
    closeAllMenus(); // أغلق جميع القوائم الأخرى عند بدء عملية تغيير الحالة
    setShowStatusMenu(false); // أغلق قائمة الـ Status بعد بدء العملية

    if (!passwordProtected) { // إذا لم يكن الموقع محمي بكلمة مرور بعد
      promptForPassword('Enter new password to protect the website:');
      return;
    }

    if (status === websiteActive) { // المستخدم ضغط على نفس حالة الموقع الحالية
        setPromptMessage(`Website is already ${websiteActive ? 'Online' : 'Offline'}. Enter password to proceed.`);
        promptForPassword('Enter password to change status:', expectedPassword);
        return;
    }

    // المستخدم يريد تغيير حالة الموقع (online to offline / offline to online)
    promptForPassword(`Enter password to set website ${status ? 'Online' : 'Offline'}:`, expectedPassword);
  };

  // -----------------------------------------------------
  // دوال التحكم بالإعدادات (اللون والشرارات والخط)
  // -----------------------------------------------------
  const changeNeonColor = (color) => {
    setNeonColor(color);
    localStorage.setItem('selectedNeonColor', color); // حفظ اللون في Local Storage
  };

  const toggleSparksEffect = () => { // هذه الدالة موجودة هنا للتحكم في sparksEnabled
    setSparksEnabled(prev => !prev);
  };

  const changeFont = (font) => {
    setFontFamily(font);
    localStorage.setItem('selectedFontFamily', font); // حفظ الخط في Local Storage
  };

  // -----------------------------------------------------
  // دوال نظام الحسابات (تسجيل الدخول/الخروج ورفع الصورة)
  // -----------------------------------------------------
  const handleLogin = () => {
    if (username.trim() === '') {
      setAuthMessage('Username cannot be empty.');
      return;
    }
    const newUser = { name: username.trim() };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser)); // حفظ المستخدم
    setShowAuthMenu(false);
    setAuthMessage('');
    setUsername('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('profileImage'); // إزالة الصورة عند تسجيل الخروج
    setProfileImage(null);
    setShowAuthMenu(false);
    setAuthMessage('');
    setUsername('');
  };

  const handleAuthKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (user) {
        handleLogout();
      } else {
        handleLogin();
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // -----------------------------------------------------
  // JSX (هيكل التطبيق الرئيسي والراوتر)
  // -----------------------------------------------------
  return (
    <Router>
      {/* تم إزالة منطقة استشعار الماوس للهيدر (header-sensor-area) هنا */}

      <div className="app-container" style={{'--neon-color': neonColor, '--main-font': fontFamily}}>
        {/* الشريط العلوي - موجود في كل الصفحات (ثابت الآن) */}
        <div className="top-header"> {/* تم إزالة كلاس 'visible' ومنطقه التفعيل */}
          <div className="top-header-left">
            <TopNavLink
              text={`Status: ${websiteActive ? 'Online' : 'Offline'}`}
              icon={websiteActive ? "🟢" : "🔴"}
              link="#"
              onClick={toggleStatusMenu}
              className="status"
            />
            <AnimatePresence>
              {showStatusMenu && (
                <motion.div
                  className="dropdown-menu status-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="menu-item" onClick={() => handleWebsiteStatusChange(true)}>
                    <span className="icon">🟢</span> Enable Website
                  </div>
                  <div className="menu-item" onClick={() => handleWebsiteStatusChange(false)}>
                    <span className="icon">🔴</span> Disable Website
                  </div>
                  {passwordProtected && (
                      <div className="menu-item" onClick={() => {
                          setExpectedPassword('');
                          setPasswordProtected(false);
                          closeAllMenus();
                      }}>
                          <span className="icon">🔒</span> Disable Password Protection
                      </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="top-header-center">
            {/* زر العودة للصفحة الرئيسية */}
            <Link to="/" className="logo-text" onClick={closeAllMenus}>CYBER-HUB</Link>
          </div>
          <div className="top-header-right">
            <TopNavLink icon="📧" text="Inbox" link="https://mail.google.com" />
            {/* زر البروفايل */}
            <TopNavLink
              icon="👤"
              text={user ? user.name : "Profile"}
              link="#"
              onClick={toggleAuthMenu}
              className="profile"
            />
            {/* قائمة تسجيل الدخول/الخروج */}
            <AnimatePresence>
              {showAuthMenu && (
                <motion.div
                  className="dropdown-menu auth-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {user ? ( // إذا كان المستخدم مسجلاً للدخول
                    <>
                      <div className="profile-image-upload-section">
                          {profileImage ? (
                              <img src={profileImage} alt="Profile" className="profile-image-preview" onClick={triggerFileInput} />
                          ) : (
                              <div className="profile-image-placeholder" onClick={triggerFileInput}>
                                  <span className="icon">📸</span> Upload Image
                              </div>
                          )}
                          {/* حقل إدخال الملف المخفي */}
                          <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                          />
                      </div>
                      <div className="menu-item welcome-user">
                        <span className="icon">👋</span> Welcome, {user.name}!
                      </div>
                      <div className="menu-item" onClick={handleLogout}>
                        <span className="icon">➡️</span> Logout
                      </div>
                    </>
                  ) : ( // إذا لم يكن المستخدم مسجلاً للدخول
                    <>
                      <p className="auth-message">{authMessage}</p>
                      <div className="menu-item">
                        <span className="icon">🔑</span> Login
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyDown={handleAuthKeyPress}
                          className="auth-input"
                        />
                      </div>
                      <button className="auth-button" onClick={handleLogin}>Sign In</button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* زر الإعدادات */}
            <TopNavLink
              icon="⚙️"
              text="Settings"
              link="#"
              onClick={toggleSettingsMenu}
              className="settings"
            />
            <AnimatePresence>
              {showSettingsMenu && (
                <motion.div
                  className="dropdown-menu settings-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="menu-item submenu-title">
                      <span className="icon">🎨</span> Neon Color:
                  </div>
                  <div className="color-options">
                      <div className="color-box blue-neon" onClick={() => changeNeonColor('#00ffff')}></div>
                      <div className="color-box green-neon" onClick={() => changeNeonColor('#00ff00')}></div>
                      <div className="color-box pink-neon" onClick={() => changeNeonColor('#ff00ff')}></div>
                      <div className="color-box yellow-neon" onClick={() => changeNeonColor('#ffff00')}></div>
                  </div>

                  <div className="menu-item" onClick={toggleSparksEffect}>
                    <span className="icon">✨</span> Sparks: {sparksEnabled ? 'On' : 'Off'}
                  </div>

                  <div className="menu-item submenu-title">
                      <span className="icon">✒️</span> Font Style:
                  </div>
                  <div className="font-options">
                      <div className="menu-item font-option" style={{ fontFamily: 'Orbitron, sans-serif' }} onClick={() => changeFont('Orbitron, sans-serif')}>
                          Orbitron
                      </div>
                      <div className="menu-item font-option" style={{ fontFamily: 'monospace' }} onClick={() => changeFont('monospace')}>
                          Monospace
                      </div>
                      <div className="menu-item font-option" style={{ fontFamily: 'Arial, sans-serif' }} onClick={() => changeFont('Arial, sans-serif')}>
                          Arial
                      </div>
                  </div>

                  <div className="menu-item">
                    <span className="icon">⚙️</span> More Options (Soon)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* زر "عني" / "About Me" - الآن سينتقل لصفحة جديدة */}
            <TopNavLink
              icon="ℹ️"
              text="About Me"
              to="/about"
              className="about-me-link"
              onClick={navigateToAboutMe}
            />
          </div>
        </div>

        {/* مربع إدخال كلمة المرور المنبثق (يظهر فوق كل الصفحات) */}
        <AnimatePresence>
          {showPasswordPrompt && (
            <motion.div
              className="password-prompt"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <p>{promptMessage}</p>
              <input
                ref={passwordInputRef}
                type="password"
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
                onKeyDown={handlePasswordKeyPress}
                placeholder="Enter password"
              />
              <button onClick={handlePasswordSubmit}>Confirm</button>
              <button className="cancel-button" onClick={() => setShowPasswordPrompt(false)}>Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تعريف المسارات (Routes) للصفحات */}
        <Routes>
          <Route path="/" element={
            <HomePage
              websiteActive={websiteActive}
              setWebsiteActive={setWebsiteActive}
              passwordProtected={passwordProtected}
              setSparksEnabled={setSparksEnabled}
              sparksEnabled={sparksEnabled}
              sparks={sparks}
              removeSpark={removeSpark}
              mousePos={mousePos}
              setMousePos={setMousePos}
            />
          } />
          <Route path="/about" element={<AboutMePage neonColor={neonColor} fontFamily={fontFamily} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;