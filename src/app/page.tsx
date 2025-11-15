import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login, which will then redirect to dashboard if logged in.
  redirect('/login');
}
