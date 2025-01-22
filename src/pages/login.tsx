import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../services/firebase";
import LoginForm from "@/auth/LoginForm";
import bannerImage from "@/images/mb-events-banner-default.png";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/home");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="bg-black flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Image src={bannerImage} alt="MB Events" priority />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
}
