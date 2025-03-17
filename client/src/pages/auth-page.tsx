import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertUser, insertUserSchema } from "@shared/schema";
import { LoginData, loginSchema } from "@shared/schema"; //Import the new schema and type
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/ui/logo";
import { Checkbox } from "@/components/ui/checkbox";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome to Spiral
            </h1>
            <p className="text-sm text-muted-foreground">
              Spiral learning like your medical school never did
            </p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id="remember-me"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="translate-y-[0px]"
                          />
                        </FormControl>
                        <label
                          htmlFor="remember-me"
                          className="text-sm cursor-pointer select-none flex items-center translate-y-[0px]"
                        >
                          Keep me logged in
                        </label>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate(data)
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden md:block bg-gradient-to-br from-purple-600 via-blue-600 to-blue-500 p-8">
        <div className="h-full flex flex-col items-center justify-center text-white space-y-8">
          <svg
            viewBox="0 0 48 48"
            className="w-24 h-24"
          >
            <g stroke="currentColor" strokeWidth="0.75" fill="none">
              {/* Center to top branches */}
              <line x1="24" y1="24" x2="24" y2="8" />
              <line x1="24" y1="8" x2="20" y2="4" />
              <line x1="24" y1="8" x2="28" y2="4" />

              {/* Center to bottom branches */}
              <line x1="24" y1="24" x2="24" y2="40" />
              <line x1="24" y1="40" x2="20" y2="44" />
              <line x1="24" y1="40" x2="28" y2="44" />

              {/* Center to left branches */}
              <line x1="24" y1="24" x2="8" y2="24" />
              <line x1="8" y1="24" x2="4" y2="20" />
              <line x1="8" y1="24" x2="4" y2="28" />

              {/* Center to right branches */}
              <line x1="24" y1="24" x2="40" y2="24" />
              <line x1="40" y1="24" x2="44" y2="20" />
              <line x1="40" y1="24" x2="44" y2="28" />

              {/* Diagonal branches top-left */}
              <line x1="24" y1="24" x2="16" y2="16" />
              <line x1="16" y1="16" x2="12" y2="16" />
              <line x1="16" y1="16" x2="16" y2="12" />

              {/* Diagonal branches top-right */}
              <line x1="24" y1="24" x2="32" y2="16" />
              <line x1="32" y1="16" x2="32" y2="12" />
              <line x1="32" y1="16" x2="36" y2="16" />

              {/* Diagonal branches bottom-left */}
              <line x1="24" y1="24" x2="16" y2="32" />
              <line x1="16" y1="32" x2="16" y2="36" />
              <line x1="16" y1="32" x2="12" y2="32" />

              {/* Diagonal branches bottom-right */}
              <line x1="24" y1="24" x2="32" y2="32" />
              <line x1="32" y1="32" x2="32" y2="36" />
              <line x1="32" y1="32" x2="36" y2="32" />

              {/* Connection dots */}
              <circle cx="24" cy="24" r="1" fill="currentColor" />

              {/* Main branch points */}
              <circle cx="24" cy="8" r="0.75" fill="currentColor" />
              <circle cx="24" cy="40" r="0.75" fill="currentColor" />
              <circle cx="8" cy="24" r="0.75" fill="currentColor" />
              <circle cx="40" cy="24" r="0.75" fill="currentColor" />
              <circle cx="16" cy="16" r="0.75" fill="currentColor" />
              <circle cx="32" cy="16" r="0.75" fill="currentColor" />
              <circle cx="16" cy="32" r="0.75" fill="currentColor" />
              <circle cx="32" cy="32" r="0.75" fill="currentColor" />

              {/* End points */}
              <circle cx="20" cy="4" r="0.5" fill="currentColor" />
              <circle cx="28" cy="4" r="0.5" fill="currentColor" />
              <circle cx="20" cy="44" r="0.5" fill="currentColor" />
              <circle cx="28" cy="44" r="0.5" fill="currentColor" />
              <circle cx="4" cy="20" r="0.5" fill="currentColor" />
              <circle cx="4" cy="28" r="0.5" fill="currentColor" />
              <circle cx="44" cy="20" r="0.5" fill="currentColor" />
              <circle cx="44" cy="28" r="0.5" fill="currentColor" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              <circle cx="16" cy="12" r="0.5" fill="currentColor" />
              <circle cx="32" cy="12" r="0.5" fill="currentColor" />
              <circle cx="36" cy="16" r="0.5" fill="currentColor" />
              <circle cx="12" cy="32" r="0.5" fill="currentColor" />
              <circle cx="16" cy="36" r="0.5" fill="currentColor" />
              <circle cx="32" cy="36" r="0.5" fill="currentColor" />
              <circle cx="36" cy="32" r="0.5" fill="currentColor" />
            </g>
          </svg>
          <div className="space-y-4 text-center max-w-md">
            <h2 className="text-2xl font-bold">Revolutionary Medical Learning</h2>
            <p>
              Welcome to Spiral, the world's first evidence-based AI working companion tool to help you smash medical school.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}