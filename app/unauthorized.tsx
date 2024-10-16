// app/unauthorized.tsx
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link href="/login">Go to Login</Link>
    </div>
  );
}
