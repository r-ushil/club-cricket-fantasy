import AuthButton from "@/components/AuthButton";
import FAQs from "@/components/FAQs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BsChevronCompactDown } from "react-icons/bs";


export default async function Index() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/home");
  }

  const FAQsData = [
    { "title": "How do I get started?", "content": "Sign up, select players to make a team" },
    { "title": "What are the restrictions on making my team?", "content": "Budget. 4 per squad." },
    { "title": "How are points calculated?", "content": "rules" },
    { "title": "What do I do if I find a bug?", "content": "report it"},
    { "title": "Should I bet against the banker?", "content": "Never"}
  ]
  return (
    <>
      {/* Fullscreen Banner */}
      <div className="relative w-full h-screen">
        {/* Landscape banner for larger screens */}
        <div className="hidden md:block w-full h-full">
          <Image
            src="/banner.png" // replace with your landscape image path
            alt="Landscape Banner"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* Portrait banner for mobile screens */}
        <div className="md:hidden w-full h-full">
          <Image
            src="/banner_mobile.png" // replace with your portrait image path
            alt="Portrait Banner"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* AuthButton in the top right */}
        <div className="absolute top-0 right-0 p-8 z-10">
          <AuthButton />
        </div>

        {/* Blinking Chevron in the bottom center */}
        <div className="absolute bottom-0 inset-x-0 mb-8 flex justify-center z-10">
          <BsChevronCompactDown className="text-white text-3xl animate-bounce" />
        </div>
      </div>

      {/* Content below the banner */}
      <div className="flex flex-col w-full">
        <div className="container mx-auto px-4 mt-8">
          <h2 className="text-3xl font-bold py-4 my-4">Frequently Asked Questions</h2>
          <FAQs items={FAQsData} />
        </div>

        <footer className="w-full bg-black border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </>
  );

}