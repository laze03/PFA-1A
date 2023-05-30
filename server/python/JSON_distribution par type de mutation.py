import pandas as pd
import json
import os

# Charger les données depuis le fichier CSV
df = pd.read_csv((str(os.path.dirname(os.path.abspath(__file__))) + '/../uploads/output.csv'), delimiter=",")

# Compter le nombre de mutations par type
counts = df['TYPE'].value_counts().to_dict()

# Créer un dictionnaire avec les counts et la légende
data = {
    'counts': counts,
    'legend': df['TYPE'].unique().tolist()
}

# Convertir les données en JSON
json_data = json.dumps(data)

# Afficher les données en JSON
print(json_data)

