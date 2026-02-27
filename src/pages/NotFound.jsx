import { useNavigate } from 'react-router'
import { Button, Card } from '@heroui/react'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md">
        <Card.Content className="flex flex-col items-center gap-4 py-8 px-6 text-center">
          <div className="p-4 bg-danger-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-danger" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Page non trouvée</h2>
          <p className="text-default-500">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button 
            color="primary" 
            onPress={() => navigate('/')}
            startContent={<Home className="w-4 h-4" />}
          >
            Retour à l'accueil
          </Button>
        </Card.Content>
      </Card>
    </div>
  )
}
