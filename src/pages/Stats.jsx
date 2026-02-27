import { useState, useEffect } from 'react'
import { getStats } from '../services/stats'
import { Card, Spinner } from '@heroui/react'

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center mt-16"><Spinner size="lg" /></div>

  const items = [
    { label: 'Total de posts', value: stats.totalPosts, emoji: '📝' },
    { label: 'Total de commentaires', value: stats.totalComments, emoji: '💬' },
    { label: 'Moyenne commentaires / post', value: stats.avgCommentsPerPost, emoji: '📊' },
    { label: 'Utilisateurs actifs', value: stats.uniqueUsers, emoji: '👤' },
    { label: 'Moyenne posts / utilisateur', value: stats.avgPostsPerUser, emoji: '📈' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Statistiques</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => (
          <Card key={item.label}>
            <Card.Content className="flex flex-row items-center gap-4 py-5">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <p className="text-gray-400 text-sm">{item.label}</p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  )
}