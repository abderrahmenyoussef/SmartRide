# SmartRide 🚗

**SmartRide** est une plateforme de covoiturage intelligente qui permet de connecter les conducteurs et les passagers de manière efficace et sécurisée.

---

## 📋 Table des matières

- [À propos du projet](#à-propos-du-projet)
- [Méthodologie : API First](#méthodologie--api-first)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Système d'authentification](#système-dauthentification)
- [Documentation API](#documentation-api)
- [Installation et démarrage](#installation-et-démarrage)
- [Tests des endpoints](#tests-des-endpoints)

---

## 🎯 À propos du projet

SmartRide est une application de covoiturage intelligente conçue pour faciliter le partage de trajets entre conducteurs et passagers. Le projet suit une approche **API First**, ce qui signifie que nous avons commencé par développer le backend (API REST) avant de créer l'interface utilisateur.

### Pourquoi API First ?

L'approche **API First** présente plusieurs avantages :
- ✅ **Flexibilité** : Permet de créer plusieurs clients (web, mobile, desktop) utilisant la même API
- ✅ **Scalabilité** : Facilite l'évolution et la maintenance du système
- ✅ **Collaboration** : Les équipes frontend et backend peuvent travailler en parallèle
- ✅ **Documentation** : Force à bien définir les contrats d'API dès le début
- ✅ **Testabilité** : Permet de tester la logique métier indépendamment de l'interface

---

## 🛠️ Technologies utilisées

### Backend Framework & Runtime
- **Node.js** - Environnement d'exécution JavaScript côté serveur
- **Express.js v5.1.0** - Framework web minimaliste et flexible pour Node.js

### Base de données
- **MongoDB** - Base de données NoSQL orientée documents
- **Mongoose v8.19.1** - ODM (Object Data Modeling) pour MongoDB et Node.js
  - Fournit une solution basée sur des schémas pour modéliser les données
  - Validation intégrée des données
  - Gestion des relations entre documents

### Sécurité & Authentification
- **bcryptjs** - Bibliothèque pour hasher les mots de passe
  - Protège les mots de passe avec un algorithme de hachage sécurisé
  - Ajoute un "salt" unique pour chaque mot de passe
  
- **jsonwebtoken (JWT)** - Gestion des tokens d'authentification
  - Crée des tokens sécurisés pour l'authentification stateless
  - Vérifie et décode les tokens
  - Gère l'expiration automatique des sessions

### Utilitaires
- **express-async-handler v1.2.0** - Gestionnaire d'erreurs asynchrones
  - Simplifie la gestion des erreurs dans les fonctions async/await
  - Évite les blocs try/catch répétitifs
  
- **dotenv v17.2.3** - Gestion des variables d'environnement
  - Charge les configurations depuis un fichier `.env`
  - Sépare les configurations de développement et de production

### Développement
- **nodemon v3.1.10** - Outil de développement
  - Redémarre automatiquement le serveur lors des modifications de code
  - Améliore la productivité en développement

---

## 📁 Architecture du projet

```
SmartRide/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Configuration de la connexion MongoDB
│   ├── controllers/
│   │   └── authController.js     # Logique métier de l'authentification
│   ├── middleware/
│   │   └── authMiddleware.js     # Middlewares d'authentification et gestion d'erreurs
│   ├── models/
│   │   └── User.js               # Modèle de données utilisateur (Mongoose Schema)
│   ├── routes/
│   │   └── authRoutes.js         # Définition des routes d'authentification
│   ├── .env                      # Variables d'environnement (non versionné)
│   ├── server.js                 # Point d'entrée de l'application
│   └── package.json              # Dépendances et scripts npm
├── captures/                     # Screenshots des tests API
│   ├── 1.png                     # Test endpoint Register
│   ├── 2.png                     # Test endpoint Login
│   ├── 3.png                     # Test endpoint Verify
│   └── 4.png                     # Test endpoint Logout
└── README.md                     # Documentation du projet
```

### Description des dossiers

- **config/** : Contient les fichiers de configuration (base de données, etc.)
- **controllers/** : Contient la logique métier de l'application
- **middleware/** : Contient les middlewares (authentification, gestion d'erreurs, etc.)
- **models/** : Contient les schémas de données Mongoose
- **routes/** : Définit les endpoints de l'API et les associe aux controllers

---

## 🔐 Système d'authentification

Notre système d'authentification est basé sur **JWT (JSON Web Tokens)** et implémente les bonnes pratiques de sécurité.

### Fonctionnalités implémentées

✅ **Inscription (Register)** - Création de nouveaux comptes utilisateurs  
✅ **Connexion (Login)** - Authentification avec email ou username  
✅ **Vérification (Verify)** - Validation des tokens JWT  
✅ **Déconnexion (Logout)** - Révocation sécurisée des tokens  

### Architecture de sécurité

#### 1. **Modèle User (models/User.js)**

Le modèle utilisateur utilise Mongoose avec plusieurs fonctionnalités de sécurité :

**Schéma de données :**
```javascript
{
  username: String (unique, requis, minuscule)
  email: String (unique, requis, minuscule)
  password: String (requis, min 8 caractères, select: false)
  role: String (enum: ['conducteur', 'passager'])
  timestamps: true (createdAt, updatedAt automatiques)
}
```

**Sécurité du mot de passe :**
- ✅ **Hachage automatique** : Hook `pre('save')` qui hash le mot de passe avec bcrypt avant la sauvegarde
- ✅ **Salt génération** : Chaque mot de passe a un salt unique (10 rounds)
- ✅ **Exclusion par défaut** : `select: false` empêche le retour du mot de passe dans les requêtes
- ✅ **Méthode de comparaison** : `matchPassword()` compare de manière sécurisée le mot de passe saisi avec le hash

**Pourquoi `matchPassword` est dans le schéma ?**
- **Encapsulation** : La logique de comparaison est liée aux données utilisateur
- **Réutilisabilité** : Méthode d'instance Mongoose accessible partout
- **Accès au contexte** : A accès direct à `this.password` (le hash)
- **Séparation des responsabilités** : Le modèle gère les données, le controller gère la logique métier

#### 2. **Controller d'authentification (controllers/authController.js)**

**Principe :** Utilisation de `asyncHandler` pour gérer automatiquement les erreurs asynchrones.

**Fonctions implémentées :**

- **`generateToken(id)`** : Génère un JWT signé avec une clé secrète, expire après 30 jours
  
- **`register(req, res)`** :
  - Valide les champs requis (username, email, password, role)
  - Vérifie l'unicité de l'email et du username
  - Crée l'utilisateur (le mot de passe est hashé automatiquement par le hook Mongoose)
  - Retourne le token JWT et les infos utilisateur
  
- **`login(req, res)`** :
  - Accepte `identifier` (email OU username) et password
  - Recherche l'utilisateur avec `$or` MongoDB
  - Utilise `.select('+password')` pour inclure le mot de passe (exclu par défaut)
  - Compare le mot de passe avec `user.matchPassword()`
  - Retourne le token JWT si les identifiants sont corrects
  
- **`verify(req, res)`** :
  - Route protégée (nécessite un token valide)
  - Retourne les informations de l'utilisateur authentifié
  - Utilisé pour vérifier la validité du token
  
- **`logout(req, res)`** :
  - Route protégée
  - Ajoute le token à une blacklist (Set JavaScript)
  - Révoque le token pour empêcher sa réutilisation

**Blacklist des tokens :**
```javascript
const revokedTokens = new Set();
```
Permet d'invalider les tokens lors de la déconnexion.

#### 3. **Middleware d'authentification (middleware/authMiddleware.js)**

**`protect`** - Middleware pour protéger les routes :
1. Vérifie la présence du header `Authorization: Bearer <token>`
2. Extrait le token
3. Vérifie si le token est dans la blacklist (révoqué)
4. Décode et vérifie le token avec `jwt.verify()`
5. Récupère l'utilisateur depuis la base de données
6. Attache l'utilisateur à `req.user`
7. Appelle `next()` pour passer au controller

**Gestion des erreurs :**
- `urlnotfound` : Middleware pour les routes non trouvées (404)
- `userErrorHandler` : Middleware global de gestion d'erreurs qui :
  - Gère les erreurs de validation Mongoose
  - Gère les erreurs de CastError (ID invalide)
  - Gère les erreurs de duplication (code 11000)
  - Retourne un JSON avec le message d'erreur et la stack trace (en développement)

#### 4. **Routes d'authentification (routes/authRoutes.js)**

Définition des endpoints avec application sélective du middleware `protect` :

```javascript
POST   /api/auth/register  → register (public)
POST   /api/auth/login     → login (public)
GET    /api/auth/verify    → protect → verify (protégée)
POST   /api/auth/logout    → protect → logout (protégée)
```

**Pattern middleware en chaîne :**
```javascript
authRoutes.get('/verify', protect, verify);
// 1. protect s'exécute et vérifie le token
// 2. verify s'exécute avec req.user disponible
```

---

## 📚 Documentation API

### Base URL
```
http://localhost:3000/api/auth
```

### Endpoints disponibles

---

#### 1. **Register - Inscription d'un utilisateur**

**Endpoint :** `POST /api/auth/register`

**Description :** Permet de créer un nouveau compte utilisateur.

**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "passager"
}
```

**Paramètres :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| username | String | Oui | Nom d'utilisateur unique (minuscule) |
| email | String | Oui | Adresse email unique (minuscule) |
| password | String | Oui | Mot de passe (min 8 caractères) |
| role | String | Oui | Type d'utilisateur : "conducteur" ou "passager" |

**Réponse succès (201) :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "674abc123...",
  "username": "testuser",
  "role": "passager"
}
```

**Erreurs possibles :**
- `400` - Champs manquants ou invalides
- `400` - Utilisateur existe déjà (email ou username dupliqué)
- `409` - Email ou Username dupliqué

**Screenshot :**

![Test Register](./captures/1.png)

---

#### 2. **Login - Connexion d'un utilisateur**

**Endpoint :** `POST /api/auth/login`

**Description :** Authentifie un utilisateur avec son email/username et mot de passe.

**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "identifier": "test@example.com",
  "password": "password123"
}
```
*Note : `identifier` peut être soit l'email, soit le username*

**Paramètres :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| identifier | String | Oui | Email OU username de l'utilisateur |
| password | String | Oui | Mot de passe de l'utilisateur |

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "674abc123...",
  "username": "testuser",
  "role": "passager"
}
```

**Erreurs possibles :**
- `400` - Identifiant ou mot de passe manquant
- `401` - Identifiant ou mot de passe invalide

**Screenshot :**

![Test Login](./captures/2.png)

---

#### 3. **Verify - Vérification du token JWT**

**Endpoint :** `GET /api/auth/verify`

**Description :** Vérifie la validité d'un token JWT et retourne les informations de l'utilisateur.

**Headers :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paramètres :**
Aucun (le token est dans le header)

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Token valide",
  "user": {
    "userId": "674abc123...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "passager"
  }
}
```

**Erreurs possibles :**
- `401` - Pas de token fourni
- `401` - Token invalide ou expiré
- `401` - Token révoqué (après logout)

**Utilité de cette route :**
- Vérifier la session utilisateur au chargement de l'application
- Rafraîchir les données utilisateur
- Valider l'authentification avant d'accéder à des ressources protégées
- Implémenter une session persistante (token stocké dans localStorage)

**Screenshot :**

![Test Verify](./captures/3.png)

---

#### 4. **Logout - Déconnexion d'un utilisateur**

**Endpoint :** `POST /api/auth/logout`

**Description :** Déconnecte l'utilisateur et révoque son token JWT.

**Headers :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paramètres :**
Aucun (le token est dans le header)

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

**Erreurs possibles :**
- `401` - Pas de token fourni
- `401` - Token invalide

**Note :** Après la déconnexion, le token est ajouté à une blacklist et ne peut plus être utilisé pour accéder aux routes protégées.

**Screenshot :**

![Test Logout](./captures/4.png)

---

### Récapitulatif des endpoints

| Endpoint | Méthode | Protection | Description | Paramètres |
|----------|---------|------------|-------------|------------|
| `/api/auth/register` | POST | ❌ Public | Inscription | username, email, password, role |
| `/api/auth/login` | POST | ❌ Public | Connexion | identifier, password |
| `/api/auth/verify` | GET | ✅ Protégée | Vérification token | Bearer token (header) |
| `/api/auth/logout` | POST | ✅ Protégée | Déconnexion | Bearer token (header) |

---

## 🚀 Installation et démarrage

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/abderrahmenyoussef/SmartRide.git
cd SmartRide/Backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` dans le dossier `Backend/` :
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartride
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=development
```

**Générer un JWT_SECRET sécurisé :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Démarrer le serveur**

**Mode développement (avec nodemon) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

---



## 🔒 Sécurité

### Mesures de sécurité implémentées

✅ **Hachage des mots de passe** avec bcrypt (10 rounds)  
✅ **Tokens JWT signés** avec clé secrète sécurisée  
✅ **Expiration des tokens** (30 jours)  
✅ **Blacklist des tokens** lors de la déconnexion  
✅ **Validation des données** avec Mongoose  
✅ **Protection contre les duplications** (email/username uniques)  
✅ **Gestion centralisée des erreurs**  
✅ **Variables sensibles** stockées dans `.env` (non versionné)  


---

## 📄 Licence

Ce projet est développé à des fins éducatives.

---
