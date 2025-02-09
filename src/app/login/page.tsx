import { LoginSection } from "./components/login-section"
import { Background } from "./components/background"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Background />
      <LoginSection />
    </main>
  )
}
