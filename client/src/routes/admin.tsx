import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  type AdminSession,
  clearAdminToken,
  fetchAdminSession,
  getStoredAdminToken,
  loginAdmin,
} from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Battle Arena Admin" },
      {
        name: "description",
        content: "Secure Battle Arena admin login and control dashboard.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = getStoredAdminToken();

    if (!token) {
      setLoadingSession(false);
      return;
    }

    fetchAdminSession(token)
      .then((session) => {
        setAdmin(session);
        setSessionError("");
      })
      .catch((error: Error) => {
        clearAdminToken();
        setSessionError(error.message || "Your admin session has expired");
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, []);

  async function onSubmit(values: LoginValues) {
    try {
      setIsSubmitting(true);
      setSessionError("");
      const session = await loginAdmin(values.email, values.password);
      setAdmin(session);
      form.reset({ email: values.email, password: "" });
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    clearAdminToken();
    setAdmin(null);
    setSessionError("");
    window.location.href = "/";
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--blaze)_22%,transparent),transparent_38%),radial-gradient(circle_at_85%_12%,_color-mix(in_oklab,var(--volt)_26%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklab,var(--background)_55%,black),var(--background))]" />
      <div className="grid-lines absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-display text-xs tracking-[0.35em] text-primary">Control Center</p>
            <h1 className="text-display mt-2 text-4xl md:text-6xl">Battle Arena Admin</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Secure access for tournament operations, site control, and admin-only actions.
            </p>
          </div>
          {admin ? (
            <Button variant="outline" className="text-display" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          ) : null}
        </div>

        <div className={admin ? "grid gap-6" : "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"}>
          <section className="glass-panel rounded-3xl border border-border/80 p-6 md:p-8">
            {loadingSession ? (
              <div className="space-y-3">
                <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                <div className="h-24 animate-pulse rounded-2xl bg-muted/70" />
              </div>
            ) : admin ? (
              <div className="min-h-[420px] rounded-3xl border border-primary/25 bg-card/70">
                <div className="flex flex-col gap-4 border-b border-border/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-display text-xs tracking-[0.3em] text-primary">Admin Panel</p>
                    <h2 className="text-display mt-2 text-2xl">{admin.fullName || admin.email}</h2>
                  </div>
                  <Button variant="outline" className="text-display" onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </div>
                <div className="min-h-[340px]" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5">
                <h2 className="text-display text-2xl">Login Required</h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Use your admin email and password to unlock the admin dashboard. Credentials are checked from the database-backed admin table.
                </p>
              </div>
            )}
          </section>

          {!admin ? (
            <Card className="glass-panel rounded-3xl border-border/80 bg-card/75 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-display text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Sign in with the admin account stored in your database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="admin@battlearena.com"
                                className="h-11 pl-10"
                                autoComplete="username"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter secure password"
                                className="h-11 pl-10"
                                autoComplete="current-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {sessionError ? (
                      <div className="rounded-2xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {sessionError}
                      </div>
                    ) : null}

                    <Button type="submit" className="text-display h-11 w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Authenticating..." : "Enter Admin Dashboard"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
