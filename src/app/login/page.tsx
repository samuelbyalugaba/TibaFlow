'use client';

import { useState } from 'react';
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

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      initiateEmailSignIn(auth, email, password);
      toast({
        title: 'Signing In...',
        description: 'You will be redirected shortly.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message,
      });
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      initiateEmailSignUp(auth, email, password);
      toast({
        title: 'Signing Up...',
        description: 'Account created. You will be logged in and redirected.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message,
      });
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">MediChain</CardTitle>
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
