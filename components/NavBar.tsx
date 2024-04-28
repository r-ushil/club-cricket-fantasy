import AuthButton from "./AuthButton";

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between bg-gray-800 border-b border-b-foreground/10 h-16 py-2 px-4 sm:py-4 sm:px-10">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <img src="/icucc_logo.png" alt="ICUCC Logo" className="h-8 sm:h-12" />
        <h3 className="text-white text-base sm:text-xl font-bold">ICUCC Fantasy</h3>
      </div>
      <AuthButton />
    </nav>
  );
}