import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "../login/submit-button";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";


export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  
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

    if (teamName.length > 20) {
      return redirect("/signup?message=Team name must be less than 20 characters");
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user)

    let position: number = 1;

    const { data: users } = await supabase.from('users').select('*');
    if (!users || users.length === 0) {
      position = 1;
    } else {

      const inserted_position = await insert_zero_position(supabase);
      if (inserted_position) {
        position = inserted_position;
      } else {
        const appended_position = await append_zero(supabase);
        if (appended_position) {
          position = appended_position;
        }
      }
  }

    const { data, error } = await supabase.from('users').insert([
      { fullname: fullName, teamname: teamName, position: position }
    ]);
    console.log(data, error);
    return redirect("/edit-team");
  }

  return (
    <div className="w-screen h-screen px-8 items-center justify-center gap-2">
      <Image
          src="/signup_background.png"
          alt="Signup background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="lg:flex hidden"
        />
        <Image
          src="/signup_mobile.png"
          alt="Signup background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="lg:hidden flex"
        />

      <div className="flex flex-col items-center lg:mt-20 mt-24">
        <form className="animate-in flex flex-col justify-center gap-2 text-foreground bg-gray-900 bg-opacity-70 rounded-lg p-5">
          <label className="text-base text-white" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-white"
            name="fullName"
            placeholder="Simon Animal"
            required
          />
          <label className="text-base text-white" htmlFor="teamName">
            Team Name
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-white"
            type="text"
            name="teamName"
            placeholder="The Mighty 3s"
            required
          />
         <SubmitButton
          className="py-2 px-4 text-white rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          formAction={handleSubmit}
          pendingText="Creating account..."
        >
          Continue
        </SubmitButton>
        {searchParams?.message && (
            <div className="flex justify-center">
              <p className="mt-4 p-4 bg-foreground/10 text-white text-foreground text-center w-70vw max-w-full overflow-hidden">
                {searchParams.message}
              </p>
            </div>
          )}
        </form>
    </div>
    </div>
  );
};
