# Étape 1 : Build et installation des dépendances
FROM node:20-alpine AS builder

# Variables d'environnement
ENV NODE_ENV=production

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --only=production && \
    npm cache clean --force

# Copier le reste du code source
COPY . .

# Étape 2 : Image de production minimale
FROM node:20-alpine AS production

# Installer dumb-init pour une meilleure gestion des signaux
RUN apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Variables d'environnement
ENV NODE_ENV=production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S backendgroup && \
    adduser -S -D -H -u 1001 -G backendgroup backenduser

# Répertoire de travail
WORKDIR /app

# Copier les fichiers depuis le builder avec les bonnes permissions
COPY --from=builder --chown=backenduser:backendgroup /app/node_modules ./node_modules
COPY --chown=backenduser:backendgroup . .

# Supprimer les fichiers inutiles pour réduire la taille
RUN rm -rf .git .gitignore *.md .env.example tests __tests__ coverage

# Utiliser l'utilisateur non-root
USER backenduser

# Exposer le port de l'API
EXPOSE 3000

# Healthcheck pour vérifier que le serveur fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Utiliser dumb-init comme entrypoint pour une meilleure gestion des processus
ENTRYPOINT ["dumb-init", "--"]

# Commande pour démarrer l'application
CMD ["node", "server.js"]
