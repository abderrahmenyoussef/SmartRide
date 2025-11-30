# SmartRide 🚗

**SmartRide** est une plateforme de covoiturage intelligente qui permet de connecter les conducteurs et les passagers de manière efficace et sécurisée.

---

## 📋 Table des matières

- [À propos du projet](#à-propos-du-projet)
- [Méthodologie : API First](#méthodologie--api-first)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Système d'authentification](#système-dauthentification)
- [Système de gestion des trajets](#système-de-gestion-des-trajets)
- [Système de chatbot IA - Support client](#système-de-chatbot-ia---support-client)
- [Interface Frontend - Application React](#-interface-frontend---application-react)
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

### Frontend Framework & Bibliothèques
- **React v19.2.0** - Bibliothèque JavaScript pour la construction d'interfaces utilisateur
- **React Router DOM v7.1.1** - Gestion du routage côté client
- **Vite v7.2.4** - Build tool et serveur de développement ultra-rapide

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

- **uuid** - Générateur d'identifiants uniques
  - Crée des IDs uniques pour les réservations
  - Garantit l'unicité des réservations dans les trajets

- **axios v1.4.0** - Client HTTP pour Node.js
  - Effectue des requêtes HTTP vers des APIs externes
  - Utilisé pour communiquer avec l'API OpenRouter (chatbot IA)
  - Gestion des timeouts et des erreurs réseau

### Intelligence Artificielle
- **OpenRouter API** - Plateforme d'accès aux modèles IA
  - Intégration du modèle **x-ai/grok-4.1-fast:free** (Grok)
  - Chatbot intelligent pour le support client
  - Répond aux questions sur les trajets, prix, disponibilités

### Développement
- **nodemon v3.1.10** - Outil de développement backend
  - Redémarre automatiquement le serveur lors des modifications de code
  - Améliore la productivité en développement

- **ESLint v9.39.1** - Linter pour le code frontend
  - Maintient la qualité du code
  - Règles React spécifiques
  - Auto-fix des erreurs courantes

---

## 📁 Architecture du projet

```
SmartRide/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Configuration de la connexion MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Logique métier de l'authentification
│   │   ├── trajetController.js   # Logique métier de gestion des trajets
│   │   └── aiController.js       # Logique métier du chatbot IA (support client)
│   ├── middleware/
│   │   └── authMiddleware.js     # Middlewares d'authentification et gestion d'erreurs
│   ├── models/
│   │   ├── User.js               # Modèle de données utilisateur (Mongoose Schema)
│   │   ├── Trajet.js             # Modèle de données trajet (Mongoose Schema)
│   │   └── Reservation.js        # Schéma de réservation (sous-document)
│   ├── routes/
│   │   ├── authRoutes.js         # Définition des routes d'authentification
│   │   ├── trajetRoutes.js       # Définition des routes de trajets
│   │   └── aiRoutes.js           # Définition des routes du chatbot IA
│   ├── services/
│   │   └── openRouterClient.js   # Client HTTP pour l'API OpenRouter (Grok)
│   ├── .env                      # Variables d'environnement (non versionné)
│   ├── .env.example              # Exemple de configuration environnement
│   ├── server.js                 # Point d'entrée de l'application
│   └── package.json              # Dépendances et scripts npm
├── frontend/
│   ├── public/                   # Fichiers statiques publics
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/            # Page d'authentification (connexion/inscription)
│   │   │   │   ├── Auth.jsx
│   │   │   │   └── Auth.css
│   │   │   ├── Dashboard/       # Tableau de bord (conducteur/passager)
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Dashboard.css
│   │   │   ├── Navigation/      # Barre de navigation globale
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── Navigation.css
│   │   │   ├── TrajetForm/      # Formulaire création/modification trajet
│   │   │   │   ├── TrajetForm.jsx
│   │   │   │   └── TrajetForm.css
│   │   │   └── shared/          # Composants réutilisables
│   │   │       ├── index.js     # Barrel exports
│   │   │       ├── Alert/       # Système d'alertes/confirmations
│   │   │       │   ├── Alert.jsx
│   │   │       │   └── Alert.css
│   │   │       └── Modal/       # Modal générique réutilisable
│   │   │           ├── Modal.jsx
│   │   │           └── Modal.css
│   │   ├── data/
│   │   │   └── mockData.js      # Données de démonstration statiques
│   │   ├── App.jsx              # Composant racine avec routage
│   │   ├── App.css              # Styles globaux
│   │   ├── main.jsx             # Point d'entrée React
│   │   └── index.css            # Styles CSS de base
│   ├── index.html               # Template HTML principal
│   ├── vite.config.js           # Configuration Vite
│   ├── eslint.config.js         # Configuration ESLint
│   └── package.json             # Dépendances et scripts npm frontend
├── captures/                     # Screenshots des tests API et de l'interface
│   ├── 1.png                     # Test endpoint Register
│   ├── 2.png                     # Test endpoint Login
│   ├── 3.png                     # Test endpoint Verify
│   ├── 4.png                     # Test endpoint Logout
│   ├── 5.png                     # Test création de trajet
│   ├── 6.png                     # Test liste des trajets
│   ├── 7.png                     # Test filtre par départ
│   ├── 8.png                     # Test filtre par destination
│   ├── 9.png                     # Test trajet par ID
│   ├── 10.png                    # Test modification de trajet
│   ├── 11.png                    # Test création de réservation
│   ├── 12.png                    # Test réservation avec places non disponibles
│   ├── 13.png                    # Test mes trajets (conducteur)
│   ├── 14.png                    # Test mes trajets (passager - refusé)
│   ├── 15.png                    # Test mes réservations (passager)
│   ├── 16.png                    # Test mes réservations (conducteur - refusé)
│   ├── 17.png                    # Test annulation réservation (passager)
│   ├── 18.png                    # Test annulation réservation (conducteur - refusé)
│   ├── 19.png                    # Test suppression trajet avec réservations
│   ├── 20.png                    # Test suppression trajet sans réservations
│   ├── 21.png                    # Test modification de réservation
│   ├── 22.png                    # Test chatbot IA - Support client
│   ├── 23.png                    # Page de connexion frontend
│   ├── 24.png                    # Page d'inscription frontend
│   ├── 25.png                    # Dashboard conducteur - Vue 1
│   ├── 26.png                    # Dashboard conducteur - Vue 2
│   ├── 27.png                    # Formulaire création de trajet
│   ├── 28.png                    # Dashboard passager - Vue 1
│   ├── 29.png                    # Dashboard passager - Vue 2
│   └── 30.png                    # Modal de réservation
└── README.md                     # Documentation du projet
```

### Description des dossiers Backend

- **config/** : Contient les fichiers de configuration (base de données, etc.)
- **controllers/** : Contient la logique métier de l'application
- **middleware/** : Contient les middlewares (authentification, gestion d'erreurs, etc.)
- **models/** : Contient les schémas de données Mongoose
- **routes/** : Définit les endpoints de l'API et les associe aux controllers
- **services/** : Services externes et clients API (OpenRouter pour le chatbot IA)

### Description des dossiers Frontend

- **components/** : Composants React organisés par fonctionnalité
  - **Auth/** : Gestion de l'authentification (connexion/inscription)
  - **Dashboard/** : Tableau de bord différencié (conducteur/passager)
  - **Navigation/** : Menu de navigation global
  - **TrajetForm/** : Formulaire de gestion des trajets
  - **shared/** : Composants réutilisables (Alert, Modal)
- **data/** : Données de démonstration pour la version statique
- **App.jsx** : Composant racine avec configuration du routage React Router
- **main.jsx** : Point d'entrée de l'application React

---

## 🔄 Diagrammes d'architecture

### Flux d'authentification

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Middleware
    participant DB

    Note over Client,DB: Inscription
    Client->>API: POST /api/auth/register
    API->>DB: Vérifier email/username unique
    DB-->>API: OK
    API->>DB: Hasher password + Sauvegarder user
    DB-->>API: User créé
    API->>API: Générer JWT token
    API-->>Client: 201 {token, userId, username, role}

    Note over Client,DB: Connexion
    Client->>API: POST /api/auth/login
    API->>DB: Trouver user (email ou username)
    DB-->>API: User trouvé
    API->>API: Comparer password (bcrypt)
    API->>API: Générer JWT token
    API-->>Client: 200 {token, userId, username, role}

    Note over Client,DB: Accès route protégée
    Client->>API: GET /api/trajets/mes-trajets
    API->>Middleware: protect() - Vérifier token
    Middleware->>Middleware: Extraire & vérifier JWT
    Middleware->>DB: Récupérer user par ID
    DB-->>Middleware: User data
    Middleware->>API: req.user = user data
    API->>DB: Récupérer trajets du conducteur
    DB-->>API: Liste trajets
    API-->>Client: 200 {trajets}
```

### Flux de gestion des trajets

```mermaid
sequenceDiagram
    participant Conducteur
    participant Passager
    participant API
    participant DB

    Note over Conducteur,DB: Création de trajet
    Conducteur->>API: POST /api/trajets (token conducteur)
    API->>API: checkRole('conducteur')
    API->>DB: Créer trajet
    DB-->>API: Trajet créé
    API-->>Conducteur: 201 {trajet}

    Note over Passager,DB: Recherche de trajets
    Passager->>API: GET /api/trajets?depart=Paris
    API->>DB: Find trajets (filtre)
    DB-->>API: Liste trajets
    API-->>Passager: 200 {trajets}

    Note over Passager,DB: Réservation
    Passager->>API: POST /api/trajets/:id/reservations
    API->>API: checkRole('passager')
    API->>DB: Vérifier places disponibles
    DB-->>API: Places OK
    API->>DB: Ajouter réservation + Update placesReservees
    DB-->>API: Réservation créée
    API-->>Passager: 201 {reservation, trajet}

    Note over Passager,DB: Modification réservation
    Passager->>API: PUT /api/trajets/:id/reservations/:resId
    API->>API: Vérifier propriétaire
    API->>DB: Calculer différence places
    API->>DB: Update réservation
    DB-->>API: Réservation modifiée
    API-->>Passager: 200 {reservation, trajet}

    Note over Passager,DB: Annulation
    Passager->>API: DELETE /api/trajets/:id/reservations/:resId
    API->>DB: Retirer réservation - Update placesReservees
    DB-->>API: Réservation annulée
    API-->>Passager: 200 {message}
```

### Architecture des modèles de données

```mermaid
erDiagram
    User ||--o{ Trajet : "crée (conducteur)"
    User ||--o{ Reservation : "fait (passager)"
    Trajet ||--|{ Reservation : "contient"

    User {
        ObjectId _id PK
        string username UK
        string email UK
        string password
        string role
        datetime createdAt
        datetime updatedAt
    }

    Trajet {
        ObjectId _id PK
        string depart
        string destination
        ObjectId conducteurId FK
        string conducteurNom
        datetime dateDepart
        number placesDisponibles
        number placesReservees
        number prix
        string description
        datetime dateCreation
        array reservations
        datetime createdAt
        datetime updatedAt
    }

    Reservation {
        string _id PK
        ObjectId passagerId FK
        string passagerNom
        number places
        datetime dateReservation
    }
```

### Permissions par rôle

```mermaid
graph TD
    User[Utilisateur authentifié]
    User -->|role = conducteur| Conducteur[Conducteur]
    User -->|role = passager| Passager[Passager]
    
    Conducteur --> C1[Créer trajets]
    Conducteur --> C2[Modifier ses trajets]
    Conducteur --> C3[Supprimer ses trajets]
    Conducteur --> C4[Voir ses trajets]
    Conducteur --> C5[Voir tous les trajets]
    
    Passager --> P1[Réserver trajets]
    Passager --> P2[Modifier ses réservations]
    Passager --> P3[Annuler ses réservations]
    Passager --> P4[Voir ses réservations]
    Passager --> P5[Voir tous les trajets]
    
    style Conducteur fill:#4CAF50
    style Passager fill:#2196F3
    style C1 fill:#81C784
    style C2 fill:#81C784
    style C3 fill:#81C784
    style C4 fill:#81C784
    style C5 fill:#81C784
    style P1 fill:#64B5F6
    style P2 fill:#64B5F6
    style P3 fill:#64B5F6
    style P4 fill:#64B5F6
    style P5 fill:#64B5F6
```

### Flow de vérification des permissions

```mermaid
flowchart TD
    Start([Requête API]) --> Auth{Token valide?}
    Auth -->|Non| Error401[401 Unauthorized]
    Auth -->|Oui| GetUser[Récupérer user depuis token]
    
    GetUser --> CheckEndpoint{Type d'endpoint?}
    
    CheckEndpoint -->|Public| Execute[Exécuter controller]
    
    CheckEndpoint -->|Conducteur only| CheckConducteur{role = conducteur?}
    CheckConducteur -->|Non| Error403C[403 Forbidden - Rôle conducteur requis]
    CheckConducteur -->|Oui| CheckOwnership{Vérifier propriété?}
    
    CheckEndpoint -->|Passager only| CheckPassager{role = passager?}
    CheckPassager -->|Non| Error403P[403 Forbidden - Rôle passager requis]
    CheckPassager -->|Oui| CheckOwnership2{Vérifier propriété?}
    
    CheckOwnership -->|Non requis| Execute
    CheckOwnership -->|Requis| IsOwner{Est propriétaire?}
    IsOwner -->|Non| Error403O[403 Forbidden - Pas le propriétaire]
    IsOwner -->|Oui| Execute
    
    CheckOwnership2 -->|Non requis| Execute
    CheckOwnership2 -->|Requis| IsOwner2{Est propriétaire?}
    IsOwner2 -->|Non| Error403O2[403 Forbidden - Pas le propriétaire]
    IsOwner2 -->|Oui| Execute
    
    Execute --> Success[200/201 Success]
    
    style Start fill:#90CAF9
    style Success fill:#81C784
    style Error401 fill:#EF5350
    style Error403C fill:#FF7043
    style Error403P fill:#FF7043
    style Error403O fill:#FF7043
    style Error403O2 fill:#FF7043
    style Execute fill:#FFD54F
```

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

## 🚗 Système de gestion des trajets

Le système de gestion des trajets permet aux conducteurs de créer et gérer leurs trajets, et aux passagers de réserver des places.

### Fonctionnalités implémentées

✅ **Création de trajets** - Conducteurs peuvent publier leurs trajets  
✅ **Recherche de trajets** - Filtres par départ, destination, date, places disponibles  
✅ **Réservation de places** - Passagers peuvent réserver des trajets  
✅ **Modification de réservations** - Passagers peuvent ajuster le nombre de places  
✅ **Annulation de réservations** - Passagers peuvent annuler leurs réservations  
✅ **Gestion CRUD complète** - Création, lecture, modification, suppression  

### Séparation des rôles

#### **👨‍✈️ CONDUCTEUR** - Privilèges :
✅ Créer des trajets  
✅ Modifier ses trajets  
✅ Supprimer ses trajets (sans réservations)  
✅ Voir ses trajets créés  
❌ Ne peut PAS réserver de trajets  
❌ Ne peut PAS annuler de réservations  

#### **🧑‍🤝‍🧑 PASSAGER** - Privilèges :
✅ Réserver des trajets  
✅ Modifier ses réservations  
✅ Annuler ses réservations  
✅ Voir ses réservations  
❌ Ne peut PAS créer de trajets  
❌ Ne peut PAS modifier/supprimer des trajets  

### Architecture des modèles

#### 1. **Modèle Trajet (models/Trajet.js)**

**Schéma de données :**
```javascript
{
  depart: String (requis)
  destination: String (requis)
  conducteurId: ObjectId (ref: User, requis)
  conducteurNom: String
  dateDepart: Date (requis)
  placesDisponibles: Number (requis, min: 1)
  placesReservees: Number (default: 0)
  prix: Number (requis)
  description: String
  dateCreation: Date (default: Date.now)
  reservations: [ReservationSchema] (sous-documents)
  timestamps: true (createdAt, updatedAt)
}
```

#### 2. **Modèle Réservation (models/Reservation.js)**

**Schéma de sous-document :**
```javascript
{
  _id: String (uuid, requis)
  passagerId: ObjectId (ref: User, requis)
  passagerNom: String (requis)
  places: Number (requis, min: 1)
  dateReservation: Date (default: Date.now)
}
```

**Note :** Les réservations sont stockées comme **sous-documents** dans la collection `trajets`, pas dans une collection séparée.

### Controller de trajets (controllers/trajetController.js)

Toutes les fonctions utilisent `asyncHandler` pour la gestion automatique des erreurs.

**Fonctions implémentées :**

- **`getTrajets(req, res)`** : Récupère tous les trajets avec filtres optionnels (depart, destination, dateDepart, placesMin)
- **`getTrajetById(req, res)`** : Récupère un trajet par son ID
- **`getMesTrajets(req, res)`** : Récupère les trajets créés par le conducteur connecté (rôle conducteur requis)
- **`getMesReservations(req, res)`** : Récupère les trajets réservés par le passager connecté (rôle passager requis)
- **`createTrajet(req, res)`** : Crée un nouveau trajet (rôle conducteur requis)
- **`updateTrajet(req, res)`** : Modifie un trajet existant (propriétaire uniquement, rôle conducteur requis)
- **`deleteTrajet(req, res)`** : Supprime un trajet (propriétaire uniquement, sans réservations, rôle conducteur requis)
- **`bookTrajet(req, res)`** : Réserve des places sur un trajet (rôle passager requis)
- **`updateReservation(req, res)`** : Modifie une réservation existante (propriétaire uniquement, rôle passager requis)
- **`cancelReservation(req, res)`** : Annule une réservation (propriétaire uniquement, rôle passager requis)

### Middleware de vérification de rôle

**`checkRole(role)`** - Middleware pour vérifier le rôle de l'utilisateur :
```javascript
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403);
            throw new Error(`Accès refusé : rôle ${role} requis`);
        }
    };
};
```

### Routes des trajets (routes/trajetRoutes.js)

```javascript
// Routes publiques
GET    /api/trajets              → getTrajets (liste avec filtres)
GET    /api/trajets/:id          → getTrajetById

// Routes protégées - conducteur
GET    /api/trajets/mes-trajets  → protect → getMesTrajets
POST   /api/trajets              → protect → checkRole('conducteur') → createTrajet
PUT    /api/trajets/:id          → protect → updateTrajet
DELETE /api/trajets/:id          → protect → deleteTrajet

// Routes protégées - passager
GET    /api/trajets/mes-reservations              → protect → getMesReservations
POST   /api/trajets/:id/reservations              → protect → bookTrajet
PUT    /api/trajets/:trajetId/reservations/:reservationId    → protect → updateReservation
DELETE /api/trajets/:trajetId/reservations/:reservationId    → protect → cancelReservation
```

---

## 🤖 Système de chatbot IA - Support client

SmartRide intègre un **chatbot intelligent** propulsé par **Grok** (x-ai/grok-4.1-fast:free) via l'API OpenRouter. Ce chatbot sert de support client automatisé et peut répondre aux questions des utilisateurs concernant les trajets disponibles, les prix, les itinéraires, etc.

### Fonctionnalités du chatbot

✅ **Support client automatisé** - Réponses en temps réel aux questions  
✅ **Contextuel** - Connaît le rôle de l'utilisateur (conducteur/passager)  
✅ **Informé** - Accède aux données réelles de la base de données  
✅ **Multilingue** - Répond principalement en français  
✅ **Intelligence conversationnelle** - Comprend le langage naturel  

### Architecture du chatbot

#### 1. **Client OpenRouter (services/openRouterClient.js)**

Service qui communique avec l'API OpenRouter pour interroger le modèle Grok.

**Configuration (via `.env`) :**
```javascript
OPENROUTER_URL=your_openrouter_endpoint
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name_here
```

**Fonction principale :**
- **`sendMessage(messages, options)`** : Envoie des messages au modèle IA et retourne la réponse
  - Utilise **axios** pour les requêtes HTTP
  - Timeout de 30 secondes
  - Gestion d'erreurs avancée (DNS, API, réseau)
  - Validation de configuration complète

**Sécurité :**
- ✅ Validation des variables d'environnement au démarrage
- ✅ Messages d'erreur explicites pour debugging
- ✅ Timeout pour éviter les blocages
- ✅ Clé API stockée dans `.env` (non versionnée)

#### 2. **Controller IA (controllers/aiController.js)**

Gère la logique métier du chatbot et prépare le contexte depuis la base de données.

**Fonction `chat(req, res)` :**

1. **Récupération du contexte utilisateur** :
   - Identité de l'utilisateur (username, rôle) via `req.user`
   - Message de l'utilisateur depuis `req.body.message`

2. **Agrégation des données depuis MongoDB** :
   - **Nombre de trajets disponibles** (date future + places restantes > 0)
   - **Plage de prix** (min/max des trajets futurs)
   - **Exemples de trajets** (5 prochains trajets avec détails)

3. **Construction du prompt contextuel** :
   ```javascript
   System: "You are SmartRide customer support assistant..."
   User context: "Utilisateur: john (passager), 15 trajets disponibles, 
                  Prix: 10-50€, Exemples: Paris→Lyon 25€..."
   User question: "Combien de trajets vers Lyon ?"
   ```

4. **Appel au modèle IA** :
   - Utilise le client OpenRouter
   - Paramètres : `max_tokens: 600`, `temperature: 0.2` (réponses précises)
   - Retourne la réponse générée

**Agrégations MongoDB utilisées :**
```javascript
// Trajets disponibles avec places restantes
Trajet.aggregate([
  { $addFields: { placesRestantes: { $subtract: ["$placesDisponibles", "$placesReservees"] } } },
  { $match: { dateDepart: { $gte: now }, placesRestantes: { $gt: 0 } } },
  { $count: 'count' }
])

// Plage de prix
Trajet.aggregate([
  { $match: { dateDepart: { $gte: now } } },
  { $group: { _id: null, min: { $min: '$prix' }, max: { $max: '$prix' } } }
])
```

#### 3. **Routes IA (routes/aiRoutes.js)**

Définit l'endpoint du chatbot avec protection par authentification.

```javascript
POST   /api/ai/chat   → protect → chat
```

**Protection :**
- ✅ Route protégée (middleware `protect`)
- ✅ Utilisateur doit être authentifié
- ✅ Token JWT requis dans les headers

---

### Documentation API - Chatbot IA

#### **Chat avec l'assistant IA**

**Endpoint :** `POST /api/ai/chat`

**Description :** Permet d'envoyer un message au chatbot IA et recevoir une réponse contextuelle basée sur les données réelles de la plateforme.

**Headers :**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "message": "Combien de trajets sont disponibles vers Paris aujourd'hui ?"
}
```

**Paramètres :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| message | String | Oui | Question ou message à envoyer au chatbot |

**Réponse succès (200) :**
```json
{
  "success": true,
  "reply": "Bonjour ! Actuellement, nous avons 15 trajets disponibles avec des places. Les prix varient entre 10€ et 50€. Par exemple, il y a un trajet Paris → Lyon prévu pour demain à 25€ avec 3 places disponibles. Souhaitez-vous plus de détails sur un trajet spécifique ?"
}
```

**Réponse erreur (400) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Le champ `message` est requis et doit être une chaîne de caractères"
}
```

**Réponse erreur (401) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Non autorisé, pas de token"
}
```

**Réponse erreur (500) - API OpenRouter :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Erreur lors de la requête vers OpenRouter: timeout of 30000ms exceeded"
}
```

---

### Exemples d'utilisation du chatbot

#### **Exemple 1 : Questions sur les trajets disponibles**

**Requête :**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Combien de trajets disponibles avez-vous ?"}'
```

**Réponse :**
```json
{
  "success": true,
  "reply": "Nous avons actuellement 23 trajets disponibles avec des places restantes."
}
```

#### **Exemple 2 : Questions sur les prix**

**Requête :**
```json
{
  "message": "Quels sont les prix typiques pour les trajets ?"
}
```

**Réponse :**
```json
{
  "success": true,
  "reply": "Les prix varient généralement entre 8€ et 45€ selon la distance et la destination. La plupart des trajets se situent autour de 20-30€."
}
```

#### **Exemple 3 : Questions spécifiques à un itinéraire**

**Requête :**
```json
{
  "message": "Y a-t-il des trajets Paris → Lyon disponibles cette semaine ?"
}
```

**Réponse :**
```json
{
  "success": true,
  "reply": "Oui ! J'ai trouvé 2 trajets Paris → Lyon disponibles cette semaine : un demain à 25€ avec 2 places, et un autre vendredi à 30€ avec 4 places disponibles."
}
```

---


### Capture d'écran - Test du chatbot

![Test chatbot IA](./captures/22.png)
*Exemple de conversation avec le chatbot pour obtenir des informations sur les trajets disponibles*

---

## 📚 Documentation API - Gestion des trajets

### Base URL
```
http://localhost:3000/api/trajets
```

---

## 🔐 Endpoints d'authentification

### Base URL : `/api/auth`

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

## 🚗 Endpoints de gestion des trajets

### Base URL : `/api/trajets`

---

#### 5. **Create Trajet - Créer un trajet (CONDUCTEUR)**

**Endpoint :** `POST /api/trajets`

**Description :** Permet à un conducteur de créer un nouveau trajet.

**Headers :**
```
Content-Type: application/json
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Body (JSON) :**
```json
{
  "depart": "Paris",
  "destination": "Lyon",
  "dateDepart": "2025-12-15T09:00:00",
  "placesDisponibles": 3,
  "prix": 30,
  "description": "Trajet direct, climatisation"
}
```

**Paramètres :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| depart | String | Oui | Ville de départ |
| destination | String | Oui | Ville de destination |
| dateDepart | Date | Oui | Date et heure de départ |
| placesDisponibles | Number | Oui | Nombre de places disponibles (min: 1) |
| prix | Number | Oui | Prix par place |
| description | String | Non | Description du trajet |

**Réponse succès (201) :**
```json
{
  "success": true,
  "message": "Trajet créé avec succès",
  "trajet": {
    "_id": "674...",
    "depart": "Paris",
    "destination": "Lyon",
    "conducteurId": "674...",
    "conducteurNom": "ahmed_conducteur",
    "dateDepart": "2025-12-15T09:00:00.000Z",
    "placesDisponibles": 3,
    "placesReservees": 0,
    "prix": 30,
    "description": "Trajet direct, climatisation",
    "reservations": []
  }
}
```

**Erreurs possibles :**
- `400` - Champs obligatoires manquants
- `403` - Accès refusé : rôle conducteur requis

**Screenshot :**

![Test Créer Trajet](./captures/5.png)

---

#### 6. **Get All Trajets - Liste des trajets**

**Endpoint :** `GET /api/trajets`

**Description :** Récupère tous les trajets disponibles (route publique).

**Paramètres de requête (optionnels) :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| depart | String | Filtrer par ville de départ |
| destination | String | Filtrer par ville de destination |
| dateDepart | Date | Filtrer par date de départ |
| placesMin | Number | Nombre minimum de places disponibles |

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Liste des trajets",
  "trajets": [
    { /* trajet 1 */ },
    { /* trajet 2 */ }
  ]
}
```

**Screenshot :**

![Test Liste Trajets](./captures/6.png)

---

#### 7. **Get Trajets by Depart - Filtrer par départ**

**Endpoint :** `GET /api/trajets?depart=Paris`

**Description :** Récupère les trajets partant d'une ville spécifique.

**Screenshot :**

![Test Filtre Départ](./captures/7.png)

---

#### 8. **Get Trajets by Destination - Filtrer par destination**

**Endpoint :** `GET /api/trajets?destination=Lyon`

**Description :** Récupère les trajets arrivant à une ville spécifique.

**Screenshot :**

![Test Filtre Destination](./captures/8.png)

---

#### 9. **Get Trajet by ID - Récupérer un trajet par ID**

**Endpoint :** `GET /api/trajets/:id`

**Description :** Récupère les détails d'un trajet spécifique.

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Trajet trouvé",
  "trajet": { /* détails complets */ }
}
```

**Erreurs possibles :**
- `404` - Trajet non trouvé
- `400` - ID invalide

**Screenshot :**

![Test Trajet par ID](./captures/9.png)

---

#### 10. **Update Trajet - Modifier un trajet (CONDUCTEUR)**

**Endpoint :** `PUT /api/trajets/:id`

**Description :** Permet au conducteur propriétaire de modifier son trajet.

**Headers :**
```
Content-Type: application/json
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Body (JSON) :**
```json
{
  "prix": 35,
  "description": "Trajet direct, climatisation, WiFi gratuit"
}
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Trajet mis à jour avec succès",
  "trajet": { /* trajet modifié */ }
}
```

**Erreurs possibles :**
- `403` - Accès refusé : seuls les conducteurs peuvent modifier des trajets
- `403` - Non autorisé à modifier ce trajet (pas le propriétaire)
- `404` - Trajet non trouvé

**Screenshot :**

![Test Modifier Trajet](./captures/10.png)

---

#### 11. **Book Trajet - Réserver un trajet (PASSAGER)**

**Endpoint :** `POST /api/trajets/:id/reservations`

**Description :** Permet à un passager de réserver des places sur un trajet.

**Headers :**
```
Content-Type: application/json
Authorization: Bearer [TOKEN_PASSAGER]
```

**Body (JSON) :**
```json
{
  "places": 2
}
```

**Réponse succès (201) :**
```json
{
  "success": true,
  "message": "Réservation effectuée avec succès",
  "reservation": {
    "_id": "uuid-123...",
    "passagerId": "674...",
    "passagerNom": "sara_passager",
    "places": 2,
    "dateReservation": "2025-11-25T..."
  },
  "trajet": { /* trajet avec réservation */ }
}
```

**Erreurs possibles :**
- `400` - Nombre de places invalide
- `400` - Vous avez déjà réservé ce trajet
- `400` - Seulement X place(s) disponible(s)
- `403` - Accès refusé : seuls les passagers peuvent réserver des trajets
- `404` - Trajet non trouvé

**Screenshot :**

![Test Réserver Trajet](./captures/11.png)

---

#### 12. **Book Trajet - Places non disponibles**

**Endpoint :** `POST /api/trajets/:id/reservations`

**Description :** Tentative de réservation avec plus de places que disponible.

**Erreur attendue (400) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Seulement X place(s) disponible(s)"
}
```

**Screenshot :**

![Test Réservation Places Indisponibles](./captures/12.png)

---

#### 13. **Get Mes Trajets - Trajets du conducteur (CONDUCTEUR)**

**Endpoint :** `GET /api/trajets/mes-trajets`

**Description :** Récupère les trajets créés par le conducteur connecté.

**Headers :**
```
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Vos trajets",
  "trajets": [ /* trajets créés par ce conducteur */ ]
}
```

**Erreurs possibles :**
- `403` - Accès refusé : cette fonctionnalité est réservée aux conducteurs

**Screenshot :**

![Test Mes Trajets Conducteur](./captures/13.png)

---

#### 14. **Get Mes Trajets - Refusé pour passager**

**Endpoint :** `GET /api/trajets/mes-trajets`

**Description :** Tentative d'accès par un passager (doit échouer).

**Headers :**
```
Authorization: Bearer [TOKEN_PASSAGER]
```

**Erreur attendue (403) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Accès refusé : cette fonctionnalité est réservée aux conducteurs"
}
```

**Screenshot :**

![Test Mes Trajets Passager Refusé](./captures/14.png)

---

#### 15. **Get Mes Réservations - Réservations du passager (PASSAGER)**

**Endpoint :** `GET /api/trajets/mes-reservations`

**Description :** Récupère les trajets réservés par le passager connecté.

**Headers :**
```
Authorization: Bearer [TOKEN_PASSAGER]
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Vos réservations",
  "trajets": [ /* trajets avec réservations de ce passager */ ]
}
```

**Erreurs possibles :**
- `403` - Accès refusé : cette fonctionnalité est réservée aux passagers

**Screenshot :**

![Test Mes Réservations Passager](./captures/15.png)

---

#### 16. **Get Mes Réservations - Refusé pour conducteur**

**Endpoint :** `GET /api/trajets/mes-reservations`

**Description :** Tentative d'accès par un conducteur (doit échouer).

**Headers :**
```
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Erreur attendue (403) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Accès refusé : cette fonctionnalité est réservée aux passagers"
}
```

**Screenshot :**

![Test Mes Réservations Conducteur Refusé](./captures/16.png)

---

#### 17. **Cancel Reservation - Annuler une réservation (PASSAGER)**

**Endpoint :** `DELETE /api/trajets/:trajetId/reservations/:reservationId`

**Description :** Permet au passager d'annuler sa réservation.

**Headers :**
```
Authorization: Bearer [TOKEN_PASSAGER]
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Réservation annulée avec succès"
}
```

**Erreurs possibles :**
- `403` - Accès refusé : seuls les passagers peuvent annuler des réservations
- `403` - Non autorisé à annuler cette réservation (pas le propriétaire)
- `404` - Trajet non trouvé
- `404` - Réservation non trouvée

**Screenshot :**

![Test Annuler Réservation Passager](./captures/17.png)

---

#### 18. **Cancel Reservation - Refusé pour conducteur**

**Endpoint :** `DELETE /api/trajets/:trajetId/reservations/:reservationId`

**Description :** Tentative d'annulation par un conducteur (doit échouer).

**Headers :**
```
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Erreur attendue (403) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Accès refusé : seuls les passagers peuvent annuler des réservations"
}
```

**Screenshot :**

![Test Annuler Réservation Conducteur Refusé](./captures/18.png)

---

#### 19. **Delete Trajet - Avec réservations (IMPOSSIBLE)**

**Endpoint :** `DELETE /api/trajets/:id`

**Description :** Tentative de suppression d'un trajet ayant des réservations (doit échouer).

**Headers :**
```
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Erreur attendue (400) :**
```json
{
  "message": "Erreur détectée avec le Middleware",
  "error": "Impossible de supprimer un trajet avec des réservations"
}
```

