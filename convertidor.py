import os
import unicodedata

def format_filename(name):
    name = unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode("utf-8")  # Quitar tildes
    name = name.lower().replace(",", "").replace(" ", "_")  # Minúsculas, sin comas, guiones bajos
    return "".join(c for c in name if c.isalnum() or c == "_")  # Solo letras, números y "_"

# Carpeta donde están los avatares
avatars_folder = "avatars"

for filename in os.listdir(avatars_folder):
    original_path = os.path.join(avatars_folder, filename)
    if os.path.isfile(original_path):
        new_filename = format_filename(filename.rsplit(".", 1)[0]) + ".jpg"
        new_path = os.path.join(avatars_folder, new_filename)
        os.rename(original_path, new_path)
        print(f'Renombrado: {filename} -> {new_filename}')
