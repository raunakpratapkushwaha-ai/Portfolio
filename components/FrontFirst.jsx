import { useEffect, useState, useRef } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import heroImage from '../src/assets/heroImage.png'
import './css/FrontFirst.css'

/* ========================= */
/* PDFs */
/* ========================= */
import numpyPDF from '../src/assets/numpy.pdf'
import genaiPDF from '../src/assets/genai.pdf'
import reactPDF from '../src/assets/react.pdf'
import deloittePDF from '../src/assets/deloitte.pdf'

/* ========================= */
/* PROJECT IMAGES */
/* ========================= */
import project1 from '../src/assets/project1.jpg'
import project2 from '../src/assets/project2.jpg'
import project3 from '../src/assets/project3.png'

function FrontFirst() {
  // 1. Single source of truth for the active section
  const [activeSection, setActiveSection] = useState('home')
  const [activePDF, setActivePDF] = useState(null)

  // 2. Create refs for each section to track their position on screen
  const homeRef = useRef(null)
  const educationRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)

  /* ========================= */
  /* INDUSTRY STANDARD SCROLL */
  /* ========================= */
  useEffect(() => {
    
    const frontFirst = document.querySelector('.frontFirst')
    
    const handleScroll = () => {
      // Determine scroll position based on mobile vs desktop
      const isMobile = window.innerWidth <= 992
      const scrollY = isMobile ? window.scrollY : (frontFirst ? frontFirst.scrollTop : 0)

      // Get exact vertical positions of the sections dynamically
      const eduTop = document.getElementById('education')?.offsetTop || 0
      const projTop = document.getElementById('projects')?.offsetTop || 0
      const contTop = document.getElementById('contact')?.offsetTop || 0

      // Trigger animations when the top of a section is halfway up the screen
      const triggerOffset = window.innerHeight * 0.6

      if (scrollY < eduTop - triggerOffset) {
        setActiveSection('home')
      } else if (scrollY < projTop - triggerOffset) {
        setActiveSection('education')
      } else if (scrollY < contTop - triggerOffset) {
        setActiveSection('projects')
      } else {
        setActiveSection('contact')
      }
    }

    const isMobile = window.innerWidth <= 992
    // Desktop only scroll tracking
    if (!isMobile && frontFirst) {
      frontFirst.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (!isMobile && frontFirst) {
        frontFirst.removeEventListener('scroll', handleScroll)
      }
    }
    
  }, [])

  /* ========================= */
  /* DERIVED VISIBILITY STATES */
  /* ========================= */
  // Translating the active section into the booleans your CSS expects

  const showEducation = activeSection === 'education' || activeSection === 'projects' || activeSection === 'contact'
  const showProjects = activeSection === 'projects' || activeSection === 'contact'
  const showContact = activeSection === 'contact'

  /* ========================= */
  /* CERTIFICATIONS DATA */
  /* ========================= */
  const certifications = [
    {
      title: 'NumPy Certification',
      provider: 'Simplilearn',
      description: 'Learned NumPy fundamentals, vectorization and numerical computing.',
      pdf: numpyPDF
    },
    {
      title: 'Generative AI',
      provider: 'Google Cloud',
      description: 'Explored LLMs, prompt engineering and Generative AI workflows.',
      pdf: genaiPDF
    },
    {
      title: 'React JS Certification',
      provider: 'Simplilearn',
      description: 'Built React applications using hooks, components and state management.',
      pdf: reactPDF
    },
    {
      title: 'Data Visualisation',
      provider: 'Deloitte',
      description: 'Learned dashboard design and storytelling with data.',
      pdf: deloittePDF
    }
  ]

  /* ========================= */
  /* PROJECTS DATA */
  /* ========================= */
  const projects = [
    {
      title: 'Portfolio Website',
      tech: 'React JS',
      description: 'Futuristic animated portfolio with cinematic effects and immersive UI.',
      image: project1,
      github: 'https://github.com/raunakpratapkushwaha-ai/Portfolio'
    },
    {
      title: 'Optical Encryption Model',
      tech: 'Pytorch•Autograd',
      description: 'A mordern encryption model that uses optical techniques to secure data transmission.',
      image: project2,
      github: 'https://github.com/raunakpratapkushwaha-ai'
    },
    {
      title: 'Expense Tracker App',
      tech: 'React•Matplotlib•Pandas',
      description: 'A full stack expense tracker with interactive visualizations to manage your finances effectively.',
      image: project3,
      github: 'https://the-expense-trackerr.web.app/'
    }
  ]

  return (
    <div className="frontFirst">

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}
      <div
        id="home"
        ref={homeRef}
        className={`heroContent ${showEducation ? 'heroHidden' : ''}`}
      >
        {
          window.innerWidth <= 992 && (
            <div className="mobileHeroImageWrapper">
              <img
                src={heroImage}
                alt="Hero"
                className="mobileHeroImage"
              />
            </div>
          )
        }
        
        <div className="frontFirstTop">
          <div className="drown">Hi, I'm</div>
          <div className="name gradient-text">Raunak</div>
        </div>
        <div className="role">AI Engineer</div>
        <div className="description">
          Building futuristic AI systems, intelligent applications and immersive digital experiences with modern technologies.
        </div>
      </div>

      {/* ========================= */}
      {/* EDUCATION */}
      {/* ========================= */}
      <div
        id="education"
        ref={educationRef}
        className={`educationWrapper ${showEducation ? 'educationVisible' : ''} ${showProjects ? 'sectionHidden' : ''}`}
      >
        <div className="educationHeading">Education</div>
        <div className="educationCard">
          <div className="educationTop">
            <div className="educationDegree">B.Tech in Computer Science</div>
            <div className="educationYear">2025 - 2029</div>
          </div>
          <div className="educationCollege">ABES Engineering College - Ghaziabad</div>
          <div className="educationDescription">
            Focused on AI Engineering, AI Integration, Building scalable AI solutions. Currently working on Ai integration in backend systems and exploring the latest advancements in AI technologies.
          </div>
        </div>

        <div className="educationSubHeading">Certifications</div>
        {certifications.map((cert, index) => (
          <div className="certificationCard" key={index}>
            <div className="certificationContent">
              <div className="certificationLeft">
                <div className="certificationTop">
                  <div className="certificationTitle">{cert.title}</div>
                  <div className="certificationProvider">{cert.provider}</div>
                </div>
                <div className="certificationDescription">{cert.description}</div>
              </div>
              <div
                className="pdfPreviewWrapper"
                onClick={() => setActivePDF(cert.pdf)}
              >
                <iframe src={cert.pdf} title={cert.title} className="pdfPreview" />
                <div className="pdfOverlay">
                  <FaExternalLinkAlt />
                  <span>View Certificate</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* PROJECTS */}
      {/* ========================= */}
      <div
        id="projects"
        ref={projectsRef}
        className={`projectsWrapper ${showProjects ? 'projectsVisible' : ''} ${showContact ? 'sectionHidden' : ''}`}
      >
        <div className="projectsHeading">Projects</div>
        {projects.map((project, index) => (
          <div className="projectCard" key={index}>
            <div className="projectContent">
              <div className="projectLeft">
                <div className="projectTop">
                  <div className="projectTitle">{project.title}</div>
                  <div className="projectTech">{project.tech}</div>
                </div>
                <div className="projectDescription">{project.description}</div>
              </div>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="projectThumbnailWrapper"
              >
                <img src={project.image} alt={project.title} className="projectThumbnail" />
                <div className="projectOverlay">
                  <FaExternalLinkAlt />
                  <span>View Project</span>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* CONTACT */}
      {/* ========================= */}
      <div
        id="contact"
        ref={contactRef}
        className={`contactWrapper ${showContact ? 'contactVisible' : ''}`}
      >
        <div className="contactHeading">Contact Me</div>
        <div className="contactCard">
          <div className="contactGlow"></div>
          <div className="contactTitle">Let's Build Something Amazing Together</div>
          <div className="contactDescription">
            Interested in AI Engineering, futuristic applications or collaborations? Send me a message directly.
          </div>
          <form
            className="contactForm"
            action="https://mail.google.com/mail/?view=cm&fs=1&to=connecttoraunak1@gmail.com"
            method="GET"
            target="_blank"
          >
            <input type="text" name="su" placeholder="Subject" className="contactInput" required />
            <textarea name="body" placeholder="Write your message here..." className="contactTextarea" required />
            <button type="submit" className="contactButton">Send Mail</button>
          </form>
        </div>
      </div>

      {/* ========================= */}
      {/* PDF MODAL */}
      {/* ========================= */}
      {activePDF && (
        <div className="pdfModal" onClick={() => setActivePDF(null)}>
          <div className="pdfModalContent" onClick={(e) => e.stopPropagation()}>
            <iframe src={activePDF} title="Certificate Viewer" className="pdfViewer" />
          </div>
        </div>
      )}

    </div>
  )
}

export default FrontFirst