import { Component } from 'react'
import '../src/App.css'
import download from '../src/assets/download.svg'
import favicon from '../src/assets/favicon.png'

/* ========================= */
/* IMPORT YOUR RESUME HERE */
/* ========================= */
import resumePDF from '../src/assets/resume.pdf'

export class Navbar extends Component {

  /* ========================= */
  /* PRECISION SCROLL FUNCTION */
  /* ========================= */

  scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (!section) return

    const frontFirstContainer = document.querySelector('.frontFirst')
    const isMobile = window.innerWidth <= 992

    if (id === 'home') {
      if (!isMobile && frontFirstContainer) {
        frontFirstContainer.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (!isMobile && frontFirstContainer) {
      frontFirstContainer.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      })
    } else {
      const yOffset = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: yOffset - 80, 
        behavior: 'smooth'
      })
    }
  }

  /* ========================= */
  /* DOWNLOAD FUNCTION */
  /* ========================= */

  handleDownload = () => {
    // 1. Create an invisible standard HTML5 anchor element
    const link = document.createElement('a')
    
    // 2. Attach the imported PDF to the href
    link.href = resumePDF
    
    // 3. Set the exact filename you want the user to receive
    link.download = 'Raunak_Resume.pdf' 
    
    // 4. Append it to the document, click it programmatically, then destroy it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  render() {
    return (
      <div className='navBar'>

        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}
        <div
          className='logo'
          onClick={() => this.scrollToSection('home')}
          style={{ cursor: 'pointer' }}
        >
          <img src={favicon} alt="favicon" />
          Raunak<span className='white'>.</span>
        </div>

        {/* ========================= */}
        {/* LINKS */}
        {/* ========================= */}
        <div className='linksDiv'>
          <ul>
            <li onClick={() => this.scrollToSection('home')}>
              Home
            </li>
            <li onClick={() => this.scrollToSection('education')}>
              Education
            </li>
            <li onClick={() => this.scrollToSection('projects')}>
              Projects
            </li>
            <li onClick={() => this.scrollToSection('contact')}>
              Contact
            </li>
          </ul>

          {/* ========================= */}
          {/* BUTTON */}
          {/* ========================= */}
          
          <button 
            className='resumeButton'
            onClick={this.handleDownload}
          >
            <img src={download} alt="download" />
            Resume
          </button>

        </div>

      </div>
    )
  }
}

export default Navbar