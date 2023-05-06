import pandas as pd
import json

# Charger les données depuis le fichier CSV
df = pd.read_csv("./..//uploads/output.csv", delimiter=",")

# Compter le nombre de mutations par chromosome
counts = df['CHROM'].value_counts().to_dict()

# Convertir les données en JSON
json_data = json.dumps(counts)

# Afficher les données en JSON
print(json_data)
