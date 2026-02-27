import { useState } from 'react'
import { supabase } from '../supabase'
import { Button, Input, Tabs, TextField, Label, Card } from '@heroui/react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const fields = (
    <div className="flex flex-col gap-4 mt-4">
      <TextField value={email} onChange={setEmail}>
        <Label>Email</Label>
        <Input placeholder="vous@example.com" type="email" />
      </TextField>
      <TextField value={password} onChange={setPassword}>
        <Label>Mot de passe</Label>
        <Input placeholder="••••••••" type="password" />
      </TextField>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md">
        <Card>
          <Card.Header>
            <Card.Title>Bienvenue</Card.Title>
            <Card.Description>Connectez-vous ou créez un compte</Card.Description>
          </Card.Header>
          <Card.Content>
            <Tabs.Root defaultSelectedKey="signin">
              <Tabs.List>
                <Tabs.Tab id="signin">Connexion<Tabs.Indicator /></Tabs.Tab>
                <Tabs.Tab id="signup">Inscription<Tabs.Indicator /></Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel id="signin">
                {fields}
                <Button className="mt-4 w-full" color="primary" onPress={handleSignIn} isLoading={loading}>
                  Se connecter
                </Button>
              </Tabs.Panel>
              <Tabs.Panel id="signup">
                {fields}
                <Button className="mt-4 w-full" color="primary" onPress={handleSignUp} isLoading={loading}>
                  S'inscrire
                </Button>
              </Tabs.Panel>
            </Tabs.Root>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}