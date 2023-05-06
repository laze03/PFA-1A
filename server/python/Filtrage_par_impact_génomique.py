def filter_by_impact(df, impact):
    result = df[df['impact'] == impact]
    return result
