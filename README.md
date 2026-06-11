# SupBook

Application de bibliothèque personnelle. L'utilisateur s'inscrit, ajoute ses livres, peut leur attacher un auteur et les ranger dans des collections, mettre une note, un avis et suivre son statut de lecture.

Backend en Strapi v5, frontend en React.

## Schéma relationnel

User
  - Livre (1-N)
      - Auteur (optionnel, 1-1)
     - Collection (plusieurs possibles, N-N)
  - Auteur (1-N)
  - Collection (1-N)

Modèles :

- **Livre** : titre, description, couverture (URL), statut (`a_lire` / `en_cours` / `termine`), note (1-5), avis. Relations : `auteur` (oneToOne), `collections` (manyToMany), `users_permissions_user` (oneToOne).
- **Auteur** : nom, prenom. Relation : `users_permissions_user` (oneToOne).
- **Collection** : nom. Relation : `users_permissions_user` (oneToOne).

Chaque ressource est rattachée à son créateur via `users_permissions_user`, ce qui sert au filtrage côté contrôleur.

## Installation backend

Prérequis : Node 20+, npm 9+.


npm install
cp .env.example .env
npm run develop


Strapi écoute sur `http://localhost:1337`. Au premier lancement il faut créer le compte super-admin via `/admin`.

Permissions à activer pour le rôle `Authenticated` (Settings → Users & Permissions → Roles → Authenticated) :

- Livre : find, findOne, create, update, delete
- Auteur : find, findOne, create, update, delete
- Collection : find, findOne, create, update, delete

## Installation frontend


cd supbook-frontend
npm install
npm start


L'app tourne sur `http://localhost:3000`. Le backend Strapi doit être lancé avant.

## Variables d'environnement

Fichier `.env` à la racine du backend (copier `.env.example`) :


HOST=0.0.0.0
PORT=1337
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db


Les valeurs `...` sont à remplacer ; Strapi en génère au premier `npm run develop` si elles sont absentes. Ne pas commiter ce fichier.

## Choix techniques

J'ai pris Strapi v5 parce que la consigne impose un CMS headless et que les routes REST sont générées automatiquement à partir des content-types, ce qui me permettait de me concentrer sur la logique métier (rattachement utilisateur, suppression en cascade de l'auteur).

Côté front, React parce que je le connais le mieux. Pas de router : un seul `useState` dans `App.js` suffit pour 5 pages, ça évite une dépendance pour pas grand-chose. Pas de librairie HTTP non plus : `fetch` enveloppé dans un helper `request` dans `services/api.js` fait le travail (gestion des erreurs réseau et 4xx/5xx au même endroit).

Stockage du JWT dans `localStorage`. C'est ce que Strapi renvoie après `/auth/local`, et ça survit au refresh.

SQLite pour la base, parce que le projet est local et que ça évite d'installer un serveur Postgres pour un rendu.

Styles inline dans les composants. Ça reste lisible pour un projet de cette taille et ça évite de jongler avec des fichiers CSS.

## Guide utilisateur

**S'inscrire** : page d'accueil → "S'inscrire", remplir nom / email / mot de passe. Redirection vers la page de connexion.

**Se connecter** : email + mot de passe. Redirection vers la bibliothèque.

**Ajouter un livre** : bouton "+ Ajouter un livre" → modal. Titre obligatoire, le reste est optionnel (description, URL de couverture, statut, note, avis, auteur, collections — on peut en cocher plusieurs).

**Modifier / supprimer** : boutons sur chaque carte. Le modal de modification reprend les mêmes champs.

**Filtres et tri** : barre latérale. Filtre par statut, par auteur, par collection. Tri par titre, par note ou par statut. Recherche par titre dans la barre du haut.

**Auteurs et collections** : pages dédiées accessibles depuis la nav, pour les créer indépendamment des livres et pouvoir ensuite les associer.

**Se déconnecter** : bouton dans la nav. Le token est retiré du `localStorage`.
