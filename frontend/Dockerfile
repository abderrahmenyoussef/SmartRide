# Étape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Variables d'environnement pour optimiser le build
ENV NODE_ENV=development

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation
COPY package*.json ./

# Installer TOUTES les dépendances (y compris devDependencies pour le build)
RUN npm ci && \
    npm cache clean --force

# Copier le reste du code source
COPY . .

# Compiler l'application React (production build)
RUN npm run build

# Étape 2 : Déploiement via Nginx
FROM nginx:alpine

# Nettoyer et sécuriser l'image finale
RUN rm -rf /var/cache/apk/* && \
    adduser -D -H -u 1001 frontenduser && \
    chown -R frontenduser:frontenduser /var/cache/nginx && \
    chown -R frontenduser:frontenduser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R frontenduser:frontenduser /var/run/nginx.pid

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés du builder vers nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Changer les permissions des fichiers statiques
RUN chown -R frontenduser:frontenduser /usr/share/nginx/html

# Utiliser un utilisateur non-root pour la sécurité
USER frontenduser

# Exposer le port 80
EXPOSE 80

# Healthcheck pour vérifier que nginx fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Lancer nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
