# Raven React UI

Une bibliothèque de **composants React réutilisables** permettant de centraliser et de présenter différents composants d’interface utilisateur tels que des inputs, boutons, tableaux, KPI, etc.

L’objectif de ce projet est de fournir une base de composants facilement réutilisables et accompagnés de **démos permettant de visualiser leur utilisation**.

### `components/` : Ce dossier contient les **composants réutilisables** du projet.

On peut y retrouver, par exemple :

* Button
* Input
* Table
* Autres composants UI

Chaque composant est conçu pour pouvoir être facilement réutilisé dans différentes parties d'une application React.

### `pages/` : Ce dossier contient les **pages de démonstration** des composants présents dans `components/`.

Les pages permettent notamment de :

* visualiser le rendu des composants ;
* tester leurs différentes variantes ;
* comprendre leur utilisation ;
* servir de référence pour leur intégration dans un autre projet.

## Installation

### 1. Cloner le repository

```bash
git clone <URL_DU_REPOSITORY>
```

Ou téléchargez directement le projet depuis le repository.

### 2. Se rendre dans le projet

```bash
cd <nom-du-projet>
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

### 5. Construire le projet pour la production

```bash
npm run build
```

### 6. Prévisualiser le build de production

```bash
npm run preview
```

Une fois le serveur démarré, ouvrez l'adresse indiquée dans le terminal pour accéder à l'application.