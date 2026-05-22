// En-tête de l'application avec titre + bouton de bascule de thème
export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner container">
        <h1 className="logo">Générateur de mèmes</h1>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Changer de thème"
          title="Changer de thème"
        >
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>
    </header>
  )
}
