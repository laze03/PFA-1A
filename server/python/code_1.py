import csv
# Définition des filtres
filtres = {'GENE': 'TP73', 'TYPE_MUTATION': 'intron_variant', 'IMPACT': 'MODIFIER'}
# Ouverture du fichier CSV
with open('output.csv', 'r') as f:
    reader = csv.DictReader(f)
    # Initialisation de la liste des résultats filtrés
    resultats_filtres = []
    # Parcours des lignes du fichier CSV
    for row in reader:
        # Vérification des critères de filtrage
        if row['NAME'] == filtres['GENE'] and row['TYPE'] == filtres['TYPE_MUTATION'] and row['IMPACT'] == filtres['IMPACT']:
            # Ajout de la ligne filtrée à la liste des résultats filtrés
            resultats_filtres.append(row)
# Affichage des résultats filtrés
for resultat in resultats_filtres:
    print(resultat)

