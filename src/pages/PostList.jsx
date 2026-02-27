import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getPosts, deletePost } from '../services/posts'
import PostForm from '../components/PostForm'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'
import { Button, Card, Spinner } from '@heroui/react'

export default function PostList({ session, isAdmin }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openPostId, setOpenPostId] = useState(null)

  const fetchPosts = async () => {
    const { data } = await getPosts()
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  if (loading) return <div className="flex justify-center mt-16"><Spinner size="lg" /></div>

  return (
    <div>
      <PostForm session={session} />
      <div className="flex flex-col gap-4">
        {posts.length === 0 && <p className="text-center text-gray-400">Aucun post pour l'instant.</p>}
        {posts.map(post => (
          <Card key={post.id}>
            <Card.Content className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-gray-400 text-xs">{post.author?.email} · {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button color="danger" variant="ghost" size="sm" onPress={() => deletePost(post.id)}>
                      Supprimer
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onPress={() => setOpenPostId(openPostId === post.id ? null : post.id)}>
                    {openPostId === post.id ? 'Masquer' : 'Commentaires'}
                  </Button>
                </div>
              </div>
              <p>{post.content}</p>
              {openPostId === post.id && (
                <div className="mt-2 border-t pt-3">
                  <CommentList postId={post.id} isAdmin={isAdmin} />
                  <CommentForm postId={post.id} session={session} />
                </div>
              )}
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  )
}