**Screenshot :**

![Test Supprimer Trajet Avec Réservations](./captures/19.png)

---

#### 20. **Delete Trajet - Sans réservations (CONDUCTEUR)**

**Endpoint :** `DELETE /api/trajets/:id`

**Description :** Suppression d'un trajet sans réservations par le conducteur propriétaire.

**Headers :**
```
Authorization: Bearer [TOKEN_CONDUCTEUR]
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Trajet supprimé avec succès"
}
```

**Erreurs possibles :**
- `403` - Accès refusé : seuls les conducteurs peuvent supprimer des trajets
- `403` - Non autorisé à supprimer ce trajet (pas le propriétaire)
- `400` - Impossible de supprimer un trajet avec des réservations
- `404` - Trajet non trouvé

**Screenshot :**

![Test Supprimer Trajet Sans Réservations](./captures/20.png)

---

#### 21. **Update Reservation - Modifier une réservation (PASSAGER)**

**Endpoint :** `PUT /api/trajets/:trajetId/reservations/:reservationId`

**Description :** Permet au passager de modifier le nombre de places de sa réservation.

**Headers :**
```
Content-Type: application/json
Authorization: Bearer [TOKEN_PASSAGER]
```

**Body (JSON) :**
```json
{
  "places": 3
}
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Réservation modifiée avec succès",
  "reservation": {
    "_id": "uuid-123...",
    "passagerId": "674...",
    "passagerNom": "sara_passager",
    "places": 3,
    "dateReservation": "2025-11-25T..."
  },
  "trajet": { /* trajet avec réservation modifiée */ }
}
```

