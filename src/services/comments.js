import { supabase } from '../supabase'

export const getComments = (post_id) =>
  supabase.from('comments').select('*, author:users!user_id(email)').eq('post_id', post_id).order('created_at', { ascending: true })

export const createComment = (content, post_id, user_id) =>
  supabase.from('comments').insert({ content, post_id, user_id })

export const deleteComment = (id) =>
  supabase.from('comments').delete().eq('id', id)