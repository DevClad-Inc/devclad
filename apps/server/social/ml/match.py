import zoneinfo

from django.contrib.auth import get_user_model

from django.db.models import Count

import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from social.models import SocialProfile
from users.models import User

User = get_user_model()

# substantial ML functionality lifted from connectdome's existing codebase and modified
def transform_variables_profile(social_profile):
    """
    Transforms the variables so that they work well on knn for 1:1
    """
    # idea_status
    idea = 0
    if social_profile[1] is None or social_profile[1] == "Open to exploring ideas.":
        idea = 1
    elif social_profile[1] == "Need people working on my idea.":
        idea = 2
    elif social_profile[1] == "Not open to exploring ideas.":
        idea = 3
    # video_call_friendly
    vid = 0
    if social_profile[2] is None or social_profile[2] is False:
        vid = 0
    elif social_profile[2] is True:
        vid = 1
    transformed_profile = [social_profile[0], idea, vid]
    # raw_xp
    xp = 0
    if social_profile[3] is None or social_profile[3] < 3:
        xp = 0
    elif social_profile[3] < 6:
        xp = 1
    elif social_profile[3] < 10:
        xp = 2
    elif social_profile[3] < 15:
        xp = 3
    else:
        xp = 4
    transformed_profile.append(xp)

    # location
    location = social_profile[4]
    if location == "":
        transformed_profile.append(0)

    elif location in [
        "Australia",
        "Canada",
        "European Union",
        "United States",
        "United Kingdom",
        "Japan",
    ]:
        transformed_profile.append(1)
    else:
        transformed_profile.append(2)
    # timezone
    if social_profile[5] is not None:
        le = LabelEncoder()
        list_of_timezones = list(zoneinfo.available_timezones())
        new_list = np.array(list_of_timezones, dtype=object)
        if str(social_profile[5]).startswith("UTC"):
            new_list = np.append(new_list, np.array(["UTC"]))
        else:
            new_list = np.append(
                new_list, np.array([str(social_profile[5]).split("/")[0]])
            )
        le.fit(new_list)
        transformed_profile.append(le.transform([str(social_profile[5]).split("/")[0]]))
        # le.fit(list_of_timezones)
        # transformed_profile.append(le.transform([social_profile[5]])[0])
    else:
        transformed_profile.append(0)

    return transformed_profile


def get_indirect_match(user, number_of_matches_to_make=1):
    pass


def get_one_one_match(user, number_of_matches_to_make=1):
    indirect_matching = False
    logged_in_social_profile = SocialProfile.objects.get(user=user)
    all_profiles = [
        transform_variables_profile(social_profile)
        for social_profile in list(
            SocialProfile.objects.exclude(user=user)
            .exclude(
                available_always_off=True
            )  # for users who just logged in and haven't set their availability yet
            .exclude(available_this_week=False)
            .exclude(blocked=logged_in_social_profile)
            .exclude(shadowed=logged_in_social_profile)
            .exclude(circle=logged_in_social_profile)
            .exclude(skipped=logged_in_social_profile)
            .values_list(
                "user",
                "idea_status",
                "video_call_friendly",
                "raw_xp",
                "location",
                "timezone",
            )
        )
    ]

    indirect_all_profiles = [
        transform_variables_profile(social_profile)
        for social_profile in list(
            SocialProfile.objects
            # .exclude(user=logged_in_user)
            .exclude(
                available_always_off=True
            )  # for users who just logged in and haven't set their availability yet
            .filter(indirect_matching=True)
            .annotate(num_matches=Count("matches_this_week"))
            .filter(num_matches__lt=2)
            .filter(num_matches__gt=0)
            .exclude(blocked=logged_in_social_profile)
            .exclude(shadowed=logged_in_social_profile)
            .exclude(circle=logged_in_social_profile)
            .exclude(skipped=logged_in_social_profile)
            .values_list(
                "user",
                "idea_status",
                "video_call_friendly",
                "raw_xp",
                "location",
                "timezone",
            )
        )
    ]

    try:
        all_profiles_array = np.array(all_profiles, dtype=object)[:, 1:]
        scaler = StandardScaler().fit(all_profiles_array)
        all_profiles_array = scaler.fit_transform(all_profiles_array)
        if len(all_profiles_array) < number_of_matches_to_make:
            return []
        nbrs = NearestNeighbors(
            n_neighbors=number_of_matches_to_make,
        ).fit(all_profiles_array)
    except IndexError:
        try:
            indirect_matching = True
            indirect_all_profiles_array = np.array(indirect_all_profiles, dtype=object)[
                :, 1:
            ]
            scaler = StandardScaler().fit(indirect_all_profiles_array)
            indirect_all_profiles_array = scaler.fit_transform(
                indirect_all_profiles_array
            )
            if len(indirect_all_profiles_array) < number_of_matches_to_make:
                return []
            nbrs = NearestNeighbors(n_neighbors=number_of_matches_to_make).fit(
                indirect_all_profiles_array
            )
        except IndexError:
            return []

    user = SocialProfile.objects.filter(user=user).values_list(
        "user",
        "idea_status",
        "video_call_friendly",
        "raw_xp",
        "location",
        "timezone",
    )[0]
    nbrs = nbrs.kneighbors(
        scaler.transform([transform_variables_profile(user)[1:]]),
        return_distance=False,
    )
    # could apply filters on neighbors
    # todo: add filters from pref_dev_type and pref_timezone_deviation
    user_list = []
    for nbr in nbrs[0]:
        if indirect_matching:
            user = User.objects.get(id=indirect_all_profiles[nbr][0])
        else:
            user = User.objects.get(id=all_profiles[nbr][0])
        user_list.append(user)
    if indirect_matching:
        return [indirect_all_profiles[nbr][0] for nbr in nbrs[0]]
    return [all_profiles[nbr][0] for nbr in nbrs[0]]
