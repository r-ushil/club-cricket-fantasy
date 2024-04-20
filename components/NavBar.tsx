import AuthButton from "./AuthButton";

export default function NavBar() {
  return (
    <nav className="w-full flex justify-right  bg-gradient-to-r from-black to-black border-b border-b-foreground/10 h-14">
    {/* <nav className="w-full flex justify-center bg-gradient-to-r from-black to-black border-b border-b-foreground/10 h-14"> */}
      <div className="w-full max-w-4xl flex justify-right p-3 text-sm">
        <AuthButton />
      </div>
    </nav>
  );
}