import os
from collections import defaultdict
from datetime import datetime
from supabase import create_client

def add_gw_to_total(supabase):
    try:
        fetch_response = supabase.table('players').select('name, currentgw, total').execute()
    except Exception as e:
        print(f"Failed to fetch players from Supabase.")
    

    for player in fetch_response.data:
        new_total = player['total'] + player['currentgw']
        try:
            supabase.table('players').update({
                'currentgw': 0, # Reset currentgw to 0
                'total': new_total
            }).eq('name', player['name']).execute()
        except Exception as e:
            print(f"Failed to update {player['name']}.")
            continue


def apply_swaps(supabase):
    try:
        fetch_response = supabase.table('swaps').select('*').execute()
    except Exception as e:
        print(f"Failed to fetch swaps from Supabase.")

    for swap in fetch_response.data:
        uuid = swap['uuid']
        oldplayerid = swap['oldplayerid']
        newplayerid = swap['newplayerid']

        try:
            # update the uuid oldplayer to uuid newplayer in userplayers
            supabase.table('userplayers').update({
                'playerid': newplayerid
            }).eq('playerid', oldplayerid).eq('uuid', uuid).execute()

            # delete the swap
            supabase.table('swaps').delete().eq('uuid', uuid).eq('oldplayerid', oldplayerid).eq('newplayerid', newplayerid).execute()
        
        except Exception as e:
            print(f"Failed to update {oldplayerid} to {newplayerid} in userplayers for UUID {uuid}.")
            continue

    
def main():
    api_key = os.environ["API_KEY"]
    site_id = os.environ["SITE_ID"]

    try:
        
        supabase = create_client(os.environ["NEXT_PUBLIC_SUPABASE_URL"], os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"])
        add_gw_to_total(supabase)
        apply_swaps(supabase)

        
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
