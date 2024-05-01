import os
import requests
from collections import defaultdict
from constants import *
from datetime import datetime
from supabase import create_client


def fetch_both_innings(api_key, match_id):
    url = f"https://play-cricket.com/api/v2/match_detail.json/?&match_id={match_id}&api_token={api_key}"

    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()["match_details"][0]["innings"]
    return data


# take my word for it lad
def merge_dicts(players, batters, bowlers, fielders):
    new_dict = {}
    all_keys = (
        set(players.keys())
        | set(batters.keys())
        | set(bowlers.keys())
        | set(fielders.keys())
    )

    for key in all_keys:
        new_dict[key] = (
            players.get(key, 0)
            + batters.get(key, 0)
            + bowlers.get(key, 0)
            + fielders.get(key, 0)
        )

    return new_dict


def get_points(innings):
    # match may not have happened yet or was abandoned
    if innings == []:
        return {}

    players = {}
    # always know there are 2 innings
    if "Imperial College Union" in innings[0]["team_batting_name"]:
        # ICUCC batting first
        batters = get_batting_points(innings[0]["bat"])
        bowlers = get_bowling_points(innings[1]["bowl"])
        fielders = get_fielding_points(innings[1]["bat"])
        players = merge_dicts(players, batters, bowlers, fielders)

    if "Imperial College Union" in innings[1]["team_batting_name"]:
        # ICUCC bowl first
        bowlers = get_bowling_points(innings[0]["bowl"])
        batters = get_batting_points(innings[1]["bat"])
        fielders = get_fielding_points(innings[0]["bat"])
        players = merge_dicts(players, batters, bowlers, fielders)

    return players


def get_fielding_points(oppo_batting_innings):
    fielders = defaultdict(int)

    for wicket in oppo_batting_innings:
        if wicket["how_out"] == "ct":
            name = wicket["fielder_name"]
            fielders[name] += POINTS_PER_CATCH

        if wicket["how_out"] == "st":
            name = wicket["fielder_name"]
            fielders[name] += POINTS_PER_STUMPING

        if wicket["how_out"] == "run out":
            name = wicket["fielder_name"]
            fielders[name] += POINTS_PER_RUNOUT

        # else did not bat

    return dict(fielders)


def get_bowling_points(bowling_innings):
    # name -> points
    bowlers = {}

    for bowler in bowling_innings:
        name = bowler["bowler_name"]
        points = 0

        # wickets
        wickets = int(bowler["wickets"])
        points = wickets * POINTS_PER_WICKET

        if wickets >= 5:
            points += POINTS_PER_5FER
        elif wickets >= 3:
            points += POINTS_PER_3FER

        bowlers[name] = points

    return bowlers


def get_batting_points(batting_innings):
    batters = {}

    for batter in batting_innings:

        if batter["how_out"] == "did not bat":
            continue

        name = batter["batsman_name"]
        points = 0

        runs = int(batter["runs"])

        if runs == 0:
            # duck
            points += POINTS_PER_DUCK
        else:
            points = runs * POINTS_PER_RUN

        if runs >= 100:
            points += 50 + POINTS_PER_100
        elif runs >= 50:
            points += 25 + POINTS_PER_50

        fours = batter["fours"]
        if fours == "":
            fours = 0
        else:
            fours = int(fours)

        points += fours * POINTS_PER_FOUR

        sixes = batter["sixes"]
        if sixes == "":
            sixes = 0
        else:
            sixes = int(sixes)

        points += sixes * POINTS_PER_SIX

        batters[name] = points

    return batters


def get_matches(api_key, site_id):
    """Get all matches between start_date and end_date. Return a list of match ids."""
    url = f"https://play-cricket.com/api/v2/matches.json?&site_id={site_id}&season=2024&api_token={api_key}&from_entry_date=01/04/2024&end_entry_date=30/06/2024"

    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()["matches"]

    matches = []
    start_date = datetime.strptime(os.environ["START_DATE"], '%d/%m/%Y')
    end_date = datetime.strptime(os.environ["END_DATE"], '%d/%m/%Y')


    for match in data:
        match_date = datetime.strptime(match["match_date"], '%d/%m/%Y')
        if match_date >= start_date and match_date <= end_date:
            matches.append(match["id"])

    return matches



