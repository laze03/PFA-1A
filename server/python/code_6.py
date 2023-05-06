import pandas as pd

# Lecture du fichier CSV
df = pd.read_csv('output.csv')

# Filtrage par gène
resultats_filtres = filter_by_gene(df, 'TP73')

# Exportation des résultats filtrés en fichier CSV
resultats_filtres.to_csv('resultats_filtres.csv', index=False)
