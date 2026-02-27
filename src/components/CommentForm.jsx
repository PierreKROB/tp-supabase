import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { createComment } from '../services/comments'
import { Send } from 'lucide-react'

export default function CommentForm({ postId, session }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await createComment(content, postId, session.user.id)
    if (error) setError(error.message)
    else setContent('')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Ajouter un commentaire..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          size="sm"
          className="flex-1"
        />
        <Button 
          color="primary" 
          size="sm" 
          onPress={handleSubmit} 
          isLoading={loading}
          isIconOnly
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}