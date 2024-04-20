import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "../login/submit-button";
import { redirect } from "next/navigation";


export default async function SignupPage() {
  const supabase = createClient();

  // Ensure user is signed in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Ensure user hasn't already set team name
  const { data: users, error } = await supabase.from('users').select('*').eq('id', user!.id);
  if (!users || users.length > 0) {
    return redirect("/");
  }

  const handleSubmit = async (formData: FormData) => {
    "use server";
    console.log("formData", formData)
    const fullName = formData.get('fullName') as string;
    const teamName = formData.get('teamName') as string;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user)

    const { data, error } = await supabase.from('users').insert([
      { id: user!.id, fullname: fullName, teamname: teamName }
    ]);
    console.log(data, error);
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-black">
      <form className="flex flex-col gap-4">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className="p-2 rounded-md text-black"
        />
        <label htmlFor="teamName">Team Name</label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          className="p-2 rounded-md text-black"
        />
        <SubmitButton
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          formAction={handleSubmit}
          pendingText="Creating account..."
        >
          Continue
        </SubmitButton>
      </form>
    </div>
  );
};
