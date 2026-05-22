/**
 * MemeGallery
 * -----------
 * Affiche tous les mèmes sauvegardés en grille responsive.
 * Permet de re-télécharger ou supprimer chaque mème.
 */
export default function MemeGallery({ memes, onDelete }) {
  // Télécharge un mème existant (déjà en dataUrl)
  const handleDownload = (meme) => {
    const link = document.createElement('a')
    link.href = meme.dataUrl
    link.download = `meme-${meme.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="gallery card">
      <h2 className="section-title">
        Galerie <span className="count">({memes.length})</span>
      </h2>

      {memes.length === 0 ? (
        <p className="empty">Aucun mème sauvegardé pour le moment.</p>
      ) : (
        <div className="gallery-grid">
          {memes.map((meme) => (
            <article key={meme.id} className="gallery-item">
              <img src={meme.dataUrl} alt="Mème sauvegardé" loading="lazy" />
              <div className="gallery-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleDownload(meme)}
                  aria-label="Télécharger le mème"
                  title="Télécharger"
                >
                  Télécharger
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(meme.id)}
                  aria-label="Supprimer le mème"
                  title="Supprimer"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
