import AuthButton from "./AuthButton";

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between bg-gray-800 border-b border-b-foreground/10 h-16 py-4 px-10">
      <div className="flex items-center">
        <img src="/icucc_logo.png" alt="ICUCC Logo" className="h-12" />
        <h3 className="text-white text-xl font-bold pl-4">ICUCC Fantasy</h3>
      </div>
      <AuthButton />
    </nav>
  );
}