**Erreurs possibles :**
- `400` - Nombre de places invalide
- `400` - Seulement X place(s) disponible(s) en plus
- `403` - Accès refusé : seuls les passagers peuvent modifier des réservations
- `403` - Non autorisé à modifier cette réservation (pas le propriétaire)
- `404` - Trajet non trouvé
- `404` - Réservation non trouvée

**Screenshot :**

![Test Modifier Réservation](./captures/21.png)

---

### Récapitulatif complet des endpoints

#### Authentification

| Endpoint | Méthode | Protection | Description |
|----------|---------|------------|-------------|
| `/api/auth/register` | POST | ❌ Public | Inscription |
| `/api/auth/login` | POST | ❌ Public | Connexion |
| `/api/auth/verify` | GET | ✅ Protégée | Vérification token |
| `/api/auth/logout` | POST | ✅ Protégée | Déconnexion |

#### Gestion des trajets

| Endpoint | Méthode | Protection | Rôle | Description |
|----------|---------|------------|------|-------------|
| `/api/trajets` | GET | ❌ Public | Tous | Liste des trajets avec filtres |
| `/api/trajets/:id` | GET | ❌ Public | Tous | Trajet par ID |
| `/api/trajets/mes-trajets` | GET | ✅ Protégée | Conducteur | Mes trajets créés |
| `/api/trajets/mes-reservations` | GET | ✅ Protégée | Passager | Mes réservations |
| `/api/trajets` | POST | ✅ Protégée | Conducteur | Créer un trajet |
| `/api/trajets/:id` | PUT | ✅ Protégée | Conducteur | Modifier un trajet |
| `/api/trajets/:id` | DELETE | ✅ Protégée | Conducteur | Supprimer un trajet |
| `/api/trajets/:id/reservations` | POST | ✅ Protégée | Passager | Réserver un trajet |
| `/api/trajets/:trajetId/reservations/:reservationId` | PUT | ✅ Protégée | Passager | Modifier une réservation |
| `/api/trajets/:trajetId/reservations/:reservationId` | DELETE | ✅ Protégée | Passager | Annuler une réservation |

