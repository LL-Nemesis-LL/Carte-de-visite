# VisitCard

## Description
**VisitCard** est un site web permettant de créer des cartes de visite numériques qui peuvent être partagées par la suite.

Vous entrez vos données personnelles comme le nom de votre poste, service, numéro de téléphone, email, une photo de profil, le logo de l'établissement ainsi que son adresse. Vous aurez la possibilité de générer une carte de visite dans un format horizontal ou vertical.

## Utilisation

Ce projet m'a permis de découvrir la notion de **promesse** en **JavaScript**, le **transfert de fichier**, l'**API Fetch**, la **cryptographie**, la configuration des **cookies** de manière sécurisée, la **fragmentation des fichiers JS en modules** et l'utilisation des **variables d'environnement**.

### Front-End

Cette application n'utilise aucun framework en **front-end**, il s'agit de fichiers HTML, CSS, JS et SVG statiques. L'envoi de requêtes **fetch** au serveur **back-end** permet de récupérer par la suite les informations. Les fichiers **HTML** et le répertoire **public** sont accessibles par tous. Le reste doit être bloqué.

### Back-End

**Node** est utilisé pour le **Back-End** ainsi que le gestionnaire de paquets **npm**. Le service **Http** est supervisé par **Express-js**.

### Modules

**Dotenv** définit et de rassemble dans un seul fichier toute les adresses serveurs, la connexion de la base de données ainsi que le **salt** pour les mots de passe. Ceci assure une sécurité supplémentaire mais également une agilité simplifiée. Cependant, il est nécessaire de se positionner dans le répertoire contenant le fichier **.env** avant de démarrer le serveur **Back-End**. 

**Cors** a été utilisé dans le cadre où le **Front-End** était gérer par un autre serveur que le **Back-End**. Il est tout à fait possible d'utiliser le serveur **Front-End** (Apache, Nginx) comme un **reverse proxy** pour rediriger les requêtes destinées au serveur **Back-end** en localhost ou à un autre serveur. Ainsi nous pouvont exclure le mode **Cors** dans les requêtes **Fetch** du **Front-End**.

**Multer** est un middleware utilisé dans le cas de requête **multipart/form-data**. Il est principalement utile pour le transfère de textes et de fichiers présents dans un **Form HTML**. Les fichiers et textes seront stockés **temporairement dans la mémoire vive** afin de procéder à des vérifications. En cas de validité, ils sont stockés en **base de données** pour le texte,  sur un **stockage** pour les fichiers.

**Fs** vient en complément de **Multer** pour la gestion de fichier.

### Mysql2

**Mysql2** initialise une connexion avec la base de données. Pour ce projet, je me suis pencher sur l'utilisation des **promesses**, des **pool** et des **requêtes préparées** afin d'optimiser les performances et la sécurité. 

Les **promesses** réalisent les requêtes SQL de manière asynchrone. Ainsi, le reste du programme n'est pas bloquer. Car la requête SQL peut prendre plus ou moins de temps selon la connexion.

Les **pools** initialisent un certain nombre de connections avec le serveur et réutilise ces mêmes connections pour faire plusieurs requêtes. Ainsi, nous fluidifions la bande passante en omettant à chaque requête la phase d'initialisation d'une nouvelle connexion.

```javaScript
const pool = mysql.createPool({
    host: process.env.host_DB,
    user: process.env.user_DB,
    password: process.env.password_DB,
    database: process.env.name_DB,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
```

Les **requêtes préparées** ajoutent une sécurité indéniable en contrant les injections SQL. Elles définissent en avance le context de la requête et il suffit ensuite de renseigné dans une liste les arguments à passer à la requête.

```javascript
let password = ["mot de passe"];
mysql2.execute("SELECT password FROM users WHERE email=?", password);
```
## Création de l'environnement

### Configuration des variables d'environnement

Pour renseigner l'adresse du serveur **Front-End**, l'adresse et le mot de passe de la **base de données**. Rendez-vous dans le fichier `Back-end/.env`

### Initialisation de la base de données

La création de la base de données ainsi que ses tables est présente dans le fichier `Doc/databases.txt`

### Installation des modules npm
```sh
cd ./Back-end/

#Variable d'environnement
npm install dotenv

#Http
npm install express cors cookie-parser

#Base de données
npm install mysql2

#Cryptographie
npm install crypto js-sha256

#Fichier
npm install multer fs path
```

## Fonctionnalité

Par manquant de temps et d'expérience, je n'ai malheureusement pas pu terminer ce projet.

### Point présents
- Création de compte
- Création de carte de visite
- Consultation de ses cartes de visite
- Affichage vertical des cartes de visite
- Affichage horizontal des cartes de visite

### Point manquants

- Le partage de carte de visite
- La modification de carte de visite
- La suppression de carte de visite
- La gestion de son compte utilisateur
- Ajout de réseaux sociaux sur la carte de visite
- Renouvellement du token de connexion avant expiration
- Vérification des données réçues avant de les enregistrer

## Remerciements

J'ai beaucoup aimé mener ce project. À présent, j'ai une meilleure idée du fonctionnement des requêtes HTTP ainsi que des sécurités mises en place. Mais également différentes notions qui pourraient aider à rendre une application WEB plus fluide et optimisée.

Je suis toute de même déçu de ne pas avoir pu finir. Je serai peut-être aller plus vite en utisant un framework. Si je n'ai pas fais ce choix c'était par curiosité et pour le challenge. Je voulais savoir comment les choses fonctionnent concrètement et si j'étais capable de les reproduire.