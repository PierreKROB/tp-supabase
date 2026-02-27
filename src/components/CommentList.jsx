import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getComments, deleteComment } from '../services/comments'
import { Button, Spinner } from '@heroui/react'
import { Trash2 } from 'lucide-react'

export default function CommentList({ postId, isAdmin }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    const { data } = await getComments(postId)
    setComments(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()

    const channel = supabase
      .channel(`comments-${postId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`
      }, fetchComments)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [postId])

  if (loading) return (
    <div className="flex justify-center py-2">
      <Spinner size="sm" />
    </div>
  )

  return (
    <div className="flex flex-col gap-2 mb-3">
      {comments.length === 0 && (
        <p className="text-default-400 text-sm">Aucun commentaire.</p>
      )}
      {comments.map(comment => (
        <div key={comment.id} className="flex justify-between items-start bg-default-50 rounded-lg px-3 py-2">
          <div className="flex-1">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-default-400 mt-1">{comment.author?.email} · {new Date(comment.created_at).toLocaleDateString()}</p>
          </div>
          {isAdmin && (
            <Button 
              color="danger" 
              variant="light" 
              size="sm" 
              isIconOnly
              onPress={async () => {
                await deleteComment(comment.id)
                fetchComments()
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}