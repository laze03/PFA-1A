const express = require("express");
const PORT = 5000;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// app.post("/api", (req, res) => {
//   const filename = Date.now() + "_" + req.files.file.name;
//   const file = req.files.file;
//   let uploadPath = __dirname + "/uploads/" + filename;
//   file.mv(uploadPath, (err) => {
//     if (err) {
//       return res.send(err);
//     }
//   });
//   res.send(uploadPath);
// });

app.post("/upload", (req, res) => {
  const filename = Date.now() + "_" + req.files.file.name;
  const file = req.files.file;
  let uploadPath = __dirname + "/uploads/" + filename;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.send(err);
    }
  });
  const pyProg = spawn("python", [
    __dirname + "/python/JSON_distribution_par_chromosome.py",
    uploadPath,
  ]);
  pyProg.stdout.on("data", function (data) {
    console.log("stdout: " + data.toString());
    res.send(data.toString());
  });
  pyProg.stderr.on("data", (data) => {
    console.log("stderr: " + data.toString());
  });
  pyProg.on("close", (code) => {
    console.log("child process exited with code " + code.toString());
  });
  // res.send(uploadPath);
});

app.get("/upload", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

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

//code5: bar

// const JSON_distribution_par_type_de_mutation = () => {
//   return new Promise((resolve) => {
//     const data = [];
//     fs.createReadStream(__dirname + "/uploads/" + "output.csv")
//       .pipe(csv())
//       .on("data", (row) => {
//         data.push(row);
//       })
//       .on("end", () => {
//         const counts = {};
//         data.forEach((row) => {
//           const type = row.TYPE;
//           if (counts[type]) {
//             counts[type]++;
//           } else {
//             counts[type] = 1;
//           }
//         });

//         resolve(counts);
//       });
//   });
// };

// const JSON_distribution_par_type_de_mutation = () => {
//   return new Promise((resolve, reject) => {
//     const data = [];
//     fs.createReadStream(__dirname + "/uploads/" + "output.csv")
//       .pipe(csv())
//       .on("data", (row) => {
//         data.push(row);
//       })
//       .on("end", () => {
//         const counts = {};
//         data.forEach((row) => {
//           const types = row.TYPE.split("&"); // Sépare les types concaténés par "&"
//           types.forEach((type) => {
//             const trimmedType = type.trim(); // Supprime les espaces en début et fin de type
//             if (counts[trimmedType]) {
//               counts[trimmedType]++;
//             } else {
//               counts[trimmedType] = 1;
//             }
//           });
//         });
//         counts;
//         resolve(counts);
//       })
//       .on("error", (error) => {
//         reject(error);
//       });
//   });
// };

const JSON_distribution_par_type_de_mutation = () => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(__dirname + "/uploads/" + "output.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        const counts = {};
        data.forEach((row) => {
          const types = row.TYPE.split("&"); // Sépare les types concaténés par "&"
          types.forEach((type) => {
            const trimmedType = type.trim(); // Supprime les espaces en début et fin de type
            const formattedType = trimmedType
              .replace(/_/g, " ")
              .replace(/variant/g, "v"); // Remplace "_" par un espace et "variant" par "v"
            if (counts[formattedType]) {
              counts[formattedType]++;
            } else {
              counts[formattedType] = 1;
            }
          });
        });

        resolve(counts);
      })
      .on("error", (error) => {
        reject(error);
      });
  })
    .then((counts) => {
      const formattedCounts = {};
      Object.keys(counts).forEach((key) => {
        formattedCounts[key] = counts[key];
      });
      return formattedCounts;
    })
    .catch((error) => {
      console.error(error);
    });
};

//code6: bar

const JSON_nbre_mutation_par_impact_par_chromosome = () => {
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
            chromImpactCounts[chrom] = {
              MODIFIER: 0,
              MODERATE: 0,
              HIGH: 0,
              LOW: 0,
            };
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
  const distributionParTypeDeMutation =
    await JSON_distribution_par_type_de_mutation();
  const nbreMutationParImpactParChrom =
    await JSON_nbre_mutation_par_impact_par_chromosome();

  const combinedData = {
    nombre_de_mutations_par_impact_par_gène: nombreDeMutationsParImpactParGène,
    distribution_impact_par_mutation: distributionImpactParMutation,
    distribution_des_gènes_par_chromosome: distributionDesGènesParChromosome,
    distribution_par_type_de_mutation: distributionParTypeDeMutation,
    nombre_mutation_par_impact_par_chromosome: nbreMutationParImpactParChrom,
  };

  const combinedDataJson = JSON.stringify(combinedData);

  return combinedDataJson;
};

app.get("/dashboard", async (req, res) => {
  const combinedDataJson = await combineGraphData();
  res.send(combinedDataJson);
});

// app.get("/filters", (req, res) => {
//   const data = [];

//   fs.createReadStream(__dirname + "/uploads/output.csv")
//     .pipe(csv())
//     .on("data", (row) => {
//       data.push(row);
//     })
//     .on("end", () => {
//       res.json(data);
//     })
//     .on("error", (err) => {
//       console.error("Error reading CSV file:", err);
//       res.status(500).send("Error reading CSV file");
//     });
// });


const outputJson = () => {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(__dirname + "/uploads/output.csv")
      .pipe(csv())
      .on("data", (row) => {
        // Modification des valeurs de TYPE
        row.TYPE = row.TYPE.replace(/_/g, ' ').replace(/&/g, ' & ');
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};


function choices(data) {
  const choices = { CHROM: [], TYPE: [], IMPACT: [], NAME: [] };
  for (const item of data) {
    for (const key in choices) {
      if (!choices[key].includes(item[key])) {
        choices[key].push(item[key]);
      }
    }
    // if (!choices["CHROM"].includes(item["CHROM"])) {
    //   choices["CHROM"].push(item["CHROM"]);
    // }
    // if (!choices["TYPE"].includes(item["TYPE"])) {
    //   choices["TYPE"].push(item["TYPE"]);
    // }
    // if (!choices["IMPACT"].includes(item["IMPACT"])) {
    //   choices["IMPACT"].push(item["IMPACT"]);
    // }
    // if (!choices["NAME"].includes(item["NAME"])) {
    //   choices["NAME"].push(item["NAME"]);
    // }
  }
  return choices;
}

// GET method to retrieve CSV data
app.get("/filters", async (req, res) => {
  try {
    const jsonData = await outputJson();
    res.json(choices(jsonData));
  } catch (error) {
    console.error("Error reading CSV file:", error);
    res.status(500).send("Error reading CSV file");
  }
});

app.get("/table", async (req, res) => {
  try {
    const jsonData = await outputJson();
    res.json(jsonData);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    res.status(500).send("Error reading CSV file");
  }
});

function filtre(liste, genre, filtres) {
  const listeFiltre = [];
  if (filtres.length === 0) {
    return liste;
  }
  for (const item of liste) {
    if (filtres.includes(item[genre])) {
      listeFiltre.push(item);
    }
  }
  return listeFiltre;
}

const genres = ["CHROM", "TYPE", "IMPACT", "NAME"];

function filtrage(filtres) {
  let listeFiltree = outputJson();
  for (const genre of genres) {
    listeFiltree = filtre(listeFiltree, genre, filtres[genre]);
  }
  return listeFiltree;
}

app.post("/filters", async (req, res) => {
  const filtres = req.body;
  const listeFiltree = filtrage(filtres);
  res.json(listeFiltree);
});

app.listen(PORT, () => console.log(`start listening on port : ${PORT}`));
