import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getPosts, deletePost } from '../services/posts'
import PostForm from '../components/PostForm'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'
import { Button, Card, Spinner } from '@heroui/react'
import { MessageSquare, Trash2, LogIn } from 'lucide-react'

export default function PostList({ session, isAdmin }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openPostId, setOpenPostId] = useState(null)

  // Debug : afficher l'état admin
  console.log('🔍 Debug:', { 
    email: session?.user?.email, 
    isAdmin, 
    shouldBeAdmin: session?.user?.email?.endsWith('@admin.mydomain.com')
  })

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
      {session && <PostForm session={session} />}
      <div className="flex flex-col gap-4">
        {posts.length === 0 && <p className="text-center text-gray-400">Aucun post pour l'instant.</p>}
        {posts.map(post => (
          <Card key={post.id}>
            <Card.Content className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{post.author?.email} · {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button 
                      color="danger" 
                      variant="ghost" 
                      size="sm" 
                      isIconOnly
                      onPress={async () => {
                        await deletePost(post.id)
                        fetchPosts()
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onPress={() => setOpenPostId(openPostId === post.id ? null : post.id)}
                    startContent={<MessageSquare className="w-4 h-4" />}
                  >
                    {openPostId === post.id ? 'Masquer' : 'Voir'}
                  </Button>
                </div>
              </div>
              <p className="mt-2">{post.content}</p>
              {openPostId === post.id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Commentaires
                  </h4>
                  <CommentList postId={post.id} isAdmin={isAdmin} />
                  {session ? (
                    <CommentForm postId={post.id} session={session} />
                  ) : (
                    <div className="text-center py-3 bg-default-100 rounded-lg">
                      <p className="text-sm text-default-500 mb-2">
                        Connectez-vous pour commenter
                      </p>
                      <Button 
                        color="primary" 
                        size="sm" 
                        variant="flat"
                        onPress={() => window.location.href = '/login'}
                        startContent={<LogIn className="w-4 h-4" />}
                      >
                        Se connecter
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  )
}