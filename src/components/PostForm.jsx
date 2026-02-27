import { useState } from 'react'
import { Button, Input, TextArea, Card } from '@heroui/react'
import { createPost } from '../services/posts'

export default function PostForm({ session }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await createPost(title, content, session.user.id)
    if (error) setError(error.message)
    else { setTitle(''); setContent('') }
    setLoading(false)
  }

  return (
    <Card className="mb-6">
      <Card.Header>
        <Card.Title>Nouveau post</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Titre</label>
          <Input 
            placeholder="Titre du post" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Contenu</label>
          <TextArea 
            placeholder="Écrivez votre post..." 
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button color="primary" onPress={handleSubmit} isLoading={loading}>
          Publier
        </Button>
      </Card.Content>
    </Card>
  )
}