import pandas as pd

def filter_by_chrom(df, chrom_filtre):
    resultats_filtres = df[df['chrom'] == chrom_filtre]
    return resultats_filtres
