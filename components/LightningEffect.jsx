import { useEffect, useState } from 'react'
import './LightningEffect.css'

const randomBetween = (min, max) => Math.random() * (max - min) + min

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const toPath = (points) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')

const jitterPath = (points, amount, width, height) =>
  toPath(
    points.map((point, index) => {
      if (index === 0 || index === points.length - 1) {
        return point
      }

      return {
        x: clamp(point.x + randomBetween(-amount, amount), 0, width),
        y: clamp(point.y + randomBetween(-amount, amount), 0, height),
      }
    })
  )

const createCloudToGround = (width, height) => {
  const points = []
  const segmentCount = Math.floor(randomBetween(20, 36))
  const startY = randomBetween(-height * 0.08, height * 0.08)
  const endY = randomBetween(height * 0.58, height * 1.05)
  let x = randomBetween(width * 0.1, width * 0.9)
  let drift = randomBetween(-width * 0.014, width * 0.014)

  for (let index = 0; index <= segmentCount; index += 1) {
    const progress = index / segmentCount
    const y = clamp(
      startY + (endY - startY) * progress + randomBetween(-height * 0.018, height * 0.018),
      -height * 0.1,
      height * 1.08
    )

    if (index > 0) {
      const jag = randomBetween(-width * 0.045, width * 0.045)
      const naturalSwerve = Math.sin(progress * Math.PI * randomBetween(1.2, 3.4)) * width * 0.014

      drift += randomBetween(-width * 0.008, width * 0.008)
      x = clamp(x + jag + drift + naturalSwerve, width * 0.04, width * 0.96)
    }

    points.push({ x, y })

    if (index % 5 === 0) {
      drift *= randomBetween(0.62, 0.9)
    }
  }

  return points
}

const createSkyCrawler = (width, height) => {
  const points = []
  const segmentCount = Math.floor(randomBetween(18, 32))
  const direction = Math.random() > 0.5 ? 1 : -1
  let x = direction > 0 ? randomBetween(-width * 0.08, width * 0.18) : randomBetween(width * 0.82, width * 1.08)
  let y = randomBetween(height * 0.05, height * 0.45)
  const reach = randomBetween(width * 0.48, width * 0.96)

  for (let index = 0; index <= segmentCount; index += 1) {
    const progress = index / segmentCount

    if (index > 0) {
      x += direction * (reach / segmentCount) + randomBetween(-width * 0.03, width * 0.03)
      y += randomBetween(-height * 0.035, height * 0.035)
    }

    points.push({
      x: clamp(x, -width * 0.1, width * 1.1),
      y: clamp(y + Math.sin(progress * Math.PI * 2) * height * 0.025, height * 0.02, height * 0.72),
    })
  }

  return points
}

const createBranch = (startPoint, width, height, sourceType) => {
  const points = [startPoint]
  const direction = Math.random() > 0.5 ? 1 : -1
  const segmentCount = Math.floor(randomBetween(3, 8))
  let x = startPoint.x
  let y = startPoint.y
  let energy = randomBetween(0.75, 1.35)

  for (let index = 0; index < segmentCount; index += 1) {
    const sidePull = direction * randomBetween(width * 0.018, width * 0.07) * energy
    const verticalPull =
      sourceType === 'crawler'
        ? randomBetween(-height * 0.025, height * 0.045)
        : randomBetween(height * 0.012, height * 0.07)

    x = clamp(x + sidePull + randomBetween(-width * 0.018, width * 0.018), -width * 0.08, width * 1.08)
    y = clamp(y + verticalPull, -height * 0.06, height * 1.08)
    points.push({ x, y })
    energy *= randomBetween(0.72, 0.9)
  }

  return {
    id: `${startPoint.x.toFixed(1)}-${startPoint.y.toFixed(1)}-${Math.random().toString(36).slice(2)}`,
    path: toPath(points),
    glowPath: jitterPath(points, randomBetween(1.2, 3.4), width, height),
    width: randomBetween(0.7, 2.2),
    opacity: randomBetween(0.26, 0.78),
  }
}

const createStrike = (id, width, height) => {
  const type = Math.random() > 0.72 ? 'crawler' : 'ground'
  const points = type === 'crawler' ? createSkyCrawler(width, height) : createCloudToGround(width, height)
  const branchCount = Math.floor(randomBetween(type === 'crawler' ? 5 : 7, type === 'crawler' ? 12 : 15))
  const branches = Array.from({ length: branchCount }, () => {
    const pointIndex = Math.floor(randomBetween(2, points.length - 3))
    return createBranch(points[pointIndex], width, height, type)
  })
  const start = points[0]
  const end = points[points.length - 1]
  const duration = randomBetween(0.42, 0.88)

  return {
    id,
    type,
    mainPath: toPath(points),
    ghostPath: jitterPath(points, randomBetween(2.4, 5.8), width, height),
    branches,
    start,
    end,
    duration,
    intensity: randomBetween(0.78, 1.35),
    cloudRadius: randomBetween(width * 0.12, width * 0.28),
  }
}