#### Chatbot IA - Support client

| Endpoint | Méthode | Protection | Rôle | Description |
|----------|---------|------------|------|-------------|
| `/api/ai/chat` | POST | ✅ Protégée | Tous | Conversation avec le chatbot IA |

---

---

## 🎨 Interface Frontend - Application React

SmartRide dispose d'une interface utilisateur moderne et réactive développée avec **React**, offrant une expérience utilisateur fluide et intuitive pour les conducteurs et les passagers.

### Technologies Frontend utilisées

#### Framework & Bibliothèques
- **React v19.2.0** - Bibliothèque JavaScript pour la construction d'interfaces utilisateur
  - Composants fonctionnels avec Hooks
  - Gestion d'état local avec `useState`
  - Rendu conditionnel et listes dynamiques
  
- **React Router DOM v7.1.1** - Gestion du routage côté client
  - Navigation SPA (Single Page Application)
  - Routes protégées et redirection
  - Paramètres de route dynamiques
  - Navigation programmatique

#### Outils de développement
- **Vite v7.2.4** - Build tool et serveur de développement
  - Hot Module Replacement (HMR) ultra-rapide
  - Build optimisé pour la production
  - Support ESM natif
  
- **ESLint v9.39.1** - Linter pour maintenir la qualité du code
  - Règles React spécifiques
  - Hooks validation
  - Auto-fix des erreurs courantes

