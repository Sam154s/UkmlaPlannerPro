import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertUser, insertUserSchema } from "@shared/schema";
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

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
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
              Welcome to Helix
            </h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent medical learning companion
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
            {/* Central point to all paths */}
            <g stroke="currentColor" strokeWidth="1" fill="none">
              {/* Level 1 - Primary branches */}
              <line x1="24" y1="24" x2="8" y2="14" />
              <line x1="24" y1="24" x2="40" y2="14" />
              <line x1="24" y1="24" x2="8" y2="34" />
              <line x1="24" y1="24" x2="40" y2="34" />

              {/* Level 2 - Secondary branches (top) */}
              <line x1="8" y1="14" x2="4" y2="8" />
              <line x1="8" y1="14" x2="12" y2="8" />
              <line x1="40" y1="14" x2="36" y2="8" />
              <line x1="40" y1="14" x2="44" y2="8" />

              {/* Level 2 - Secondary branches (bottom) */}
              <line x1="8" y1="34" x2="4" y2="40" />
              <line x1="8" y1="34" x2="12" y2="40" />
              <line x1="40" y1="34" x2="36" y2="40" />
              <line x1="40" y1="34" x2="44" y2="40" />

              {/* Connection dots */}
              <circle cx="24" cy="24" r="1.5" fill="currentColor" />
              <circle cx="8" cy="14" r="1" fill="currentColor" />
              <circle cx="40" cy="14" r="1" fill="currentColor" />
              <circle cx="8" cy="34" r="1" fill="currentColor" />
              <circle cx="40" cy="34" r="1" fill="currentColor" />
              <circle cx="4" cy="8" r="0.8" fill="currentColor" />
              <circle cx="12" cy="8" r="0.8" fill="currentColor" />
              <circle cx="36" cy="8" r="0.8" fill="currentColor" />
              <circle cx="44" cy="8" r="0.8" fill="currentColor" />
              <circle cx="4" cy="40" r="0.8" fill="currentColor" />
              <circle cx="12" cy="40" r="0.8" fill="currentColor" />
              <circle cx="36" cy="40" r="0.8" fill="currentColor" />
              <circle cx="44" cy="40" r="0.8" fill="currentColor" />
            </g>
          </svg>
          <div className="space-y-4 text-center max-w-md">
            <h2 className="text-2xl font-bold">Neural Learning Enhancement</h2>
            <p>
              Experience Helix's advanced spiral revision algorithm that mimics neural pathways,
              helping you build stronger connections and retain medical knowledge more effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}