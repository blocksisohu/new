import React from 'react';
import { motion } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate
import '../App.css'; // تأكد من استيراد ملف الـ CSS

function AboutMePage({ neonColor, fontFamily }) {
  const navigate = useNavigate(); // تهيئة useNavigate

  const handleGoBack = () => {
    navigate('/'); // العودة إلى المسار / (الصفحة الرئيسية)
  };

  return (
    <motion.div
      className="about-me-full-page"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      style={{'--neon-color': neonColor, '--main-font': fontFamily}}
    >
      {/* تأثير الجزيئات كخلفية للصفحة */}
      <ParticlesBg type="cobweb" bg={true} color={neonColor} num={100} /> {/* نوع شبكي بلون النيون */}

      <div className="about-me-content-wrapper"> {/* حاوية للمحتوى لسهولة التمرير والتوسيط */}
        <h2 className="about-me-title">My Personal Information</h2>
        <div className="about-me-content-scrollable"> {/* منطقة المحتوى القابلة للتمرير */}
          {/* معلومات الاتصال الرئيسية */}
          <p className="contact-info-header">
            <span className="icon">📍</span> Lebanon, Tripoli
            <span className="icon">📞</span> +96176094251
            <span className="icon">📧</span> <a href="mailto:yehyahussayner@gmail.com" className="about-me-link-item">yehyahussayner@gmail.com</a>
          </p>

          <h3>Objective:</h3>
          <p>
            Motivated and detail-oriented **Front-End Web Developer** seeking a challenging position where I can apply my skills in **HTML, CSS, JavaScript, and modern frameworks** to create responsive, user-friendly websites and applications. Eager to contribute to a dynamic team, continuously learn new technologies, and deliver engaging digital experiences that align with business goals.
          </p>
          
          <h3>Experiences:</h3>
          <ul className="experience-list">
            <li>
              <h4>Transaction Agent / Administrative Assistant — Mobile House</h4>
              <p className="job-date">November 2024 – till present</p>
              <ul>
                <li>Handled daily sales operations, processed cash and electronic payments, and monitored financial transfers with accuracy.</li>
                <li>Recorded invoices and expenses, assisted in preparing monthly financial reports, and maintained clear account statements.</li>
                <li>Used management and accounting software such as Excel and POS systems to track sales and inventory.</li>
                <li>Answered customer calls, processed inquiries and orders, and directed calls to appropriate departments.</li>
              </ul>
            </li>
            <li>
              <h4>Junior Front-End Developer — Commatech, Tripoli</h4>
              <p className="job-date">March 2023 – till present</p>
              <ul>
                <li>Develop and design webpage.</li>
                <li>Generate the needed button so can activate the Webpage.</li>
                <li>Design the webpage with the appropriate CSS.</li>
              </ul>
            </li>
            <li>
              <h4>Maintainer Technical — Tripoli, Lebanon</h4>
              <p className="job-date">October 2021 – July 2022</p>
              <ul>
                <li>Maintained and repaired technical systems and equipment to ensure continuous operation.</li>
                <li>Conducted routine inspections and preventive maintenance to minimize downtime.</li>
                <li>Assisted in troubleshooting hardware and electrical issues to maintain performance and safety standards.</li>
                <li>Collaborated with team members to support efficient workflow and timely project completion.</li>
              </ul>
            </li>
            <li>
              <h4>Controller — LibanPark, Dbayeh, Lebanon</h4>
              <p className="job-date">July 2021– September 2021</p>
              <ul>
                <li>Monitored vehicle entry and exit to ensure proper traffic flow and parking regulations.</li>
                <li>Reported and resolved issues related to parking system operations and customer concerns.</li>
                <li>Maintained accurate logs and provided reports to supervisors on daily operations.</li>
                <li>Utilized LibanPark’s internal software for tracking and ticketing vehicles.</li>
              </ul>
            </li>
          </ul>

          <h3>Education:</h3>
          <p>
            **Baccalaureate Technical Under Graduated**<br/>
            Information Technology, American Universal College (AUC) Tripoli
          </p>

          <h3>Languages:</h3>
          <ul className="language-list">
            <li><span className="icon">🗣️</span> Arabic: Native Language</li>
            <li><span className="icon">🇬🇧</span> English: Good</li>
            <li><span className="icon">🇫🇷</span> French: Good</li>
          </ul>

          <h3>Training:</h3>
          <ul className="training-list">
            <li><span className="icon">🎓</span> Front-end Development, 2022 – 2023 (CommaTech, Tripoli)</li>
          </ul>

          <h3>IT Skills:</h3>
          <ul className="skill-list">
            <li><span className="icon">💻</span> JavaScript</li>
            <li><span className="icon">🌐</span> WordPress</li>
            <li><span className="icon">🎨</span> CSS3</li>
            <li><span className="icon">📄</span> HTML5</li>
            <li><span className="icon">📊</span> Microsoft Office (Word, Excel, PowerPoint, Access, etc.)</li>
          </ul>

          <h3>My CV & Work Certificates:</h3>
          <p>
            You can download my full CV and Work Certificate here: <a href="/Yahya_Tanbouzeh_CV_and_Work_Certificate.pdf" target="_blank" rel="noopener noreferrer" className="about-me-link-item"><span className="icon">📂</span> Download CV & Work Certificate (PDF)</a>
          </p>
          {/* تم إزالة قسم "My Certifications" هنا */}
        </div>
        {/* زر العودة للصفحة الرئيسية */}
        <button className="back-to-home-button" onClick={handleGoBack}>Back to Home</button>
      </div>
    </motion.div>
  );
}

export default AboutMePage;