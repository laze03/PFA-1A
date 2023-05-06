import pandas as pd
import matplotlib.pyplot as plt

# Charger les données depuis le fichier CSV
df = pd.read_csv('output.csv')

# Compter le nombre de mutations par chromosome
counts = df['CHROM'].value_counts()

# Dessiner l'histogramme
counts.plot(kind='bar', figsize=(10, 5))
plt.title('Nombre de mutations par chromosome')
plt.xlabel('Chromosome')
plt.ylabel('Nombre de mutations')
plt.show()
