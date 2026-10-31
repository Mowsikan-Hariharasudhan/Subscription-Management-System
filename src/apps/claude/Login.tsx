import ModelLoginPage from '../../ModelLoginPage'
import { ClaudeIcon } from '../../ModelIcons'

export default function ClaudeLogin() {
  return (
    <ModelLoginPage
      modelName="Claude"
      provider="Anthropic"
      route="/claude/login"
      accentColor="#d97706"
      icon={<ClaudeIcon width={28} height={28} />}
      description="The Claude-powered Brightloop experience. An editorial corporate monochrome design with refined typography and thoughtful information hierarchy."
    />
  )
}