### Architecture du Frontend

```
frontend/
├── public/                     # Fichiers statiques publics
├── src/
│   ├── components/
│   │   ├── Auth/              # Page d'authentification
│   │   │   ├── Auth.jsx       # Composant principal (connexion/inscription)
│   │   │   └── Auth.css       # Styles de l'authentification
│   │   ├── Dashboard/         # Tableau de bord principal
│   │   │   ├── Dashboard.jsx  # Composant principal (conducteur/passager)
│   │   │   └── Dashboard.css  # Styles du tableau de bord
│   │   ├── Navigation/        # Barre de navigation
│   │   │   ├── Navigation.jsx # Menu de navigation global
│   │   │   └── Navigation.css # Styles de navigation
│   │   ├── TrajetForm/        # Formulaire de création/modification de trajet
│   │   │   ├── TrajetForm.jsx # Composant formulaire
│   │   │   └── TrajetForm.css # Styles du formulaire
│   │   └── shared/            # Composants réutilisables
│   │       ├── index.js       # Export barrel pattern
│   │       ├── Alert/         # Composant d'alerte/confirmation
│   │       │   ├── Alert.jsx
│   │       │   └── Alert.css
│   │       └── Modal/         # Composant modal générique
│   │           ├── Modal.jsx
│   │           └── Modal.css
│   ├── data/
│   │   └── mockData.js        # Données de démonstration statiques
│   ├── App.jsx                # Composant racine avec routage
│   ├── App.css                # Styles globaux de l'application
│   ├── main.jsx               # Point d'entrée React
│   └── index.css              # Styles CSS de base
├── index.html                 # Template HTML principal
├── vite.config.js             # Configuration Vite
├── eslint.config.js           # Configuration ESLint
└── package.json               # Dépendances et scripts npm
```

