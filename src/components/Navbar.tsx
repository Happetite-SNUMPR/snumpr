import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/team">Team</Link>
      <Link href="/publications">Publications</Link>
      <Link href="/join-us">Join Us</Link>
    </nav>
  );
}
