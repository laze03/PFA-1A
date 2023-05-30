import pandas as pd
import matplotlib.pyplot as plt
import os

# Charger le fichier CSV en un DataFrame pandas
df = pd.read_csv(str(os.path.dirname(os.path.abspath(__file__))) + '/../uploads/output.csv')

# Extraire les données de chromosome et de nom de gène
chromosomes = df['CHROM']
genes = df['NAME']

# Créer un dictionnaire pour stocker le nombre de gènes pour chaque chromosome
chrom_gene_counts = {}
for chromosome, gene in zip(chromosomes, genes):
    if chromosome in chrom_gene_counts:
        chrom_gene_counts[chromosome] += 1
    else:
        chrom_gene_counts[chromosome] = 1

# Tracer le graphe
plt.bar(chrom_gene_counts.keys(), chrom_gene_counts.values())
plt.xlabel('Chromosome')
plt.ylabel('Nombre de gènes')
plt.title('Distribution des gènes pour chaque chromosome')
plt.show()
