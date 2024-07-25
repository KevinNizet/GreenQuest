# GreenQuest

GreenQuest est une plateforme web permettant à des groupes de personnes (amis, famille, collègues, etc.) de réaliser ensemble un challenge écologique, appelé “Quête”. Une quête contient une liste d’éco-gestes, appelés “Missions” (ex: aller au travail en vélo, ne pas manger de viande, éteindre son ordinateur). L'objectif de l'application est de promouvoir des comportements écologiques à travers des défis collectifs et motivants.

## Fonctionnalités

- **Création de Comptes Utilisateurs** : Inscription et connexion des utilisateurs.
- **Création de Quêtes** : Les utilisateurs peuvent créer des quêtes en remplissant un formulaire avec les informations nécessaires.
- **Rejoindre une Quête** : Les utilisateurs peuvent rejoindre une quête existante à l'aide d'un code d'invitation.
- **Validation des Missions** : Les utilisateurs peuvent valider les missions qu'ils ont réalisées quotidiennement.
- **Système de Points** : Attribution de points pour chaque mission validée, avec un système de classement pour déterminer le gagnant à la fin de la quête.
- **Notifications par Email** : Envoi d'emails pour la réinitialisation des mots de passe et autres notifications importantes.
- **Upload de Fichiers** : Fonctionnalité d'upload de fichiers pour les utilisateurs.

## Technologies Utilisées

### Frontend

- **Next.js** : Framework React pour le rendu côté serveur et la génération de sites statiques.
- **TypeScript** : Langage de programmation offrant un typage statique pour JavaScript.
- **Material UI** : Bibliothèque de composants React pour une interface utilisateur moderne et réactive.
- **Axios** : Librairie pour effectuer des requêtes HTTP.
- **Apollo Client** : Librairie pour gérer les requêtes et les mutations GraphQL.

### Backend

- **Node.js** : Environnement d'exécution pour JavaScript côté serveur.
- **Express** : Framework web pour Node.js.
- **Apollo Server** : Serveur GraphQL pour gérer les requêtes et mutations.
- **JWT (JSON Web Tokens)** : Pour l'authentification des utilisateurs.
- **TypeORM** : ORM pour interagir avec PostgreSQL.
- **Multer** : Middleware pour le traitement des fichiers.
- **Sharp** : Librairie pour le traitement des images.
- **Node-cron** : Librairie pour la planification des tâches.
- **Node-mailjet** : Librairie pour l'envoi d'emails.

### Base de Données

- **PostgreSQL** : Base de données relationnelle robuste et performante.

## Configuration et Déploiement

- Clonez le projet

```shell
git clone git@github.com:WildCodeSchool/2023-09-wns-rouge-greenquest.git GreenQuest
```

- Créez un fichier `.env` à la racine du projet et dans le backend

```shell
cp .env.sample .env
cd backend
cp .env.sample .env
```

- Remplissez les variables d'environnement

## Lancement du mode développement

```shell
docker compose -f docker-compose.dev.yml up --build
```

## Lancement des tests du backend

- Si vous êtes sur linux ou mac :

```shell
cd backend
npm test
```

- Si vous êtes sur windows ou wsl, faire : cd backends et lancer toute la commande :

```wsl
cd backend
docker stop pgtesting ; docker run --rm --name pgtesting -p 5571:5432 -e POSTGRES_PASSWORD=pgpassword -d postgres && npx jest
```
