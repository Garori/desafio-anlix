import os
with open("./../mysql/sql_files_to_seed_the_db/indice-cardiaco.sql", "w") as saida:
    saida.write("""USE desafio_anlix
CREATE TABLE indice_cardiaco_table (
id BIGINT AUTO_INCREMENT,
pacientes_id BIGINT,
cpf VARCHAR(14) NOT NULL,
epoch BIGINT NOT NULL,
indice_cardiaco DOUBLE NOT NULL,
datetime DATETIME,
PRIMARY KEY (id),
INDEX (pacientes_id)
);
INSERT INTO indice_cardiaco_table (cpf, epoch, indice_cardiaco)
VALUES""")
    to_write = ""
    for arq in os.listdir("./database/dados/indice_cardiaco"):
        with open("./database/dados/indice_cardiaco/" + arq, "r") as f:
            # print(f.read())
            for line in f.readlines()[1:]:
                line=line.replace("\n","")
                entry = "\n("
                for i, col in enumerate(line.split(" ")):
                    if i == 0:
                        entry += f"'{col}',"
                    elif i==1:
                        entry += f"{col},"
                    else:
                        entry += f"{col}"
                    # saida.write(f"({line})")
                entry += "),"
                to_write += entry
    to_write = to_write[:-1] + ";\n\n"
    saida.write(to_write)
    saida.write(
        """UPDATE indice_cardiaco_table SET datetime = FROM_UNIXTIME(epoch);

""")
    # saida.write("SELECT to_timestamp(epoch) as date FROM indice_cardiaco;\n")
    saida.write(
        """UPDATE indice_cardiaco_table ict, pacientes pct SET ict.pacientes_id = pct.id
WHERE ict.cpf = pct.cpf;

""")
    saida.write(
        """ALTER TABLE indice_cardiaco_table
ADD CONSTRAINT fk_pacientes_id_cardiaco FOREIGN KEY (pacientes_id) REFERENCES pacientes(id) ON DELETE CASCADE;

""")
    saida.write(
        """ALTER TABLE indice_cardiaco_table
DROP COLUMN epoch;

""")
    saida.write(
        """ALTER TABLE indice_cardiaco_table
DROP COLUMN cpf;
""")

with open("./../mysql/sql_files_to_seed_the_db/indice-pulmonar.sql", "w") as saida:
    saida.write("""USE desafio_anlix
CREATE TABLE indice_pulmonar_table (
id BIGINT AUTO_INCREMENT,
pacientes_id BIGINT,
cpf VARCHAR(14) NOT NULL,
epoch BIGINT NOT NULL,
indice_pulmonar DOUBLE NOT NULL,
datetime DATETIME,
PRIMARY KEY (id),
INDEX (pacientes_id)
);
INSERT INTO indice_pulmonar_table (cpf, epoch, indice_pulmonar)
VALUES""")
    to_write = ""
    for arq in os.listdir("./database/dados/indice_pulmonar"):
        with open("./database/dados/indice_pulmonar/" + arq, "r") as f:
            # print(f.read())
            for line in f.readlines()[1:]:
                line = line.replace("\n", "")
                entry = "\n("
                for i, col in enumerate(line.split(" ")):
                    if i == 0:
                        entry += f"'{col}',"
                    elif i == 1:
                        entry += f"{col},"
                    else:
                        entry += f"{col}"
                    # saida.write(f"({line})")
                entry += "),"
                to_write += entry
    to_write = to_write[:-1] + ";\n\n"
    saida.write(to_write)
    saida.write(
        """UPDATE indice_pulmonar_table SET datetime = FROM_UNIXTIME(epoch);

""")
    # saida.write("SELECT to_timestamp(epoch) as date FROM indice_pulmonar;\n")
    saida.write(
        """UPDATE indice_pulmonar_table ipt, pacientes pct SET ipt.pacientes_id = pct.id
WHERE ipt.cpf = pct.cpf;

""")
    saida.write(
        """ALTER TABLE indice_pulmonar_table
ADD CONSTRAINT fk_pacientes_id_pulmonar FOREIGN KEY (pacientes_id) REFERENCES pacientes(id) ON DELETE CASCADE;

""")
    saida.write(
        """ALTER TABLE indice_pulmonar_table
DROP COLUMN epoch;

""")
    saida.write(
        """ALTER TABLE indice_pulmonar_table
DROP COLUMN cpf;
""")
