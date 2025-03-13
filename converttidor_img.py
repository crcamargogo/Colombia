import os
from tkinter import Tk, filedialog
from PIL import Image

# Función para seleccionar carpetas
def seleccionar_carpeta(mensaje):
    Tk().withdraw()  # Oculta la ventana de Tkinter
    carpeta = filedialog.askdirectory(title=mensaje)
    return carpeta

# Seleccionar carpeta de imágenes PNG
input_folder = seleccionar_carpeta("Selecciona la carpeta con imágenes PNG")
if not input_folder:
    print("No seleccionaste una carpeta de origen.")
    exit()

# Seleccionar carpeta de salida
output_folder = seleccionar_carpeta("Selecciona la carpeta donde guardar los JPG")
if not output_folder:
    print("No seleccionaste una carpeta de destino.")
    exit()

# Asegurar que la carpeta de salida existe
os.makedirs(output_folder, exist_ok=True)

# Convertir PNG a JPG
for filename in os.listdir(input_folder):
    if filename.lower().endswith(".png"):  # Verificar si es PNG
        img_path = os.path.join(input_folder, filename)
        img = Image.open(img_path).convert("RGB")  # Convertir a RGB
        jpg_filename = os.path.splitext(filename)[0] + ".jpg"  # Nuevo nombre
        img.save(os.path.join(output_folder, jpg_filename), "JPEG")
        print(f"Convertido: {filename} → {jpg_filename}")

print("¡Conversión completada!")
