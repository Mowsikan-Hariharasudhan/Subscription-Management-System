import ModelLoginPage from '../../ModelLoginPage'
import { ChatGPTIcon } from '../../ModelIcons'

export default function ChatGPTLogin() {
  return (
    <ModelLoginPage
      modelName="ChatGPT"
      provider="OpenAI"
      route="/chatgpt/login"
      accentColor="#10a37f"
      icon={<ChatGPTIcon width={28} height={28} />}
      description="The ChatGPT-powered Brightloop experience. A high-contrast Swiss grid layout designed for clarity, density, and enterprise-grade usability."
    />
  )
}
