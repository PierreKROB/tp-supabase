# 📝 TP Posts & Comments

Application web permettant à des utilisateurs authentifiés de créer des posts et des commentaires en temps réel, avec gestion des permissions par rôle (admin).

## 🚀 Fonctionnalités

- ✅ **Authentification** : Inscription et connexion via Supabase Auth
- ✅ **Posts & Commentaires** : Création et lecture en temps réel
- ✅ **Permissions par rôle** :
  - Lecture publique (tout le monde)
  - Création réservée aux utilisateurs connectés
  - Suppression réservée aux admins (`@admin.mydomain.com`)
- ✅ **Temps réel** : Mise à jour automatique sans rafraîchissement (Supabase Realtime)
- ✅ **Statistiques** : Nombre de posts, commentaires, moyennes par utilisateur/post
- ✅ **UI moderne** : Hero UI + Tailwind CSS 4

## 📦 Stack technique

- **Frontend** : React 19 + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **UI** : Hero UI + Tailwind CSS 4
- **Router** : React Router 7
- **Hébergement** : GitHub Pages

## 🛠️ Installation locale

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd tp-posts-comments
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

Créer un fichier `.env` à la racine (copier depuis `.env.example`) :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

🔗 Récupérez vos clés sur : [Supabase Dashboard → Settings → API](https://app.supabase.com/project/_/settings/api)

### 4. Créer les tables dans Supabase

Allez dans **SQL Editor** et exécutez :

```sql
-- Table posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table comments
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "posts_read" ON posts FOR SELECT USING (true);
CREATE POLICY "comments_read" ON comments FOR SELECT USING (true);

-- Création réservée aux utilisateurs authentifiés
CREATE POLICY "posts_insert" ON posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_insert" ON comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Suppression réservée aux admins
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%@admin.mydomain.com'
);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%@admin.mydomain.com'
);
```

### 5. Créer la vue pour les utilisateurs

Dans **SQL Editor**, exécutez :

```sql
-- Créer une vue pour exposer les emails des utilisateurs
CREATE OR REPLACE VIEW public.users AS
SELECT id, email
FROM auth.users;

-- Donner les permissions de lecture
GRANT SELECT ON public.users TO anon, authenticated;
```

### 6. Activer le Realtime

Dans **SQL Editor**, exécutez :

```sql
-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
```

### 7. Désactiver la confirmation d'email (optionnel, pour le développement)

**Authentication → Providers → Email** → Désactivez **"Confirm email"** → Save

### 8. Lancer en local

```bash
npm run dev
```

➡️ Ouvrir [http://localhost:5173](http://localhost:5173)

## 🌐 Déploiement sur GitHub Pages

### 1. Créer et pusher sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/tp-posts-comments.git
git push -u origin main
```

### 2. Configurer GitHub Pages

Sur GitHub.com, dans votre repo :
- **Settings → Pages**
- **Source** : Sélectionnez **GitHub Actions**

### 3. Ajouter les secrets Supabase

**Settings → Secrets and variables → Actions → New repository secret**

Créez 2 secrets :
- Nom : `VITE_SUPABASE_URL`
  - Valeur : Votre URL Supabase (depuis `.env`)
- Nom : `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - Valeur : Votre clé anon Supabase (depuis `.env`)

### 4. Vérifier vite.config.js

Assurez-vous que la `base` correspond au nom de votre repo :

```js
base: process.env.NODE_ENV === 'production' ? '/tp-posts-comments/' : '/',
```

⚠️ Si votre repo a un nom différent, modifiez `/tp-posts-comments/` en conséquence.

### 5. Déclencher le déploiement

Le workflow GitHub Actions se lance automatiquement à chaque push sur `main`.

**Onglet Actions** sur GitHub → Vérifiez que le workflow est vert ✅

Votre site sera disponible sur :
`https://VOTRE-USERNAME.github.io/tp-posts-comments/`

## 👤 Test avec un compte admin

Pour tester les fonctionnalités admin (supprimer posts/comments), créez un compte avec un email se terminant par `@admin.mydomain.com`.

**Exemple** : `test@admin.mydomain.com`

## 📊 Barème du TP (17 points)

- ✅ Tables avec relations (1pt)
- ✅ Lien avec auth.users (1pt)
- ✅ RLS lecture publique / écriture auth (2pts)
- ✅ RLS suppression admins (2pts)
- ✅ Frontend complet (4pts)
- ✅ Realtime (2pts)
- ✅ Page stats (3pts)
- ✅ Hébergement (2pts)

## 📝 Licence

MIT

