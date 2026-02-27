import { supabase } from '../supabase'

export const uploadImage = async (file, userId) => {
  if (!file) return { data: null, error: null }

  // Vérifier le type de fichier
  if (!file.type.startsWith('image/')) {
    return { data: null, error: new Error('Le fichier doit être une image') }
  }

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { data: null, error: new Error('L\'image ne doit pas dépasser 5MB') }
  }

  // Créer un nom unique
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) return { data: null, error }

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName)

  return { data: { path: fileName, url: publicUrl }, error: null }
}

export const deleteImage = async (path) => {
  if (!path) return { error: null }

  const { error } = await supabase.storage
    .from('post-images')
    .remove([path])

  return { error }
}
