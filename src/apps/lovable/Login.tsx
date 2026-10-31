import ModelLoginPage from '../../ModelLoginPage'
import { LovableIcon } from '../../ModelIcons'

export default function LovableLogin() {
  return (
    <ModelLoginPage
      modelName="Lovable"
      provider="Lovable AI"
      route="/lovable/login"
      accentColor="#EC4899"
      icon={<LovableIcon width={28} height={28} />}
      description="The Lovable-powered Brightloop experience. Rapid full-stack application development with instant responsive design and reactive workflows."
    />
  )
}
