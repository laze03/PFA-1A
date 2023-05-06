import pandas as pd
import matplotlib.pyplot as plt

# Lecture du fichier CSV
df = pd.read_csv('output.csv')

# Création du graphique
df['IMPACT'].value_counts().plot(kind='bar')
plt.title('Distribution de l\'impact de chaque mutation')
plt.xlabel('Impact')
plt.ylabel('Nombre de mutations')
plt.show()
