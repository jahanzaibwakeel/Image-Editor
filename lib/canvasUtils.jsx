export function getPos(canvas, e) {
  const rect   = canvas.getBoundingClientRect()
  const scaleX = canvas.width  / rect.width
  const scaleY = canvas.height / rect.height

  // Support both touch and mouse events
  const clientX = e.touches?.[0]?.clientX ?? e.clientX
  const clientY = e.touches?.[0]?.clientY ?? e.clientY

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY,
  }
}

// ── Draw shape preview (live drag) ───────────────────────────────────────
export function drawShapePreview(ctx, tool, start, end, shapeSettings) {
  const { fill, strokeColor, strokeWidth } = shapeSettings

  ctx.save()
  ctx.strokeStyle = strokeColor || '#000000'
  ctx.fillStyle   = strokeColor || '#000000'  // fill uses same color
  ctx.lineWidth   = strokeWidth || 2
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1

  if (tool === 'rectangle') {
    const w = end.x - start.x
    const h = end.y - start.y
    if (fill) {
      ctx.fillRect(start.x, start.y, w, h)
    } else {
      ctx.strokeRect(start.x, start.y, w, h)
    }
  }

  else if (tool === 'circle') {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const r  = Math.sqrt(dx * dx + dy * dy)
    ctx.beginPath()
    ctx.arc(start.x, start.y, r, 0, Math.PI * 2)
    if (fill) ctx.fill()
    else       ctx.stroke()
  }

  else if (tool === 'line') {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x,   end.y)
    ctx.stroke()
  }

  ctx.restore()
}

// ── Flood Fill ────────────────────────────────────────────────────────────
export function floodFill(ctx, sx, sy, hexColor) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data      = imageData.data

  // Parse hex color → RGBA
  const fillRgba = hexToRgba(hexColor)

  // Get target color at click point
  const idx    = (sy * width + sx) * 4
  const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]]

  // Don't fill if already the same color
  if (
    target[0] === fillRgba[0] &&
    target[1] === fillRgba[1] &&
    target[2] === fillRgba[2] &&
    target[3] === fillRgba[3]
  ) return

  const matches = (i) =>
    data[i]   === target[0] &&
    data[i+1] === target[1] &&
    data[i+2] === target[2] &&
    data[i+3] === target[3]

  const paint = (i) => {
    data[i]   = fillRgba[0]
    data[i+1] = fillRgba[1]
    data[i+2] = fillRgba[2]
    data[i+3] = fillRgba[3]
  }

  // BFS stack flood fill (non-recursive to avoid call stack overflow)
  const visited = new Uint8Array(width * height)
  const queue   = [sy * width + sx]
  visited[sy * width + sx] = 1

  while (queue.length > 0) {
    const pIdx   = queue.pop()
    const px     = pIdx % width
    const py     = Math.floor(pIdx / width)
    const dataI  = pIdx * 4

    paint(dataI)

    const neighbors = [
      { x: px - 1, y: py },
      { x: px + 1, y: py },
      { x: px,     y: py - 1 },
      { x: px,     y: py + 1 },
    ]

    for (const { x, y } of neighbors) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue
      const nIdx = y * width + x
      if (visited[nIdx]) continue
      if (!matches(nIdx * 4)) continue
      visited[nIdx] = 1
      queue.push(nIdx)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// ── Helper: hex color to [r, g, b, a] ────────────────────────────────────
function hexToRgba(hex) {
  // Strip #
  const clean = hex.replace('#', '')
  const full  = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean

  return [
    parseInt(full.substring(0, 2), 16),
    parseInt(full.substring(2, 4), 16),
    parseInt(full.substring(4, 6), 16),
    255,
  ]
}