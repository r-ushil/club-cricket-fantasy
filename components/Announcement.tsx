export default function Announcement() {
  const msg = "Welcome to ICUCC Fantasy! Scroll down to read the FAQs and remember, never bat first at the H.";

  return (
    <div className="bg-blue-900 text-white text-center py-2 px-4">
      <p className="text-sm lg:text-base">
        {msg}
      </p>
    </div>
  );
}