const createSheetFlash = (id, width) => ({
  id,
  x: `${randomBetween(8, 92)}%`,
  y: `${randomBetween(4, 48)}%`,
  size: `${randomBetween(Math.min(width, 520), Math.min(width * 1.15, 980))}px`,
  duration: `${randomBetween(0.5, 0.96)}s`,
  opacity: randomBetween(0.28, 0.82),
})

function LightningEffect() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [strikes, setStrikes] = useState([])
  const [flashes, setFlashes] = useState([])

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (!viewport.width || !viewport.height) {
      return undefined
    }

    let timeoutId
    let strikeId = 0
    const cleanupTimeouts = []

    const stormPulse = () => {
      const strikeCount = Math.random() > 0.72 ? 2 : 1
      const flashCount = Math.random() > 0.38 ? 1 : 2

      const nextStrikes = Array.from({ length: strikeCount }, () => {
        strikeId += 1
        return createStrike(`strike-${Date.now()}-${strikeId}`, viewport.width, viewport.height)
      })

      const nextFlashes = Array.from({ length: flashCount }, () => {
        strikeId += 1
        return createSheetFlash(`flash-${Date.now()}-${strikeId}`, viewport.width)
      })

      const strikeIds = nextStrikes.map((strike) => strike.id)
      const flashIds = nextFlashes.map((flash) => flash.id)

      setStrikes((currentStrikes) => [...currentStrikes.slice(-5), ...nextStrikes])
      setFlashes((currentFlashes) => [...currentFlashes.slice(-4), ...nextFlashes])

      cleanupTimeouts.push(
        window.setTimeout(() => {
          setStrikes((currentStrikes) =>
            currentStrikes.filter((strike) => !strikeIds.includes(strike.id))
          )
          setFlashes((currentFlashes) =>
            currentFlashes.filter((flash) => !flashIds.includes(flash.id))
          )
        }, 1100)
      )

      timeoutId = window.setTimeout(stormPulse, randomBetween(700, 2450))
    }

    timeoutId = window.setTimeout(stormPulse, randomBetween(120, 420))

    return () => {
      window.clearTimeout(timeoutId)
      cleanupTimeouts.forEach((cleanupTimeoutId) =>
        window.clearTimeout(cleanupTimeoutId)
      )
    }
  }, [viewport])

  if (!viewport.width || !viewport.height) {
    return null
  }

  return (
    <div className="lightning-bg natural-lightning-bg" aria-hidden="true">
      {flashes.map((flash) => (
        <span
          className="sky-sheet-flash"
          key={flash.id}
          style={{
            '--flash-x': flash.x,
            '--flash-y': flash.y,
            '--flash-size': flash.size,
            '--flash-duration': flash.duration,
            '--flash-opacity': flash.opacity,
          }}
        ></span>
      ))}

      <svg
        className="natural-lightning-canvas"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lightning-roughen" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
          </filter>
        </defs>

        {strikes.map((strike) => (
          <g
            className={`natural-lightning natural-lightning-${strike.type}`}
            key={strike.id}
            style={{
              '--strike-duration': `${strike.duration}s`,
              '--strike-intensity': strike.intensity,
            }}
          >
            <circle
              className="natural-cloud-flash"
              cx={strike.start.x}
              cy={strike.start.y}
              r={strike.cloudRadius}
            />
            <circle
              className="natural-ground-flash"
              cx={strike.end.x}
              cy={strike.end.y}
              r={strike.cloudRadius * 0.62}
            />
            <path className="natural-lightning-bloom" d={strike.ghostPath} />
            <path className="natural-lightning-haze" d={strike.mainPath} />
            <path className="natural-lightning-channel" d={strike.mainPath} filter="url(#lightning-roughen)" />
            <path className="natural-lightning-hotcore" d={strike.mainPath} />

            {strike.branches.map((branch) => (
              <g className="natural-lightning-branch" key={branch.id}>
                <path className="natural-branch-bloom" d={branch.glowPath} />
                <path
                  className="natural-branch-core"
                  d={branch.path}
                  style={{
                    strokeWidth: branch.width,
                    opacity: branch.opacity,
                  }}
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default LightningEffect
