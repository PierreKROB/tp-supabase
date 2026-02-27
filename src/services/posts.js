import { supabase } from '../supabase'

export const getPosts = () =>
  supabase.from('posts').select('*, author:users!user_id(email)').order('created_at', { ascending: false })

export const createPost = (title, content, user_id) =>
  supabase.from('posts').insert({ title, content, user_id })

export const deletePost = (id) =>
  supabase.from('posts').delete().eq('id', id)