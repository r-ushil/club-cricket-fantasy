import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "../login/submit-button";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { exit } from "process";


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

  // Find position for insertion: if 0 total points exists, OR less than 0 total points exists
  const insert_zero_position = async (supabase: SupabaseClient<any, "public", any>) => {
    "use server"

    // check for if a position with 0 total points exists
    const { data: zero, error: e1 } = await supabase.from('users').select('position').eq('total', 0);

    // check if there are any users with total points less than 0
    const { data: lessthanzero, error: e2 } = await supabase.from('users').select('id, position').lt('total', 0).order('position', { ascending: true });

    if (!lessthanzero || lessthanzero.length === 0) {
      // if no users with total points less than 0, return the position of the user with total points 0
      if (!zero || zero.length === 0) {
        return null;
      }
      return zero[0].position;

    } else {
      
      // if zero exists, return the position of 0, else return the position of the first user with total points less than 0
      const position = (!zero || zero.length === 0) ? lessthanzero[0].position : zero[0].position;

      for (let i = 0; i < lessthanzero.length; i++) {
        const { data, error } = await supabase.from('users').update({ position: lessthanzero[i].position + 1 }).eq('id', lessthanzero[i].id);
        if (error) {
          console.error("Error updating position", error);
          return position;
        }
      }

      return position;

    }
 
  }

  // Find position for insertion: iff all total points > 0
  const append_zero = async (supabase: SupabaseClient<any, "public", any>) => {
      "use server"
      const { data: users, error: e1 } = await supabase.from('users').select('position').gt('total', 0).order('position', { ascending: false });
  
      if (!users) {
        return null;
      }

      // get the first position with total points greater than 0
      const position = users[0].position;

      // get number of users with the same position as the first user with total points greater than 0
      const { data: same_position, error: e2 } = await supabase.from('users').select('id').eq('position', position);

      if (!same_position) {
        // impossible
        return null;
      }

      return position + same_position.length;
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

    let position: number = 0;

    const inserted_position = await insert_zero_position(supabase);
    if (inserted_position) {
      position = inserted_position;
    } else {
      const appended_position = await append_zero(supabase);
      if (appended_position) {
        position = appended_position;
      }
    }

    const { data, error } = await supabase.from('users').insert([
      { fullname: fullName, teamname: teamName, position: position }
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
