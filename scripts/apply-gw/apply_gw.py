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

def add_player_points_to_total(supabase):
    try:
        fetch_response = supabase.table('users').select('id', 'total').execute()
    except Exception as e:
        print(f"Failed to fetch users from Supabase.")

    for user in fetch_response.data:
        id = user['id']
        total = user['total']
        try:
            fetch_response = supabase.table('userplayers').select('playerid').eq('uuid', id).execute()
        except Exception as e:
            print(f"Failed to fetch userplayers from Supabase.")

        for player in fetch_response.data:
            playerid = player['playerid']
            try:
                fetch_response = supabase.table('players').select('currentgw').eq('playerid', playerid).execute()
                print(fetch_response.data)
            except Exception as e:
                print(f"Failed to fetch players from Supabase.")

            for player in fetch_response.data:
                total += player['currentgw']
        
        try:
            print(total)
            supabase.table('users').update({
                'total': total
            }).eq('id', id).execute()
        except Exception as e:
            print(f"Failed to update {id}.")
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
    try:
        supabase = create_client(os.environ["NEXT_PUBLIC_SUPABASE_URL"], os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"])
        add_player_points_to_total(supabase)
        add_gw_to_total(supabase)
        apply_swaps(supabase)

        
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
