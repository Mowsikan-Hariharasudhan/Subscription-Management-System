import ModelLoginPage from '../../ModelLoginPage'
import { DeepSeekIcon } from '../../ModelIcons'

export default function DeepSeekLogin() {
  return (
    <ModelLoginPage
      modelName="DeepSeek"
      provider="DeepSeek AI"
      route="/deepseek/login"
      accentColor="#4460F1"
      icon={<DeepSeekIcon width={28} height={28} />}
      description="The DeepSeek-powered Brightloop experience. An ultra-dense quantitative terminal design built for data-heavy subscription operations."
    />
  )
}
