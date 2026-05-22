import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import MemeEditor from './components/MemeEditor.jsx'
import MemeGallery from './components/MemeGallery.jsx'

// Clé utilisée pour persister la galerie dans le localStorage
const STORAGE_KEY = 'supinfo-memes-gallery'

export default function App() {
  // État global : liste des mèmes sauvegardés (chacun = { id, dataUrl, createdAt })
  const [gallery, setGallery] = useState([])
  // Thème clair / sombre (sombre par défaut, plus moderne)
  const [theme, setTheme] = useState('dark')

  // Au chargement : on récupère la galerie depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setGallery(JSON.parse(stored))
    } catch (err) {
      console.error('Lecture localStorage impossible :', err)
    }
  }, [])

  // À chaque modification : on persiste la galerie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery))
    } catch (err) {
      console.error('Écriture localStorage impossible :', err)
    }
  }, [gallery])

  // Applique le thème via un attribut HTML
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Ajoute un nouveau mème en tête de galerie
  const addMeme = (dataUrl) => {
    const newMeme = {
      id: Date.now(),
      dataUrl,
      createdAt: new Date().toISOString(),
    }
    setGallery((prev) => [newMeme, ...prev])
  }

  // Supprime un mème de la galerie
  const removeMeme = (id) => {
    setGallery((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

      <main className="container">
        <MemeEditor onSave={addMeme} />
        <MemeGallery memes={gallery} onDelete={removeMeme} />
      </main>

      <footer className="footer">
        <p>Mini projet d'admission SUPINFO — Générateur de mèmes</p>
      </footer>
    </div>
  )
}
