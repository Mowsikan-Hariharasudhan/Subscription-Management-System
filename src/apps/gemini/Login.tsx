import ModelLoginPage from '../../ModelLoginPage'
import { GeminiIcon } from '../../ModelIcons'

export default function GeminiLogin() {
  return (
    <ModelLoginPage
      modelName="Gemini"
      provider="Google"
      route="/gemini/login"
      accentColor="#1a73e8"
      icon={<GeminiIcon width={28} height={28} />}
      description="The Gemini-powered Brightloop experience. A kinetic structural brutalist layout with bold information architecture and premium visual rhythm."
    />
  )
}
