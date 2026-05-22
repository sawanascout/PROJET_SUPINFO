import { forwardRef, useEffect, useRef } from 'react'

/**
 * MemeCanvas
 * ----------
 * Dessine l'image + les textes sur un <canvas> HTML5.
 * Le composant expose le canvas via une `ref` (forwardRef) pour que
 * le parent puisse récupérer le canvas afin de télécharger / sauvegarder.
 *
 * Props :
 *  - image     : HTMLImageElement déjà chargé (ou null)
 *  - topText   : texte du haut
 *  - bottomText: texte du bas
 */
const MemeCanvas = forwardRef(function MemeCanvas({ image, topText, bottomText }, ref) {
  const internalRef = useRef(null)

  // On expose le canvas interne au parent via la ref transmise
  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') ref(internalRef.current)
    else ref.current = internalRef.current
  }, [ref])

  // Re-dessine le canvas dès que l'image ou les textes changent
  useEffect(() => {
    const canvas = internalRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Placeholder si aucune image
    if (!image) {
      canvas.width = 800
      canvas.height = 450
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '600 28px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Uploadez une image pour commencer', canvas.width / 2, canvas.height / 2)
      return
    }

    // Adapte le canvas aux dimensions de l'image (max 1200px de large)
    const maxWidth = 1200
    const ratio = Math.min(1, maxWidth / image.naturalWidth)
    canvas.width = image.naturalWidth * ratio
    canvas.height = image.naturalHeight * ratio

    // Dessine l'image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Style mème classique : texte blanc + contour noir épais, majuscules
    drawMemeText(ctx, topText, canvas, 'top')
    drawMemeText(ctx, bottomText, canvas, 'bottom')
  }, [image, topText, bottomText])

  return <canvas ref={internalRef} className="meme-canvas" />
})

// Dessine un texte style mème (positionné en haut ou en bas)
function drawMemeText(ctx, text, canvas, position) {
  if (!text) return

  // Taille de police proportionnelle à la largeur du canvas
  const fontSize = Math.max(28, Math.floor(canvas.width / 12))
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = position === 'top' ? 'top' : 'bottom'
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2
  ctx.lineWidth = Math.max(4, fontSize / 10)
  ctx.strokeStyle = '#000'
  ctx.fillStyle = '#fff'

  const upper = text.toUpperCase()
  const x = canvas.width / 2
  const padding = fontSize * 0.4
  const y = position === 'top' ? padding : canvas.height - padding

  // Gestion simple du retour à la ligne automatique
  const lines = wrapText(ctx, upper, canvas.width - padding * 2)
  const lineHeight = fontSize * 1.05

  if (position === 'top') {
    lines.forEach((line, i) => {
      const ly = y + i * lineHeight
      ctx.strokeText(line, x, ly)
      ctx.fillText(line, x, ly)
    })
  } else {
    // Pour le bas, on dessine de bas en haut pour empiler proprement
    lines
      .slice()
      .reverse()
      .forEach((line, i) => {
        const ly = y - i * lineHeight
        ctx.strokeText(line, x, ly)
        ctx.fillText(line, x, ly)
      })
  }
}

// Découpe le texte en plusieurs lignes pour ne pas dépasser maxWidth
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

export default MemeCanvas
