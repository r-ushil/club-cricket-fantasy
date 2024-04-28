import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import Image from "next/image";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    // if (email.includes("grabinar") || email.includes("jg")) {
    //   return redirect("/login?message=You are not authorized to access this page.");
    // }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("login credentials")) {
        return redirect("/login?message=Invalid login credentials. Sign up or contact Suhas or Rushil for a password reset.");
      }

      return redirect("/login?message=Could not authenticate user. An error has occured.");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "/",
      },
    });

    if (error) {

      if (error.message.includes("already registered")) {
        return redirect("/login?message=User already registered. Contact Suhas or Rushil for a password reset.");
      }

      return redirect("/login?message=Could not sign up user. An error has occurred.");

    }

    return redirect("/signup");
  };

  return (
    <div className="w-screen h-screen px-8 items-center justify-center gap-2">
      <Image
        src="/login_background.png"
        alt="Login background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="lg:flex hidden"
      />
      <Image
        src="/login_mobile.png"
        alt="Login background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="lg:hidden flex"
      />
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <div className="flex flex-col items-center lg:mt-20 mt-40">
        <form className="animate-in flex flex-col justify-center gap-2 text-foreground bg-gray-900 bg-opacity-70 rounded-lg p-5">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signIn}
            className="bg-blue-700 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>
          {searchParams?.message && (
            <div className="flex justify-center">
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center w-70vw max-w-full overflow-hidden">
                {searchParams.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
