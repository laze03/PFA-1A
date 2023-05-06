def filter_by_mutation_type(df, mutation_type):
    result = df[df['type'] == mutation_type]
    return result
