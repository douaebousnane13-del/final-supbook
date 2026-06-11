# SupBook

Application de bibliothèque personnelle. L'utilisateur s'inscrit, ajoute ses livres, peut leur attacher un auteur et les ranger dans des collections, mettre une note, un avis et suivre son statut de lecture.

Backend en Strapi v5, frontend en React.

## Schéma relationnel

User - Livre (1-N)
Livre - Auteur (1-1)
Livre - Collection (N-N)
User - Auteur (1-N)
User - Collection (1-N)

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

## Choix techniques

J'ai choisi Strapi car c'était demandé dans la consigne et je l'avais déjà utilisé une fois. Ça génère les routes automatiquement ce qui m'a évité de tout coder à la main. J'ai quand même eu des difficultés avec les permissions au début, les relations entre les modèles aussi, mais j'ai réussi à faire fonctionner tout ça.

Pour le front j'ai utilisé React parce que c'est ce que je connais le mieux. J'ai pas utilisé de router car avec seulement 5 pages c'était pas nécessaire. Pour les appels API j'ai tout mis dans un fichier séparé pour pas répéter le même code dans chaque composant. J'ai aussi créé un hook `useNotification` partagé entre les pages pour éviter de répéter la logique des toasts de succès et d'erreur.

Le JWT est stocké dans le localStorage et j'ai utilisé SQLite car le projet tourne en local.

J'ai aussi appris que sans `populate` Strapi renvoie seulement les IDs et pas les données complètes, ce qui cassait l'affichage.

## Guide utilisateur

**S'inscrire** : page d'accueil → "S'inscrire", remplir nom / email / mot de passe. Redirection vers la page de connexion.

**Se connecter** : email + mot de passe. Redirection vers la bibliothèque.

**Ajouter un livre** : bouton "+ Ajouter un livre" → modal. Titre obligatoire, le reste est optionnel (description, URL de couverture, statut, note, avis, auteur, collections — on peut en cocher plusieurs).

**Modifier / supprimer** : boutons sur chaque carte. Le modal de modification reprend les mêmes champs.

**Filtres et tri** : barre latérale. Filtre par statut, par auteur, par collection. Tri par titre, par note ou par statut. Recherche par titre dans la barre du haut.

**Auteurs et collections** : pages dédiées accessibles depuis la nav, pour les créer indépendamment des livres et pouvoir ensuite les associer.

**Se déconnecter** : bouton dans la nav. Le token est retiré du `localStorage`.