---

## 🧩 Composants principaux et hooks React

### 1. **App.jsx - Composant racine**

**Rôle :** Point d'entrée de l'application avec configuration du routage.

**Technologies utilisées :**
- `BrowserRouter` : Wrapper React Router pour le routage basé sur l'historique du navigateur
- `Routes` & `Route` : Déclaration des routes de l'application
- `Navigate` : Redirection programmatique

**Structure de routage :**
```javascript
Routes:
  / → Redirection vers /dashboard
  /dashboard → Dashboard (tableau de bord principal)
  /auth → Auth (connexion/inscription)
  /trajets/nouveau → TrajetForm (création de trajet)
  /trajets/modifier/:id → TrajetForm (modification de trajet avec ID dynamique)
  /profile → Dashboard (profil utilisateur)
```

**Principes appliqués :**
- ✅ **Routing déclaratif** : Routes définies de manière déclarative avec JSX
- ✅ **Redirection par défaut** : Route racine redirige vers le dashboard
- ✅ **Paramètres dynamiques** : Support des IDs dans les URLs (`/:id`)
- ✅ **Composant layout** : Navigation persistante sur toutes les pages

---

### 2. **Auth.jsx - Page d'authentification**

**Rôle :** Gère la connexion et l'inscription des utilisateurs avec validation en temps réel.

#### **Hooks useState utilisés :**

```javascript
// Gestion des modes et états
const [isLoginMode, setIsLoginMode] = useState(true);           // Basculer connexion/inscription
const [showPassword, setShowPassword] = useState(false);         // Afficher/masquer mot de passe
const [isLoading, setIsLoading] = useState(false);              // État de chargement
const [errorMessage, setErrorMessage] = useState('');           // Messages d'erreur
const [successMessage, setSuccessMessage] = useState('');       // Messages de succès

// Gestion des modales
const [showAlert, setShowAlert] = useState(false);              // Affichage des alertes
const [alertConfig, setAlertConfig] = useState({...});          // Configuration de l'alerte
const [showTermsModal, setShowTermsModal] = useState(false);    // Modal conditions générales
const [showPrivacyModal, setShowPrivacyModal] = useState(false); // Modal politique de confidentialité

// Formulaires avec objets
const [loginForm, setLoginForm] = useState({
  email: '',
  password: '',
  rememberMe: false
});

const [registerForm, setRegisterForm] = useState({
  username: '',
  email: '',
  password: '',
  role: 'passager',           // Valeur par défaut : passager
  termsAccepted: false
});

// Validation tactile (touched fields)
const [loginTouched, setLoginTouched] = useState({
  email: false,
  password: false
});

const [registerTouched, setRegisterTouched] = useState({
  username: false,
  email: false,
  password: false
});
```

#### **Hook useNavigate utilisé :**

```javascript
const navigate = useNavigate();

// Redirection après connexion réussie
setTimeout(() => {
  navigate('/dashboard');
}, 1000);
```

**Utilité :** Navigation programmatique vers le dashboard après authentification.

#### **Fonctionnalités implémentées :**

**Validation en temps réel :**
- ✅ **Validation d'email** : Regex pour vérifier le format email
- ✅ **Validation de longueur** : Username (min 3), Password (min 6)
- ✅ **Validation conditionnelle** : Affichage des erreurs uniquement si le champ a été touché
- ✅ **Validation de checkbox** : Acceptation des conditions requise pour l'inscription

**Helpers de validation :**
```javascript
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getLoginErrors = () => {
  const errors = {};
  if (!loginForm.email) errors.email = 'Email est obligatoire';
  else if (!isEmailValid(loginForm.email)) errors.email = 'Format d\'email invalide';
  if (!loginForm.password) errors.password = 'Mot de passe est obligatoire';
  return errors;
};
```

**Gestion des événements :**
- ✅ **onChange** : Mise à jour de l'état du formulaire
- ✅ **onBlur** : Marquage du champ comme "touché" pour validation
- ✅ **onSubmit** : Validation complète et soumission du formulaire

**Pattern de mise à jour d'état immutable :**
```javascript
const handleLoginChange = (e) => {
  const { name, value, type, checked } = e.target;
  setLoginForm(prev => ({
    ...prev,                                          // Spread operator : copie l'état précédent
    [name]: type === 'checkbox' ? checked : value    // Computed property : mise à jour dynamique
  }));
};
```

**Principes React appliqués :**
- ✅ **Immutabilité** : Utilisation du spread operator `...prev`
- ✅ **Computed properties** : `[name]: value` pour updates dynamiques
- ✅ **Conditional rendering** : Affichage conditionnel des erreurs avec `&&`
- ✅ **Controlled components** : Inputs contrôlés par l'état React
- ✅ **Event delegation** : Un seul handler pour tous les champs d'un formulaire

#### **Captures d'écran - Authentification**

![Page de connexion](./captures/23.png)
*Page de connexion avec validation en temps réel et gestion des erreurs*

