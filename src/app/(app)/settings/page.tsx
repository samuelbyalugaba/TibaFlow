'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast({
        title: "Photo upload not implemented",
        description: "This feature is coming soon.",
    });
  };

  const handleSaveProfile = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not authenticated",
            description: "You must be logged in to update your profile.",
        });
        return;
    }
    
    setIsSaving(true);
    try {
        await updateProfile(user, {
            displayName: displayName,
        });

        // The email update requires reauthentication and is more complex, so we will not implement it here.
        
        toast({
            title: "Profile Updated",
            description: "Your display name has been updated.",
        });

        // Force a reload of the user to get the new profile info
        await user.reload();
        router.refresh(); // This will re-render the layout with the new user info

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message,
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl gap-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and profile settings.
          </p>
        </div>

        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                 <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <input type="file" id="photo-upload" className="hidden" onChange={handleFileSelect} accept="image/*" />
                    <Button variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                        <Upload className="mr-2" /> Upload
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
