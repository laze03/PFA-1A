const fs = require("fs");
const csv = require("csv-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//code1: pie
const JSON_nombre_de_mutations_par_impact_par_gène = () => {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv({ delimiter: "," }))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Compter le nombre de mutations par gène
        const geneMutationCounts = results.reduce((acc, row) => {
          const gene = row["NAME"];
          if (!acc[gene]) {
            acc[gene] = 0;
          }
          acc[gene]++;
          return acc;
        }, {});

        // Compter le nombre de gènes pour chaque nombre de mutations
        const mutationGeneCounts = Object.values(geneMutationCounts).reduce(
          (acc, count) => {
            if (!acc[count]) {
              acc[count] = 0;
            }
            acc[count]++;
            return acc;
          },
          {}
        );

        resolve(mutationGeneCounts);
      });
  });
};

JSON_nombre_de_mutations_par_impact_par_gène();

//code2: dans doc google bar, but u said pie is better w i agree with this

const JSON_distribution_impact_par_mutation = () => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        const impactCounts = data.reduce((counts, row) => {
          const impact = row.IMPACT;
          counts[impact] = (counts[impact] || 0) + 1;
          return counts;
        }, {});

        resolve(impactCounts);
      });
  });
};
JSON_distribution_impact_par_mutation();

//code3 & code4 je pense que c la même chose, nbre de gènes par chrom <=> nbre de mutations par chrom: à confirmer, si oui supprime l'un des codes 3 ou 4

//code3:  bar

const JSON_distribution_des_gènes_par_chromosome = () => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
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

        resolve(chromGeneCounts);
      });
  });
};

//code4: bar

const JSON_distribution_par_chromosome = () => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        const counts = {};
        data.forEach((row) => {
          const chromosome = row.CHROM;
          if (counts[chromosome]) {
            counts[chromosome]++;
          } else {
            counts[chromosome] = 1;
          }
        });

        resolve(counts);
      });
  });
};

//code5: bar

const JSON_distribution_par_type_de_mutation = () => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        const counts = {};
        data.forEach((row) => {
          const type = row.TYPE;
          if (counts[type]) {
            counts[type]++;
          } else {
            counts[type] = 1;
          }
        });

        resolve(counts);
      });
  });
};

//code6: bar

const JSON_nbre_mutation_par_impact_par_chrom = () => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        // Compter le nombre de mutations par chromosome et par impact
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

        resolve(chromImpactCounts);
      });
  });
};

const combineGraphData = async () => {
  const nombreDeMutationsParImpactParGène =
    await JSON_nombre_de_mutations_par_impact_par_gène();
  const distributionImpactParMutation =
    await JSON_distribution_impact_par_mutation();
  const distributionDesGènesParChromosome =
    await JSON_distribution_des_gènes_par_chromosome();
  const distributionParChromosome = await JSON_distribution_par_chromosome();
  const distributionParTypeDeMutation =
    await JSON_distribution_par_type_de_mutation();
  const nbreMutationParImpactParChrom =
    await JSON_nbre_mutation_par_impact_par_chrom();

  const combinedData = {
    nombre_de_mutations_par_impact_par_gène: nombreDeMutationsParImpactParGène,
    distribution_impact_par_mutation: distributionImpactParMutation,
    distribution_des_gènes_par_chromosom: distributionDesGènesParChromosome,
    distribution_par_chromosome: distributionParChromosome,
    distribution_par_type_de_mutation: distributionParTypeDeMutation,
    nbre_mutation_par_impact_par_chrom: nbreMutationParImpactParChrom,
  };

  const combinedDataJson = JSON.stringify(combinedData);

  return combinedDataJson;
};

app.get("/dashboard", async (req, res) => {
  const combinedDataJson = await combineGraphData();
  res.send(combinedDataJson);
});

app.listen(7000, () => console.log("server started on port 7000"));
