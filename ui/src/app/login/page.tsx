import { LoginForm } from "@/components/login-form"
import DotGridBackground from "@/components/ui/background"

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute inset-0 z-0 from-[#513d9b]">
        <DotGridBackground />
      </div>
      <div className="w-full max-w-sm z-10">
        <LoginForm />
      </div>
    </div>
  )
}
