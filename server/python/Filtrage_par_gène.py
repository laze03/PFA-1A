def filter_by_gene(df, gene_name):
    result = df[df['name'] == gene_name]
    return result
