
document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const header = document.querySelector("header")
  
    // Function to handle scroll
    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.remove("transparent")
        header.classList.add("scrolled")
      } else {
        header.classList.add("transparent")
        header.classList.remove("scrolled")
      }
    }
  
    // Initial call to set correct state
    handleScroll()
  
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)
  
    // Theme toggle functionality
    const themeToggle = document.getElementById("theme-toggle")
    const body = document.body
    const themeIcon = themeToggle.querySelector("i")
  
    // Check if there's a saved theme preference in localStorage
    const savedTheme = localStorage.getItem("theme")
  
    // Apply saved theme if it exists
    if (savedTheme) {
      body.className = savedTheme
      updateThemeIcon(savedTheme)
    }
  
    // Toggle theme when the button is clicked
    themeToggle.addEventListener("click", () => {
      // Check current theme
      if (body.classList.contains("dark-theme")) {
        // Switch to light theme
        body.classList.remove("dark-theme")
        body.classList.add("light-theme")
        localStorage.setItem("theme", "light-theme")
        themeIcon.className = "fas fa-moon"
      } else {
        // Switch to dark theme
        body.classList.remove("light-theme")
        body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark-theme")
        themeIcon.className = "fas fa-sun"
      }
    })
  
    // Function to update the theme icon based on current theme
    function updateThemeIcon(theme) {
      if (theme === "light-theme") {
        themeIcon.className = "fas fa-moon"
      } else {
        themeIcon.className = "fas fa-sun"
      }
    }
  
    // Dropdown menu functionality
    const dropdown = document.querySelector(".dropdown")
    dropdown.addEventListener("click", function () {
      this.classList.toggle("active")
    })
  
    // Back to top button functionality
    const backToTopButton = document.querySelector(".back-to-top")
  
    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })
  
    // Scroll to top when back to top button is clicked
    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  
    // Add animation to progress bars when they come into view
    const progressBars = document.querySelectorAll(".progress-bar")
    const animateProgressBars = () => {
      progressBars.forEach((bar) => {
        const rect = bar.getBoundingClientRect()
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0
  
        if (isVisible) {
          const width = bar.style.width
          bar.style.width = "0"
          setTimeout(() => {
            bar.style.width = width
          }, 100)
        }
      })
    }
  
    // Run once on page load
    animateProgressBars()
  
    // Add scroll event for animation
    window.addEventListener("scroll", animateProgressBars)
  })
  
  // Typing effect - separate from DOM loaded event
  const typingText = document.getElementById("typing-text")
  const phrases = ["Freelancer", "Web Designer", "Web Developer", "Photographer"]
  let phraseIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typingSpeed = 100
  
  function typeEffect() {
    const currentPhrase = phrases[phraseIndex]
  
    if (isDeleting) {
      // Deleting text
      typingText.textContent = currentPhrase.substring(0, charIndex - 1)
      charIndex--
      typingSpeed = 50 // Faster when deleting
    } else {
      // Typing text
      typingText.textContent = currentPhrase.substring(0, charIndex + 1)
      charIndex++
      typingSpeed = 100 // Normal speed when typing
    }
  
    // If word is complete, start deleting after a pause
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true
      typingSpeed = 1000 // Pause at the end of the word
    }
    // If deletion is complete, move to next word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      typingSpeed = 500 // Pause before starting new word
    }
  
    setTimeout(typeEffect, typingSpeed)
  }
  
  // Start the typing effect
  setTimeout(typeEffect, 1000)
  