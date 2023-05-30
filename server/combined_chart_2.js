const fs = require('fs');
const csv = require('csv-parser');

// Fonction pour charger les données depuis le fichier CSV
const loadDataFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const JSON_nombre_de_mutations_par_impact_par_gène = async () => {
    const results = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    // Compter le nombre de mutations par gène
    const geneMutationCounts = results.reduce((acc, row) => {
        const gene = row['NAME'];
        if (!acc[gene]) {
            acc[gene] = 0;
        }
        acc[gene]++;
        return acc;
    }, {});

    // Compter le nombre de gènes pour chaque nombre de mutations
    const mutationGeneCounts = Object.values(geneMutationCounts).reduce((acc, count) => {
        if (!acc[count]) {
            acc[count] = 0;
        }
        acc[count]++;
        return acc;
    }, {});

    return {
        nombre_de_mutations_par_impact_par_gène: mutationGeneCounts,
    };
};

const JSON_distribution_impact_par_mutation = async () => {
    const data = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    const impactCounts = data.reduce((counts, row) => {
        const impact = row.IMPACT;
        counts[impact] = (counts[impact] || 0) + 1;
        return counts;
    }, {});

    return {
        distribution_impact_par_mutation: impactCounts,
    };
};

const JSON_distribution_des_gènes_par_chromosome = async () => {
    const data = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    const chromosomes = data.map((row) => row.CHROM);
    const genes = data.map((row) => row.NAME);

    const chromGeneCounts = {};
    for (let i = 0; i < chromosomes.length; i++) {
        const chromosome = chromosomes[i];
        const gene = genes[i];
        if (chromosome in chromGeneCounts) {
            chromGeneCounts[chromosome] += 1;
        } else {
            chromGeneCounts[chromosome] = 1;
        }
    }

    return {
        distribution_des_gènes_par_chromosom: chromGeneCounts,
    };
};

const JSON_distribution_par_chromosome = async () => {
    const data = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    const counts = {};
    data.forEach((row) => {
        const chromosome = row.CHROM;
        if (counts[chromosome]) {
            counts[chromosome]++;
        } else {
            counts[chromosome] = 1;
        }
    });

    return {
        distribution_par_chromosome: counts,
    };
};

const JSON_distribution_par_type_de_mutation = async () => {
    const data = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    const counts = {};
    data.forEach((row) => {
        const type = row.TYPE;
        if (counts[type]) {
            counts[type]++;
        } else {
            counts[type] = 1;
        }
    });

    return {
        distribution_par_type_de_mutation: counts,
    };
};

const JSON_nbre_mutation_par_impact_par_chrom = async () => {
    const data = await loadDataFromCSV('C:/Users/Administrateur/Desktop/cours_CSS/prep_exam/PFA/output.csv');

    const chromImpactCounts = {};
    data.forEach((row) => {
        const chrom = row.CHROM;
        const impact = row.IMPACT;
        if (!chromImpactCounts[chrom]) {
            chromImpactCounts[chrom] = {};
        }
        if (!chromImpactCounts[chrom][impact]) {
            chromImpactCounts[chrom][impact] = 0;
        }
        chromImpactCounts[chrom][impact]++;
    });

    return {
        nbre_mutation_par_impact_par_chrom: chromImpactCounts,
    };
};

const combineGraphData = async () => {
    const nombreDeMutationsParImpactParGène = await JSON_nombre_de_mutations_par_impact_par_gène();
    const distributionImpactParMutation = await JSON_distribution_impact_par_mutation();
    const distributionDesGènesParChromosome = await JSON_distribution_des_gènes_par_chromosome();
    const distributionParChromosome = await JSON_distribution_par_chromosome();
    const distributionParTypeDeMutation = await JSON_distribution_par_type_de_mutation();
    const nbreMutationParImpactParChrom = await JSON_nbre_mutation_par_impact_par_chrom();

    const combinedData = {
        ...nombreDeMutationsParImpactParGène,
        ...distributionImpactParMutation,
        ...distributionDesGènesParChromosome,
        ...distributionParChromosome,
        ...distributionParTypeDeMutation,
        ...nbreMutationParImpactParChrom,
    };

    const combinedDataJson = JSON.stringify(combinedData);
    console.log(combinedDataJson);
};

combineGraphData();
