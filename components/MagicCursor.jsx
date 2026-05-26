import { useEffect, useRef } from 'react'
import './MagicCursor.css'

function MagicCursor() {

  const dotRef = useRef(null)

  const trailsRef = useRef([])

  useEffect(() => {

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    const trailPositions = []

    const trailCount = 20

    for(let i = 0; i < trailCount; i++){

      trailPositions.push({
        x: mouse.x,
        y: mouse.y
      })
    }

    const moveMouse = (e) => {

      mouse.x = e.clientX
      mouse.y = e.clientY

      createSnowParticle(
        e.clientX,
        e.clientY
      )
    }

    window.addEventListener(
      'mousemove',
      moveMouse
    )

    const animate = () => {

      trailPositions[0].x +=
        (mouse.x - trailPositions[0].x) * 0.35

      trailPositions[0].y +=
        (mouse.y - trailPositions[0].y) * 0.35

      for(let i = 1; i < trailPositions.length; i++){

        trailPositions[i].x +=
          (trailPositions[i - 1].x - trailPositions[i].x) * 0.28

        trailPositions[i].y +=
          (trailPositions[i - 1].y - trailPositions[i].y) * 0.28
      }

      dotRef.current.style.transform =
        `translate3d(${mouse.x}px, ${mouse.y}px, 0)`

      trailsRef.current.forEach((trail, index) => {

        const position = trailPositions[index]

        if(!trail || !position) return

        trail.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`

        trail.style.opacity =
          1 - index / trailPositions.length

        trail.style.scale =
          1 - index * 0.045
      })

      requestAnimationFrame(animate)
    }

    animate()

    function createSnowParticle(x, y){

      const particle =
        document.createElement('span')

      particle.className =
        'snow-particle'

      const size =
        Math.random() * 3 + 1

      const offsetX =
        (Math.random() - 0.5) * 60

      const duration =
        Math.random() * 1000 + 1000

      particle.style.width =
        `${size}px`

      particle.style.height =
        `${size}px`

      particle.style.left =
        `${x}px`

      particle.style.top =
        `${y}px`

      particle.style.setProperty(
        '--offsetX',
        `${offsetX}px`
      )

      particle.style.animationDuration =
        `${duration}ms`

      document.body.appendChild(
        particle
      )

      setTimeout(() => {

        particle.remove()

      }, duration)
    }

    return () => {

      window.removeEventListener(
        'mousemove',
        moveMouse
      )
    }

  }, [])

  return (

    <>

      {/* MAIN DOT */}

      <div
        ref={dotRef}
        className="magic-dot"
      ></div>

      {/* TRAILS */}

      {

        Array.from({ length: 20 }).map((_, index) => (

          <div

            key={index}

            ref={(el) =>
              trailsRef.current[index] = el
            }

            className="magic-trail"
          ></div>
        ))
      }

    </>
  )
}

export default MagicCursor