![Page d'inscription](./captures/24.png)
*Page d'inscription avec sélection de rôle (conducteur/passager) et validation des conditions générales*

---

### 3. **Dashboard.jsx - Tableau de bord principal**

**Rôle :** Interface principale différenciée selon le rôle (conducteur/passager).

#### **Hooks useState utilisés :**

```javascript
// Données utilisateur et trajets
const [currentUser] = useState(mockUser);                      // Utilisateur connecté
const [availableRides] = useState(mockRides);                  // Trajets disponibles (passagers)
const [driverRides, setDriverRides] = useState(mockDriverRides); // Trajets du conducteur
const [userReservations, setUserReservations] = useState(mockReservations); // Réservations du passager

// Recherche de trajets
const [searchDeparture, setSearchDeparture] = useState('');    // Ville de départ
const [searchArrival, setSearchArrival] = useState('');        // Ville d'arrivée
const [searchDate, setSearchDate] = useState('');              // Date de recherche

// Gestion des modales
const [showRideDetails, setShowRideDetails] = useState(false); // Modal détails trajet
const [showConfirmation, setShowConfirmation] = useState(false); // Modal confirmation réservation
const [selectedRide, setSelectedRide] = useState(null);        // Trajet sélectionné
const [placesToReserve, setPlacesToReserve] = useState(1);     // Nombre de places à réserver

// Système d'alertes
const [showAlert, setShowAlert] = useState(false);
const [alertConfig, setAlertConfig] = useState({
  type: 'success',              // Types : 'success', 'error', 'warning', 'confirm'
  title: '',
  message: '',
  onConfirm: null,             // Callback pour confirmation
  onCancel: null               // Callback pour annulation
});
```

#### **Hook useNavigate utilisé :**

```javascript
const navigate = useNavigate();

// Navigation vers formulaire de création
const proposeRide = () => {
  navigate('/trajets/nouveau');
};

// Navigation vers formulaire de modification avec paramètre
const editRide = (ride) => {
  navigate(`/trajets/modifier/${ride.id}`);
};
```

**Utilité :** Navigation programmatique vers les formulaires avec passage de paramètres.

#### **Fonctionnalités implémentées :**

**Vue Conducteur :**
- ✅ **Gestion des trajets proposés** : Affichage, modification, suppression
- ✅ **Création de nouveaux trajets** : Bouton redirigeant vers le formulaire
- ✅ **Protection contre suppression** : Confirmation avant suppression
- ✅ **Statistiques** : Nombre de réservations par trajet

**Vue Passager :**
- ✅ **Recherche de trajets** : Filtres par départ, arrivée, date
- ✅ **Liste des trajets disponibles** : Affichage avec détails conducteur
- ✅ **Réservation de places** : Modal de confirmation avec sélection du nombre de places
- ✅ **Gestion des réservations** : Affichage et annulation des réservations existantes

**Fonctions utilitaires :**
```javascript
// Formatage de date intelligent
const getDay = (date) => new Date(date).getDate();
const getMonthName = (date) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months[new Date(date).getMonth()];
};

// Salutation contextuelle basée sur l'heure
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
};
```

**Pattern de mise à jour d'état avec filtrage :**
```javascript
// Suppression d'un trajet avec filter
const deleteRide = (ride) => {
  showCustomAlert({
    type: 'confirm',
    title: 'Supprimer le trajet',
    message: 'Êtes-vous sûr de vouloir supprimer ce trajet ?',
    onConfirm: () => {
      setDriverRides(prev => prev.filter(r => r.id !== ride.id)); // Filter immutable
      // Afficher confirmation de succès
    }
  });
};

// Annulation de réservation
const cancelReservation = (reservation) => {
  setUserReservations(prev => prev.filter(r => r.reservationId !== reservation.reservationId));
};
```

**Pattern d'ajout d'élément dans un tableau :**
```javascript
// Ajout d'une nouvelle réservation
const confirmReservation = () => {
  if (selectedRide) {
    const newReservation = {
      ...selectedRide,                    // Spread des données du trajet
      reservationId: `r${Date.now()}`,    // ID unique basé sur timestamp
      places: placesToReserve,
      reservationDate: new Date()
    };
    setUserReservations(prev => [...prev, newReservation]); // Spread pour immutabilité
  }
};
```

**Système d'alertes personnalisé :**
```javascript
const showCustomAlert = (config) => {
  setAlertConfig(config);
  setShowAlert(true);
};

// Utilisation avec callback
showCustomAlert({
  type: 'confirm',
  title: 'Confirmation',
  message: 'Voulez-vous vraiment continuer ?',
  onConfirm: () => {
    // Action à exécuter si confirmé
  },
  onCancel: () => {
    // Action à exécuter si annulé
  }
});
```

**Principes React appliqués :**
- ✅ **Conditional rendering** : Affichage différencié conducteur/passager avec opérateur ternaire
- ✅ **Array mapping** : Rendu de listes avec `.map()`
- ✅ **Event handling** : Gestion des clics avec `onClick` et `stopPropagation`
- ✅ **Lifting state up** : État partagé entre composants via props
- ✅ **Composition de composants** : Réutilisation de Modal et Alert

#### **Captures d'écran - Dashboard**

![Dashboard Conducteur - Vue 1](./captures/25.png)
*Vue conducteur : profil, statistiques et recherche de trajets*

![Dashboard Conducteur - Vue 2](./captures/26.png)
*Vue conducteur : liste des trajets proposés avec actions de modification et suppression*

![Formulaire de création de trajet](./captures/27.png)
*Formulaire de création/modification de trajet avec validation en temps réel*

![Dashboard Passager - Vue 1](./captures/28.png)
*Vue passager : recherche et liste des trajets disponibles*

![Dashboard Passager - Vue 2](./captures/29.png)
*Vue passager : mes réservations avec possibilité d'annulation*

![Modal de réservation](./captures/30.png)
*Modal de confirmation de réservation avec sélection du nombre de places*

---

### 4. **Navigation.jsx - Barre de navigation**

**Rôle :** Menu de navigation global persistant sur toutes les pages.

#### **Hooks utilisés :**

```javascript
const [isAuthenticated, setIsAuthenticated] = useState(true);  // État d'authentification
const [currentUser] = useState(mockUser);                      // Données utilisateur
const location = useLocation();                                // Hook React Router
```

#### **Hook useLocation utilisé :**

```javascript
import { useLocation } from 'react-router-dom';

const location = useLocation();

// Mise en surbrillance du lien actif
<Link 
  to="/dashboard" 
  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
>
  Accueil
</Link>
```

**Utilité :** Détecter la route active pour appliquer des styles de navigation.

**Fonctionnalités :**
- ✅ **Menu responsive** : Adaptation mobile/desktop
- ✅ **Menu déroulant utilisateur** : Profil, mes trajets, déconnexion
- ✅ **Highlight de route active** : Indicateur visuel de la page courante
- ✅ **Gestion de session** : Affichage conditionnel selon l'état d'authentification

**Principes React appliqués :**
- ✅ **Conditional rendering** : Affichage menu utilisateur ou bouton connexion
- ✅ **Dynamic className** : Classes CSS conditionnelles avec template literals
- ✅ **React Router integration** : Utilisation de `Link` et `useLocation`

---

### 5. **TrajetForm.jsx - Formulaire de trajet**

**Rôle :** Création et modification de trajets pour les conducteurs.

#### **Hooks utilisés :**

```javascript
const navigate = useNavigate();
const { id } = useParams();                                    // Hook pour récupérer paramètre URL
const isEditMode = !!id;                                       // Boolean : true si modification

const [trajet, setTrajet] = useState(() => getInitialTrajet(id)); // Lazy initialization
const [errors, setErrors] = useState([]);                      // Tableau d'erreurs de validation
const [isLoading, setIsLoading] = useState(false);            // État de soumission
const [showAlert, setShowAlert] = useState(false);
const [alertConfig, setAlertConfig] = useState({...});
```

#### **Hook useParams utilisé :**

```javascript
import { useParams } from 'react-router-dom';

const { id } = useParams();  // Extraction du paramètre :id de l'URL

// Fonction d'initialisation basée sur le paramètre
const getInitialTrajet = (id) => {
  if (id) {
    const existingTrajet = mockDriverRides.find(r => r.id === parseInt(id));
    if (existingTrajet) {
      return {
        depart: existingTrajet.departure,
        destination: existingTrajet.arrival,
        // ... mapping des données existantes
      };
    }
  }
  // Retourne un objet vide si création
  return { depart: '', destination: '', ... };
};
```

**Utilité :** Différenciation création/modification selon la présence d'un ID dans l'URL.

#### **Lazy initialization avec useState :**

```javascript
// ❌ Mauvaise pratique : fonction appelée à chaque render
const [trajet, setTrajet] = useState(getInitialTrajet(id));

// ✅ Bonne pratique : fonction appelée uniquement à l'initialisation
const [trajet, setTrajet] = useState(() => getInitialTrajet(id));
```

**Avantage :** Optimisation des performances, la fonction coûteuse n'est exécutée qu'une fois.

#### **Validation côté client :**

```javascript
const validateForm = () => {
  const newErrors = [];

  // Validation des champs requis
  if (!trajet.depart.trim()) newErrors.push('Le lieu de départ est obligatoire');
  if (!trajet.destination.trim()) newErrors.push('La destination est obligatoire');
  
  // Validation des plages de valeurs
  if (!trajet.placesDisponibles || trajet.placesDisponibles < 1 || trajet.placesDisponibles > 6) {
    newErrors.push('Le nombre de places doit être entre 1 et 6');
  }
  
  if (!trajet.prix || trajet.prix <= 0) {
    newErrors.push('Le prix doit être supérieur à 0');
  }

  // Validation de date (pas dans le passé)
  const selectedDate = new Date(trajet.dateDepart);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    newErrors.push('La date de départ ne peut pas être dans le passé');
  }

  setErrors(newErrors);
  return newErrors.length === 0;
};
```

**Gestion de soumission asynchrone simulée :**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  // Simulation d'appel API
  setTimeout(() => {
    setIsLoading(false);
    showCustomAlert(
      'success',
      isEditMode ? 'Trajet modifié !' : 'Trajet créé !',
      'Votre trajet a été publié avec succès.'
    );
  }, 1500);
};
```

**Fonctionnalités :**
- ✅ **Mode création/modification** : Un seul composant pour deux usages
- ✅ **Validation complète** : Champs requis, formats, plages de valeurs
- ✅ **Feedback utilisateur** : Affichage des erreurs et états de chargement
- ✅ **Protection date** : Empêche la sélection de dates passées avec `min={getTodayDate()}`
- ✅ **Navigation post-soumission** : Redirection vers dashboard après succès

**Principes React appliqués :**
- ✅ **Lazy initialization** : Optimisation du useState
- ✅ **useParams hook** : Récupération de paramètres d'URL
- ✅ **Form validation** : Validation avant soumission
- ✅ **Loading states** : Gestion des états asynchrones
- ✅ **Conditional UI** : Bouton et titre différents selon le mode

---

### 6. **Composants réutilisables (shared/)**

#### **Alert.jsx - Composant d'alerte/confirmation**

**Rôle :** Système d'alertes modal réutilisable pour notifications et confirmations.

```javascript
function Alert({ 
  isOpen,           // Boolean : visibilité
  onClose,          // Callback : fermeture
  onConfirm,        // Callback : confirmation (optionnel)
  type = 'success', // Type : 'success' | 'error' | 'warning' | 'confirm' | 'info'
  title,            // Titre de l'alerte
  message           // Message de l'alerte
}) {
  if (!isOpen) return null;  // Early return si fermé

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'confirm': return 'fa-question-circle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-check-circle';
    }
  };

  return (
    <div className="alert-modal">
      <div className="alert-overlay" onClick={onClose}></div>
      <div className={`alert-box alert-${type}`}>  {/* Classe dynamique */}
        <div className="alert-icon">
          <i className={`fas ${getIcon()}`}></i>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="alert-actions">
          {type === 'confirm' ? (
            <>
              <button onClick={onClose}>Annuler</button>
              <button onClick={onConfirm}>Confirmer</button>
            </>
          ) : (
            <button onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Principes appliqués :**
- ✅ **Conditional rendering** : `if (!isOpen) return null`
- ✅ **Props destructuring** : Extraction directe des props
- ✅ **Default props** : `type = 'success'`
- ✅ **Dynamic className** : Classes CSS basées sur le type
- ✅ **Event callbacks** : `onClose` et `onConfirm`

#### **Modal.jsx - Modal générique**

**Rôle :** Conteneur modal réutilisable pour tout contenu.

```javascript
function Modal({ isOpen, onClose, children, maxWidth = '650px' }) {
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  
  const stopPropagation = (e) => {
    e.stopPropagation();  // Empêche fermeture si clic sur contenu
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-backdrop" onClick={handleOverlayClick}></div>
      <div 
        className="modal-box" 
        onClick={stopPropagation}
        style={{ maxWidth }}  // Style inline dynamique
      >
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        {children}  {/* Composition de composants */}
      </div>
    </div>
  );
}
```

**Principes appliqués :**
- ✅ **Children prop** : Composition de composants
- ✅ **Event propagation** : Utilisation de `stopPropagation`
- ✅ **Inline styles** : Styles dynamiques avec props
- ✅ **Component composition** : Wrapper réutilisable

#### **Barrel exports (index.js)**

```javascript
export { default as Modal } from './Modal/Modal';
export { default as Alert } from './Alert/Alert';
```

**Avantage :** Import simplifié dans les composants :
```javascript
import { Modal, Alert } from '../shared';  // Au lieu de 2 imports séparés
```

---

## 📊 Gestion des données - mockData.js

**Rôle :** Centralisation des données de démonstration pour version statique.

**Structure des données :**

```javascript
// Utilisateur connecté
export const mockUser = {
  id: '1',
  username: 'Ahmed',
  email: 'ahmed@example.com',
  role: 'conducteur',  // Peut être basculé pour tester les vues
  rating: 4.5,
  isVerified: true
};

// Statistiques globales
export const mockStats = {
  co2Saved: 1250,      // kg de CO2 économisé
  activeUsers: 3500,   // Utilisateurs actifs
  sharedRides: 5200    // Trajets partagés
};

// Trajets disponibles (vue passager)
export const mockRides = [
  {
    id: '1',
    departure: 'Tunis',
    arrival: 'Sousse',
    date: new Date(2025, 11, 15),
    time: '08:30',
    price: 25,
    availableSeats: 3,
    driverName: 'Thomas D.',
    driverRating: 4.8,
    description: 'Départ du centre-ville...'
  },
  // ... autres trajets
];

// Trajets du conducteur
export const mockDriverRides = [ /* ... */ ];

// Réservations du passager
export const mockReservations = [ /* ... */ ];

// Témoignages
export const mockTestimonials = [ /* ... */ ];

// Helper : formatage de date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

**Avantages de cette approche :**
- ✅ **Séparation des préoccupations** : Données isolées de la logique UI
- ✅ **Testabilité** : Facile de tester l'UI avec différentes données
- ✅ **Maintenance** : Un seul fichier à modifier pour changer les données
- ✅ **Type safety** : Structure cohérente pour tous les composants

---

## 🎨 Principes CSS et Design

### Architecture CSS

**Convention de nommage :** BEM-like (Block Element Modifier)

```css
/* Block */
.dashboard-container { }

/* Element */
.dashboard-container__header { }

/* Modifier */
.dashboard-container--loading { }
```

### Responsive Design

- ✅ **Mobile-first approach** : Styles de base pour mobile, media queries pour desktop
- ✅ **Flexbox et Grid** : Layouts modernes et flexibles
- ✅ **CSS Variables** : Thème centralisé pour cohérence visuelle

### Animations et transitions

```css
/* Transitions douces */
transition: all 0.3s ease;

/* Hover effects */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Loading spinners */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 🚀 Installation et démarrage

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (Atlas recommandé)
- npm ou yarn
- Docker et Docker Compose (optionnel, recommandé)

---

### 🐳 Installation avec Docker (Recommandé)

La méthode la plus simple pour lancer l'application complète :

1. **Cloner le repository**
```bash
git clone https://github.com/abderrahmenyoussef/SmartRide.git
cd SmartRide
```

2. **Configurer les variables d'environnement**

Créer un fichier `.env` dans le dossier `Backend/` :
```env
PORT=your_desired_port_number
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_secure_jwt_secret_key_here
OPENROUTER_URL=your_openrouter_endpoint
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name_here
```

3. **Construire et lancer les containers**
```bash
docker compose build
docker compose up -d
```

4. **Accéder à l'application**
- 🌐 **Frontend** : http://localhost:5173
- 🔌 **Backend API** : http://localhost:3000

5. **Commandes Docker utiles**
```bash
docker compose logs -f      # Voir les logs en temps réel
docker compose ps           # Vérifier le statut des containers
docker compose down         # Arrêter les containers
docker compose build --no-cache  # Reconstruire les images
```

---

### 💻 Installation Manuelle

#### Installation Backend

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
PORT=your_desired_port_number
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=development
OPENROUTER_URL=your_openrouter_endpoint
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name_here
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

#### Installation Frontend

1. **Naviguer vers le dossier frontend**
```bash
cd ../frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement Vite**
```bash
npm run dev
```

L'application frontend démarre sur `http://localhost:5173`

**Autres commandes disponibles :**
```bash
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Linter le code
```

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
✅ **Séparation stricte des rôles** (conducteur/passager)  
✅ **Validation des permissions** sur chaque opération  
✅ **Protection contre les réservations multiples** sur le même trajet  
✅ **Vérification des places disponibles** avant réservation  

---

## 📄 Licence

Ce projet est développé à des fins éducatives.

