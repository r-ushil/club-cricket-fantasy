import os
import requests
from collections import defaultdict
from constants import *
import datetime


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
        name = batter["batsman_name"]
        points = 0

        runs = int(batter["runs"])

        if runs == 0:
            # duck
            points += POINTS_PER_DUCK
        else:
            points = runs * POINTS_PER_RUN

        if runs >= 100:
            points += 50 * POINTS_PER_100
        elif runs >= 50:
            points += 25 * POINTS_PER_50

        fours = int(batter["fours"])
        points += fours * POINTS_PER_FOUR

        sixes = int(batter["sixes"])
        points += sixes * POINTS_PER_SIX

        batters[name] = points

    return batters


def get_matches(api_key, site_id, start_date, end_date):
    """Get all matches between start_date and end_date. Return a list of match ids."""
    url = f"https://play-cricket.com/api/v2/matches.json?&site_id={site_id}&season=2024&api_token={api_key}&from_entry_date={start_date.strftime('%d/%m/%Y')}&end_entry_date={end_date.strftime('%d/%m/%Y')}"
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()["matches"]
    return [match["id"] for match in data]


def main():
    api_key = os.environ["API_KEY"]
    site_id = os.environ["SITE_ID"]

    start_date = datetime.datetime(2024, 4, 1)
    end_date = datetime.datetime(2024, 6, 30)

    try:
        matches = get_matches(api_key, site_id, start_date, end_date)
        for match_id in matches:
            both_innings = fetch_both_innings(api_key, match_id)
            print(get_points(both_innings))

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
