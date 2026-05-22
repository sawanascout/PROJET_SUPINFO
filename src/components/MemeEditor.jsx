import { useRef, useState } from 'react'
import MemeCanvas from './MemeCanvas.jsx'

/**
 * MemeEditor
 * ----------
 * Composant principal de l'éditeur :
 *  - upload d'image
 *  - saisie du texte du haut / bas
 *  - aperçu en temps réel (via MemeCanvas)
 *  - téléchargement PNG
 *  - sauvegarde dans la galerie (callback onSave)
 *  - partage (Web Share API + fallback presse-papier)
 */
export default function MemeEditor({ onSave }) {
  const [image, setImage] = useState(null) // HTMLImageElement chargé
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [status, setStatus] = useState('') // message UX (ex: "Copié !")

  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Lit le fichier choisi et le transforme en HTMLImageElement
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus('Veuillez sélectionner un fichier image valide.')
      return
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setStatus('')
      }
      img.src = evt.target.result
    }
    reader.readAsDataURL(file)
  }

  // Renvoie le contenu actuel du canvas en dataURL PNG
  const getDataUrl = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.toDataURL('image/png')
  }

  // Télécharge le mème généré en PNG
  const handleDownload = () => {
    if (!image) {
      setStatus('Ajoutez d\'abord une image.')
      return
    }
    const dataUrl = getDataUrl()
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `meme-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setStatus('Mème téléchargé !')
  }

  // Sauvegarde le mème dans la galerie (localStorage via App.jsx)
  const handleSave = () => {
    if (!image) {
      setStatus('Ajoutez d\'abord une image.')
      return
    }
    const dataUrl = getDataUrl()
    onSave(dataUrl)
    setStatus('Mème sauvegardé dans la galerie !')
  }

  // Partage via Web Share API si disponible, sinon copie dans le presse-papier
  const handleShare = async () => {
    if (!image) {
      setStatus('Ajoutez d\'abord une image.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    // Convertit le canvas en Blob pour pouvoir partager un fichier
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], `meme-${Date.now()}.png`, { type: 'image/png' })

      // 1. Web Share API (mobile principalement)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Mon mème',
            text: 'Regarde le mème que j\'ai créé !',
          })
          setStatus('Mème partagé !')
          return
        } catch {
          // utilisateur a annulé : on ne fait rien
          return
        }
      }

      // 2. Fallback : copie de l'image dans le presse-papier
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setStatus('Image copiée dans le presse-papier !')
      } catch {
        setStatus('Partage non supporté sur ce navigateur.')
      }
    }, 'image/png')
  }

  // Réinitialise l'éditeur
  const handleReset = () => {
    setImage(null)
    setTopText('')
    setBottomText('')
    setStatus('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <section className="editor card">
      <h2 className="section-title">Éditeur</h2>

      <div className="editor-layout">
        {/* Colonne contrôles */}
        <div className="controls">
          <label className="upload-btn">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <span>Choisir une image</span>
          </label>

          <div className="field">
            <label htmlFor="top">Texte du haut</label>
            <input
              id="top"
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Ex : Quand le code compile..."
            />
          </div>

          <div className="field">
            <label htmlFor="bottom">Texte du bas</label>
            <input
              id="bottom"
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Ex : ...du premier coup"
            />
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={handleDownload}>
              Télécharger
            </button>
            <button className="btn btn-secondary" onClick={handleSave}>
              Sauvegarder
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              Partager
            </button>
            <button className="btn btn-ghost" onClick={handleReset}>
              Réinitialiser
            </button>
          </div>

          {status && <p className="status">{status}</p>}
        </div>

        {/* Colonne aperçu */}
        <div className="preview">
          <MemeCanvas
            ref={canvasRef}
            image={image}
            topText={topText}
            bottomText={bottomText}
          />
        </div>
      </div>
    </section>
  )
}
