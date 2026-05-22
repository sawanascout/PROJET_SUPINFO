# Générateur de mèmes — Mini projet SUPINFO

Mini projet d'admission **SUPINFO Master** : une application web moderne permettant de créer, télécharger et partager des mèmes, construite avec **React** et **Vite**.

---

## Fonctionnalités

- Upload d'image depuis l'ordinateur
- Ajout de texte (haut et bas) au style mème classique : blanc, contour noir épais, police Impact, majuscules
- Aperçu en temps réel via **Canvas HTML5**
- Téléchargement du mème généré en **PNG**
- Galerie persistante grâce au **localStorage** (aucun backend requis)
- Suppression et re-téléchargement des mèmes sauvegardés
- Partage natif via **Web Share API**, avec fallback automatique sur le presse-papier
- Thème clair / sombre
- Interface responsive (mobile et desktop) avec animations légères

---

## Stack technique

- **React 18**
- **Vite 5**
- **JavaScript** (sans TypeScript)
- **CSS moderne** : variables CSS, grid, animations
- Compatible avec un déploiement **Vercel**

---

## Prérequis

- **Node.js 18+** ([nodejs.org](https://nodejs.org))
- **npm** (installé avec Node.js)

Vérifier les versions :

```bash
node -v
npm -v
```

---

## Lancement en local

```bash
npm install
npm run dev
```

L'application est ensuite disponible sur [http://localhost:5173](http://localhost:5173).

---

## Build de production

```bash
npm run build
npm run preview
```

- `npm run build` génère la version optimisée dans le dossier `dist/`.
- `npm run preview` permet de prévisualiser ce build localement.

---

## Déploiement sur Vercel

1. Pousser le projet sur GitHub.
2. Sur [vercel.com](https://vercel.com), cliquer sur **New Project** puis importer le dépôt.
3. Vercel détecte automatiquement la configuration **Vite** :
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Cliquer sur **Deploy**.

Aucune variable d'environnement n'est requise.

---

## Structure du projet

```
miniprojet_supinfo/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx              # Point d'entrée React
    ├── App.jsx               # Composant racine + gestion localStorage + thème
    ├── styles.css            # Styles globaux modernes
    └── components/
        ├── Header.jsx        # En-tête + bascule de thème
        ├── MemeEditor.jsx    # Éditeur principal (upload, textes, actions)
        ├── MemeCanvas.jsx    # Rendu canvas HTML5 du mème
        └── MemeGallery.jsx   # Galerie des mèmes sauvegardés
```

---

## Notes d'implémentation

- Le **canvas** redimensionne automatiquement les grandes images (largeur maximale : 1200 px) et adapte la taille de la police à la largeur de l'image.
- Le texte est découpé automatiquement sur plusieurs lignes lorsqu'il dépasse la largeur du canvas.
- La galerie stocke chaque mème sous forme de **dataURL PNG** dans le `localStorage` : aucune base de données ni backend nécessaire.
- Le partage utilise `navigator.share` lorsque l'API est disponible (principalement sur mobile), sinon `navigator.clipboard.write` pour copier l'image dans le presse-papier.
- L'interface est intégralement en français, épurée et conçue pour être présentée pendant un entretien.

---

## Scripts disponibles

| Commande           | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm install`      | Installe les dépendances                     |
| `npm run dev`      | Lance le serveur de développement (Vite)     |
| `npm run build`    | Génère le build de production dans `dist/`   |
| `npm run preview`  | Prévisualise le build de production en local |

---

