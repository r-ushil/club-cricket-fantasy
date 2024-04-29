import AuthButton from "@/components/AuthButton";
import FAQs from "@/components/FAQs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BsChevronCompactDown } from "react-icons/bs";


const checkAuth = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/home");
  }
}

export default async function Index() {

  "use server"
  await checkAuth();

  const FAQsData = [
    { "title": "How do I get started?", "content": "Sign up, select players to make a team" },
    { "title": "What are the restrictions on making my team?", "content": "Budget. 4 per squad." },
    { "title": "How are points calculated?", "content": "rules" },
    { "title": "What do I do if I find a bug?", "content": "report it" },
    { "title": "Should I bet against the banker?", "content": "Never" }
  ]
  return (
    <>
      {/* Fullscreen Banner */}
      <div className="relative w-full h-screen">
        {/* Landscape banner for larger screens */}
        <div className="hidden lg:block w-full h-full">
          <Image
            src="/banner.png"
            alt="Landscape Banner"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* Portrait banner for mobile screens */}
        <div className="lg:hidden w-full h-full">
          <Image
            src="/banner_mobile.png"
            alt="Portrait Banner"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* AuthButton in the top right */}
        <div className="absolute top-0 right-0 pt-2 pr-2 z-10">
          <div className="text-sm sm:text-md md:text-lg lg:text-xl py-3 sm:py-3 md:py-4 lg:py-5 px-5 sm:px-6 md:px-8 lg:px-10">
            <AuthButton />
          </div>
        </div>



        {/* Blinking Chevron in the bottom center */}
        <div className="absolute bottom-0 inset-x-0 mb-8 flex justify-center z-10">
          <BsChevronCompactDown className="text-white text-3xl animate-bounce" />
        </div>
      </div>

      {/* Content below the banner */}
      <div className="flex flex-col w-full">
        <div className="lg:h-screen lg:bg-cover lg:bg-[url('/home_background.png')] bg-ic">
          <div className="w-full flex flex-col items-center lg:pt-10">
            <h2 className="text-3xl text-gray-200 text-center font-bold py-4 my-4">Frequently Asked Questions</h2>
            <FAQs items={FAQsData}></FAQs>
          </div>

          {/* Mobile graphic */}
          <div className="lg:hidden flex w-screen">
            <Image
              src="/homefaq_mobile.png"
              alt="Home background"
              width={1080}
              height={585}
              quality={100}
            />
          </div>
        </div>

        <footer className="w-full bg-black border-t border-t-foreground/10 p-6 flex justify-center text-center text-sm">
          <p>Powered by <span className="font-semibold">Mark Deane</span></p>
        </footer>
      </div>
    </>
  );

}