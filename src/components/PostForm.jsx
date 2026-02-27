import { useState } from 'react'
import { Button, Input, TextArea, Card } from '@heroui/react'
import { createPost } from '../services/posts'
import { uploadImage } from '../services/images'
import { Image, X } from 'lucide-react'

export default function PostForm({ session }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError(null)
    
    let imageUrl = null
    
    if (imageFile) {
      const { data, error: uploadError } = await uploadImage(imageFile, session.user.id)
      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }
      imageUrl = data.url
    }
    
    const { error } = await createPost(title, content, session.user.id, imageUrl)
    if (error) setError(error.message)
    else { 
      setTitle('')
      setContent('')
      removeImage()
    }
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
        
        {/* Upload image */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Image (optionnel)</label>
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-danger rounded-full text-white hover:bg-danger/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary hover:bg-default-50 transition-colors">
              <Image className="w-8 h-8 text-default-400 mb-2" />
              <span className="text-sm text-default-500">Cliquez pour ajouter une image</span>
              <span className="text-xs text-default-400 mt-1">PNG, JPG max 5MB</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button color="primary" onPress={handleSubmit} isLoading={loading}>
          Publier
        </Button>
      </Card.Content>
    </Card>
  )
}