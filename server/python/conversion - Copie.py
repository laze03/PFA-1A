import csv
with open('C:/Users/Administrateur/desktop/fatima_ezzahra/ensias/s2/PFA/input.vcf', 'r') as vcf_file, open('output.csv', 'w', newline='') as csv_file:
    writer = csv.writer(csv_file)
    header = ['CHROM', 'POS', 'REF','ALT','TYPE','IMPACT','NAME']
    writer.writerow(header)

    for line in vcf_file:
        if not line.startswith('#'):
            fields = line.strip().split('\t')
            chrom = fields[0]
            pos = fields[1]
            ref = fields[3]
            alt = fields[4]
            info = fields[7].split('|')
            type = info[1]
            impact = info[2]
            name = info[3]
            writer.writerow([chrom, pos, ref, alt, type, impact, name])


