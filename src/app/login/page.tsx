import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative p-4 overflow-hidden">
      <div className="relative z-10 w-full flex justify-center animate-fade-in-up">
        <LoginForm />
      </div>
    </div>
  );
}
