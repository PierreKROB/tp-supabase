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

### 5. Activer le Realtime

Dans **Database → Replication**, activez :
- ✅ `posts`
- ✅ `comments`

### 6. Lancer en local

```bash
npm run dev
```

➡️ Ouvrir [http://localhost:5173](http://localhost:5173)

## 🌐 Déploiement sur GitHub Pages

### 1. Configurer le repo GitHub

Dans **Settings → Pages** :
- Source : **GitHub Actions**

### 2. Ajouter les secrets

Dans **Settings → Secrets and variables → Actions**, créez :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### 3. Modifier la base URL

Dans `vite.config.js`, remplacez `/tp-posts-comments/` par le nom de votre repo :

```js
base: process.env.NODE_ENV === 'production' ? '/votre-nom-de-repo/' : '/',
```

### 4. Pusher sur GitHub

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Le workflow se lance automatiquement et déploie sur :
`https://votre-username.github.io/votre-repo/`

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

