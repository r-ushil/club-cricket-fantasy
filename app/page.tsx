import AuthButton from "@/components/AuthButton";
import FAQs from "@/components/FAQs";

export default async function Index() {
  const FAQsData = [
    { "title": "How do I get started?", "content": "Sign up, select players to make a team" },
    { "title": "What are the restrictions on making my team?", "content": "Budget. 4 per squad." },
    { "title": "How are points calculated?", "content": "rules" },
    { "title": "What do I do if I find a bug?", "content": "report it"},
    { "title": "Should I bet against the banker?", "content": "Never"}
  ]
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-black">
      <div className="absolute right-8 top-8">
        <AuthButton />
      </div>

      <img src="/banner.png" alt="ICUCC Banner" className="object-cover border-b-2 border-gray-700" />

      <h2 className="text-3xl font-bold p-4 my-4">Frequently Asked Questions</h2>
      <FAQs items={FAQsData} />
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
  );
}
