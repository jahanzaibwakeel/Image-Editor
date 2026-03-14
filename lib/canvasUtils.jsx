// Flood fill algorithm
export function floodFill(ctx, startX, startY, fillColor) {
  const canvas  = ctx.canvas
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data    = imgData.data
  const width   = canvas.width

  const index  = (y, x) => (y * width + x) * 4
  const target = Array.from(data.slice(index(startY, startX), index(startY, startX) + 4))

  // Convert hex color to RGBA
  const r = parseInt(fillColor.slice(1, 3), 16)
  const g = parseInt(fillColor.slice(3, 5), 16)
  const b = parseInt(fillColor.slice(5, 7), 16)

  if (
    target[0] === r &&
    target[1] === g &&
    target[2] === b &&
    target[3] === 255
  ) return

  const colorsMatch = (i) =>
    data[i]     === target[0] &&
    data[i + 1] === target[1] &&
    data[i + 2] === target[2] &&
    data[i + 3] === target[3]

  const stack = [[startX, startY]]
  while (stack.length) {
    const [cx, cy] = stack.pop()
    if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) continue
    const i = index(cy, cx)
    if (!colorsMatch(i)) continue
    data[i]     = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = 255
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
  }
  ctx.putImageData(imgData, 0, 0)
}

// Draw a shape preview while dragging
export function drawShapePreview(ctx, tool, start, end, settings) {
  const { strokeColor, strokeWidth, fill } = settings
  const x = Math.min(start.x, end.x)
  const y = Math.min(start.y, end.y)
  const w = Math.abs(end.x - start.x)
  const h = Math.abs(end.y - start.y)

  ctx.strokeStyle = strokeColor
  ctx.lineWidth   = strokeWidth
  ctx.fillStyle   = strokeColor

  ctx.beginPath()
  if (tool === 'rectangle') {
    ctx.rect(x, y, w, h)
  } else if (tool === 'circle') {
    const rx = w / 2
    const ry = h / 2
    ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2)
  } else if (tool === 'line') {
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
  }
  if (fill && tool !== 'line') ctx.fill()
  ctx.stroke()
}

// Resize canvas while preserving content
export function resizeCanvas(canvas, newW, newH) {
  const tmp = document.createElement('canvas')
  tmp.width  = canvas.width
  tmp.height = canvas.height
  tmp.getContext('2d').drawImage(canvas, 0, 0)

  canvas.width  = newW
  canvas.height = newH
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, newW, newH)
  ctx.drawImage(tmp, 0, 0)
}

// Get relative position inside canvas
export function getPos(canvas, e) {
  const rect  = canvas.getBoundingClientRect()
  const scaleX = canvas.width  / rect.width
  const scaleY = canvas.height / rect.height
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY,
  }
}
