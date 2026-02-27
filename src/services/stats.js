import { supabase } from '../supabase'

export const getStats = async () => {
  const { data: posts } = await supabase.from('posts').select('id, user_id')
  const { data: comments } = await supabase.from('comments').select('id, post_id')

  const totalPosts = posts?.length ?? 0
  const totalComments = comments?.length ?? 0
  const avgCommentsPerPost = totalPosts ? (totalComments / totalPosts).toFixed(2) : 0

  const uniqueUsers = new Set(posts?.map(p => p.user_id)).size
  const avgPostsPerUser = uniqueUsers ? (totalPosts / uniqueUsers).toFixed(2) : 0

  return { totalPosts, totalComments, avgCommentsPerPost, avgPostsPerUser, uniqueUsers }
}