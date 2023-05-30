import pandas as pd
import matplotlib.pyplot as plt
import os

# Chargement des données
df = pd.read_csv((str(os.path.dirname(os.path.abspath(__file__))) + '/../uploads/output.csv'), delimiter=",")

# Graphique de distribution par gène
df['NAME'].value_counts().plot(kind='bar', figsize=(10,5))
print (i  for i in df['NAME'].value_counts())
plt.title('Distribution par gène')
plt.xlabel('Gène')
plt.ylabel('Nombre de mutations')
plt.show()

# Graphique de distribution par type de mutation
df['TYPE'].value_counts().plot(kind='pie', figsize=(7,7),labels=None)
plt.title('Distribution par type de mutation')
plt.legend()
plt.show()

# Graphique de distribution par chromosome
df['CHROM'].value_counts().plot(kind='bar', figsize=(10,5))
plt.title('Distribution par chromosome')
plt.xlabel('Chromosome')
plt.ylabel('Nombre de mutations')
plt.show()
