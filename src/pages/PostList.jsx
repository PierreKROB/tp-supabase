import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getPosts, deletePost } from '../services/posts'
import PostForm from '../components/PostForm'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'
import { Button, Card, Spinner } from '@heroui/react'
import { MessageSquare, Trash2, LogIn, X } from 'lucide-react'

export default function PostList({ session, isAdmin }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openPostId, setOpenPostId] = useState(null)
  const [commentCounts, setCommentCounts] = useState({})
  const [lightboxImage, setLightboxImage] = useState(null)

  const fetchPosts = async () => {
    const { data } = await getPosts()
    setPosts(data ?? [])
    
    if (data) {
      const counts = {}
      await Promise.all(
        data.map(async (post) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
          counts[post.id] = count || 0
        })
      )
      setCommentCounts(counts)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchPosts)
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
                  <p className="text-gray-400 text-xs mt-1">{post.author_email || post.author?.email} · {new Date(post.created_at).toLocaleDateString()}</p>
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
                  <button 
                    onClick={() => setOpenPostId(openPostId === post.id ? null : post.id)}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-default-100 dark:hover:bg-default-50 transition-colors group border border-transparent hover:border-default-200"
                  >
                    <MessageSquare className="w-4 h-4 text-default-500 group-hover:text-primary transition-colors" />
                    {commentCounts[post.id] !== undefined && (
                      <span className={
                        commentCounts[post.id] > 0 
                          ? "text-sm font-bold text-primary" 
                          : "text-sm text-default-400"
                      }>
                        {commentCounts[post.id]}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="mt-3 w-full max-h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setLightboxImage(post.image_url)}
                />
              )}
              
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
      
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Agrandir"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}