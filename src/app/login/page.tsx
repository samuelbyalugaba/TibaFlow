'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    initiateEmailSignIn(auth, email, password);
    // We don't await here. The onAuthStateChanged listener handles success.
    // The catch block in initiateEmailSignIn handles errors.
    // We'll optimistically show a toast.
    toast({
      title: 'Signing In...',
      description: 'You will be redirected shortly if credentials are valid.',
    });
    // We'll let the UI handle the loading state, but we should reset it if the component is still mounted after a while
    setTimeout(() => setIsSigningIn(false), 3000); 
  };

  const handleSignUp = async () => {
    setIsSigningUp(true);
    initiateEmailSignUp(auth, email, password);
    toast({
      title: 'Signing Up...',
      description: 'Account created. You will be logged in and redirected.',
    });
    setTimeout(() => setIsSigningUp(false), 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">TibaFlow</CardTitle>
          <CardDescription>
            Enter your credentials to access the hospital system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSigningIn || isSigningUp}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSigningIn || isSigningUp}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSignIn} className="w-full" disabled={isSigningIn || isSigningUp}>
                {isSigningIn ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button onClick={handleSignUp} className="w-full" variant="outline" disabled={isSigningIn || isSigningUp}>
                {isSigningUp ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
