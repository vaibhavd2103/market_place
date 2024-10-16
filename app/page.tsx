// import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="container bg-violet-600 w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="title">Welcome to market place!</h1>
      <p className="font-semibold">
        Continue to{" "}
        <Link href="/login">
          <button className="btn-secondary">Login/Register</button>
        </Link>
      </p>
    </div>
  );
}
