import os
import json

def generate_card_images_json(base_dir="CardImages"):
    # The structure we want to produce
    data = {}

    # Each top-level folder in CardImages corresponds to a card type
    # E.g. CardImages/Armor, CardImages/Weapon, etc.
    card_types = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]

    for ctype in card_types:
        data[ctype] = {}
        type_path = os.path.join(base_dir, ctype)
        # Each subfolder in the type directory corresponds to an artist
        artists = [a for a in os.listdir(type_path) if os.path.isdir(os.path.join(type_path, a))]

        for artist in artists:
            artist_path = os.path.join(type_path, artist)
            # All files in this directory are images for that artist
            # We can filter by common image extensions if we want
            images = [f for f in os.listdir(artist_path) 
                      if os.path.isfile(os.path.join(artist_path, f)) 
                      and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))]

            data[ctype][artist] = images

    # Write to cardImages.json
    with open("cardImages.json", "w") as outfile:
        json.dump(data, outfile, indent=2)

if __name__ == "__main__":
    generate_card_images_json()
    print("cardImages.json generated successfully!")
