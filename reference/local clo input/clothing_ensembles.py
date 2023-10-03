import json

clo_ensembles_dict = {
    "nude": {
        "name": "Nude",
        "whole_body": 0.0,
        "local_body_part": {
            "head": 0.0,
            "neck": 0.0,
            "chest": 0.0,
            "back": 0.0,
            "pelvis": 0.0,
            "left_shoulder": 0.0,
            "left_arm": 0.0,
            "left_hand": 0.0,
            "right_shoulder": 0.0,
            "right_arm": 0.0,
            "right_hand": 0.0,
            "left_thigh": 0.0,
            "left_leg": 0.0,
            "left_foot": 0.0,
            "right_thigh": 0.0,
            "right_leg": 0.0,
            "right_foot": 0.0,
        },
    },
    "bra+panty, tank top, skirt, sandals": {
        "name": "Summer light",
        "whole_body": 0.31,
        "local_body_part": {
            "head": 0.0,
            "neck": 0.0,
            "chest": 0.83,
            "back": 0.22,
            "pelvis": 0.99,
            "left_shoulder": 0.0,
            "left_arm": 0.0,
            "left_hand": 0.03,
            "right_shoulder": 0.0,
            "right_arm": 0.0,
            "right_hand": 0.03,
            "left_thigh": 0.88,
            "left_leg": 0.05,
            "left_foot": 0.44,
            "right_thigh": 0.88,
            "right_leg": 0.05,
            "right_foot": 0.44,
        }
    },
    "bra+panty, T-shirt, long pants, socks, sneakers": {
        "name": "Summer casual",
        "whole_body": 0.52,
        "local_body_part": {
            "head": 0.0,
            "neck": 0.0,
            "chest": 1.14,
            "back": 0.84,
            "pelvis": 1.04,
            "left_shoulder": 0.42,
            "left_arm": 0.0,
            "left_hand": 0.0,
            "right_shoulder": 0.42,
            "right_arm": 0.0,
            "right_hand": 0.0,
            "left_thigh": 0.58,
            "left_leg": 0.62,
            "left_foot": 0.82,
            "right_thigh": 0.58,
            "right_leg": 0.62,
            "right_foot": 0.82,
        }
    },
    "bra+panty, thin dress shirts, long pants, socks, sneakers": {
        "name": "Summer business casual",
        "whole_body": 0.69,
        "local_body_part": {
            "head": 0.1,
            "neck": 0.1,
            "chest": 1.33,
            "back": 0.93,
            "pelvis": 1.39,
            "left_shoulder": 0.79,
            "left_arm": 0.66,
            "left_hand": 0.13,
            "right_shoulder": 0.79,
            "right_arm": 0.66,
            "right_hand": 0.13,
            "left_thigh": 0.6,
            "left_leg": 0.57,
            "left_foot": 0.76,
            "right_thigh": 0.6,
            "right_leg": 0.57,
            "right_foot": 0.76,
        }
    },
    "bra+panty, thin dress shirts, long pants, wool sweater, socks, sneakers": {
        "name": "Winter casual",
        "whole_body": 0.92,
        "local_body_part": {
            "head": 0.09,
            "neck": 0.09,
            "chest": 2.39,
            "back": 1.64,
            "pelvis": 1.71,
            "left_shoulder": 1.36,
            "left_arm": 1.29,
            "left_hand": 0.21,
            "right_shoulder": 1.36,
            "right_arm": 1.29,
            "right_hand": 0.21,
            "left_thigh": 0.7,
            "left_leg": 0.52,
            "left_foot": 0.77,
            "right_thigh": 0.7,
            "right_leg": 0.52,
            "right_foot": 0.77,
        }
    },
    "bra+panty, thin dress shirts, slacks, blazer, tie, belt, socks, formal shoes": {
        "name": "Winter business formal",
        "whole_body": 0.93,
        "local_body_part": {
            "head": 0.0,
            "neck": 0.0,
            "chest": 3.6,
            "back": 1.83,
            "pelvis": 1.71,
            "left_shoulder": 2.16,
            "left_arm": 1.49,
            "left_hand": 0.13,
            "right_shoulder": 2.16,
            "right_arm": 1.49,
            "right_hand": 0.13,
            "left_thigh": 0.64,
            "left_leg": 0.43,
            "left_foot": 0.69,
            "right_thigh": 0.64,
            "right_leg": 0.43,
            "right_foot": 0.69,
        }
    },
    "bra+panty, T-shirt, long sleeve shirts, long pants, winter jacket, socks, sneakers": {
        "name": "Winter outerwear",
        "whole_body": 1.18,
        "local_body_part": {
            "head": 0.65,
            "neck": 0.65,
            "chest": 5.26,
            "back": 3.07,
            "pelvis": 2.2,
            "left_shoulder": 3.14,
            "left_arm": 2.07,
            "left_hand": 0.08,
            "right_shoulder": 3.14,
            "right_arm": 2.07,
            "right_hand": 0.08,
            "left_thigh": 0.67,
            "left_leg": 0.54,
            "left_foot": 0.77,
            "right_thigh": 0.67,
            "right_leg": 0.54,
            "right_foot": 0.77,
        },
    },
}


def compute_fclo(iclo):
    return round(1 + 0.3 * iclo, 2)

def convert_to_required_format(data_dict):
    result = []
    for ensemble_name, ensemble_data in data_dict.items():
        segment_data = {}
        for body_part, iclo_value in ensemble_data['local_body_part'].items():
            # Body part names are capitalized for every word
            formatted_body_part = " ".join([word.capitalize() for word in body_part.split("_")])
            segment_data[formatted_body_part] = {
                "fclo": compute_fclo(iclo_value),
                "iclo": iclo_value
            }

        result.append({
            "ensemble_name": ensemble_data['name'],
            "description": ensemble_name,
            "segment_data": segment_data
        })
    return result

formatted_data = convert_to_required_format(clo_ensembles_dict)

# Saving to a JSON file
with open('clothing_ensembles.json', 'w') as json_file:
    json.dump(formatted_data, json_file, indent=4)

