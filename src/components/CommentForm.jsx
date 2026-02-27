import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { createComment } from '../services/comments'

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
    <div className="flex gap-2 items-end mt-2">
      <Input
        placeholder="Ajouter un commentaire..."
        value={content}
        onValueChange={setContent}
        size="sm"
        className="flex-1"
      />
      <Button color="primary" size="sm" onPress={handleSubmit} isLoading={loading}>
        Envoyer
      </Button>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}