def calculate_positions(supabase, pre_total_update, post_total_update):
    sorted_post_totals = sorted(post_total_update, key=lambda x: -x['total'])

    # for quicker lookup
    old_positions = {item['id']: item['position'] for item in pre_total_update}
    
    current_position = 0
    last_total = None
    new_positions_and_form = []

    for index, item in enumerate(sorted_post_totals):
        if item['total'] != last_total:
            current_position = index + 1
            last_total = item['total']
        
        old_position = old_positions.get(item['id'], None)
        if old_position is None:
            old_position = 10000 # should never happen
        else:
            if current_position < old_position:
                form = True
            elif current_position > old_position:
                form = False
            else:
                form = None
    
        new_positions_and_form.append({
            'id': item['id'],
            'total': item['total'],
            'position': current_position,
            'form': form
        })

    for item in new_positions_and_form:
        try:
            supabase.table('users').update({
                'total': item['total'],
                'position': item['position'],
                'form': item['form']
            }).eq('id', item['id']).execute()
        except Exception as e:
            print(f"Failed to update {item['id']} in Supabase.")
            continue



def populate_supabase(supabase, points):
   
    for name, current_gw in points.items():
        try:
            fetch_response = supabase.table('players').select('playerid, currentgw, total').eq('name', name).single().execute()
        except Exception as e:
            print(f"Failed to fetch {name} from Supabase.")
            continue

        
            
        new_total = fetch_response.data['total'] + current_gw
        new_gw = fetch_response.data['currentgw'] + current_gw

        try:
            # Update the player with the new currentgw and total
            supabase.table('players').update({
                'currentgw': new_gw,
                'total': new_total
            }).eq('name', name).execute()

        except Exception as e:
            print(f"Failed to update {name}.")

        try:
            userplayers = supabase.table('userplayers').select('uuid, captain').eq('playerid', fetch_response.data['playerid']).execute()
        except Exception as e:
            print(f"Failed to fetch uuids from userplayers in Supabase.")
            continue

        # create a set of (fullnames, name) to check for duplicates

        fullnames = set()

        for userplayer in userplayers.data:
            try:
                user = supabase.table('users').select('fullname, total').eq('id', userplayer['uuid']).single().execute()
            except Exception as e:
                print(f"Failed to fetch {userplayer['uuid']} from Supabase.")
                continue


            fullname = user.data['fullname']

            if (fullname, name) in fullnames:
                print("Duplicate team ffs!")
            else:
                fullnames.add((fullname, name))

            if userplayer['captain']:
                new_user_total = user.data['total'] + (current_gw * 2)
            else:                       
                new_user_total = user.data['total'] + current_gw

            try:
                supabase.table('users').update({
                    'total': new_user_total
                }).eq('id', userplayer['uuid']).execute()
            except Exception as e:
                print(f"Failed to update {fullname} in Supabase.")
                continue

# return match ids from file as list of strings without newline characters
def get_matches_from_file():
    with open('/app/matches', 'r') as f:
        return [str(line.strip()) for line in f]
    
def match_already_processed(match_id):
    with open('/app/processed_matches', 'r') as f:
        for line in f:
            if str(match_id) in line:
                return True
            
def mark_match_as_processed(match_id):
    with open('/app/processed_matches', 'a') as f:
        f.write(f"{match_id}\n")

def main():
    api_key = os.environ["API_KEY"]
    site_id = os.environ["SITE_ID"]

    try:
        # matches = get_matches(api_key, site_id)
        # getting matches from file instead of API
        matches = get_matches_from_file()

        supabase = create_client(os.environ["NEXT_PUBLIC_SUPABASE_URL"], os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"])

        

        for match_id in matches:
            # if match_already_processed(match_id):
            #     continue
            # get initial positions
            try:
                initial_positions_resp = supabase.table('users').select('id, total, position, form').execute()
            except Exception as e:
                print(f"Failed to fetch positions from Supabase.")
                return

            print(f"Match ID: {match_id}")
            both_innings = fetch_both_innings(api_key, match_id)
            points = get_points(both_innings)
            print(points)
            populate_supabase(supabase, points)
            mark_match_as_processed(match_id)

            # get post positions
            try:
                post_positions_resp = supabase.table('users').select('id, total, position, form').execute()
            except Exception as e:
                print(f"Failed to fetch post-total positions from Supabase.")
                return
            
            calculate_positions(supabase, initial_positions_resp.data, post_positions_resp.data)
        
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
