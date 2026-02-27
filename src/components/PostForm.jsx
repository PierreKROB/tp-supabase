import { useState } from 'react'
import { Button, Input, TextArea, TextField, Label, Card } from '@heroui/react'
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
        <TextField value={title} onChange={setTitle}>
          <Label>Titre</Label>
          <Input placeholder="Titre du post" />
        </TextField>
        <TextField value={content} onChange={setContent}>
          <Label>Contenu</Label>
          <TextArea placeholder="Écrivez votre post..." rows={3} />
        </TextField>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button color="primary" onPress={handleSubmit} isLoading={loading}>
          Publier
        </Button>
      </Card.Content>
    </Card>
  )
}