from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os
app = Flask(__name__)
mysql = MySQL(app)
app.config["MYSQL_USER"] = os.environ.get("MYSQL_USER")
app.config["MYSQL_DB"] = os.environ.get("MYSQL_DB")
app.config["MYSQL_PASSWORD"] = os.environ.get("MYSQL_PASSWORD")
app.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")
# app.config["MYSQL_USER"] = "root"
# app.config["MYSQL_DB"] = "anlix"
# app.config["MYSQL_PASSWORD"] = ""
# app.config["MYSQL_HOST"] = "localhost"

# mysql = MySQL()

# Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível;
@app.route('/api/patient/<id>/indice_cardiaco_last', methods=['GET'])
def getPatientLastIndiceCardiaco():
    # form = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(
        f'''SELECT indice_cardiaco, datetime FROM indice_cardiaco_table WHERE datetime = (select max(datetime) from indice_cardiaco_table WHERE id = "{id}")''')
    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    res = []
    for i,result in enumerate(data):
        res.append(dict(zip(columns, result)))
        res[i]["datetime_cardiaco"] = res[i]["datetime"].strftime("%d/%m/%Y %H:%M")
        res[i].pop("datetime")
    cur.close()
    return jsonify(res)


#Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível;
@app.route('/api/patient/<id>/indice_pulmonar_last', methods=['GET'])
def getPatientLastIndicePulmonar():
    # form = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(
        f'''SELECT indice_pulmonar,datetime FROM indice_pulmonar_table WHERE datetime = (select max(datetime) from indice_pulmonar_table WHERE id = "{id}")''')
    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    res = []
    for i, result in enumerate(data):
        res.append(dict(zip(columns, result)))
        res[i]["datetime_pulmonar"] = res[i]["datetime"].strftime("%d/%m/%Y %H:%M")
        res[i].pop("datetime")
    cur.close()
    return jsonify(res)


#Consultar em uma única chamada, todas as características de um paciente, com os valores mais recentes de cada uma
@app.route('/api/patient/<id>/both_indices_last', methods=['GET'])
def getPatientLastIndices():
    # form = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(f""" WITH
        cardiaco AS (SELECT indice_cardiaco, datetime FROM indice_cardiaco_table WHERE datetime = (select max(datetime) from indice_cardiaco_table WHERE id = "{id}")),
        pulmonar AS (SELECT indice_pulmonar, datetime FROM indice_pulmonar_table WHERE datetime = (select max(datetime) from indice_pulmonar_table WHERE id = "{id}"))
        SELECT * FROM cardiaco,pulmonar
        """)
    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    #preciso diferenciar as colunas de datetime
    columns[1] += "_cardiaco"
    columns[3] += "_pulmonar"
    res = []
    for i, result in enumerate(data):
        res.append(dict(zip(columns, result)))
        res[i]["datetime_cardiaco"] = res[i]["datetime_cardiaco"].strftime("%d/%m/%Y %H:%M")
        res[i]["datetime_pulmonar"] = res[i]["datetime_pulmonar"].strftime("%d/%m/%Y %H:%M")
    cur.close()
    return jsonify(res)

# Consultar para uma determinada data (dia, mês e ano), todas as características existentes de todos os pacientes da base de dados;
@app.route('/api/dates/both_indices', methods=['POST'])
def getDatesBothIndices():
    # poderia ter feito com join ou union aqui de alguma forma, mas essa foi a forma que ficou mais fácil de configurar a saída
    # sei que não é a melhor forma de fazer pq tem duas chamadas para o bd
    form = request.get_json()
    if "final_date" not in form.keys():
        form["final_date"] = form["date"]
    cur = mysql.connection.cursor()
    cur.execute(f"""
        SELECT pacientes.id, indice_cardiaco_table.cpf, pacientes.nome, indice_cardiaco_table.indice_cardiaco, indice_cardiaco_table.datetime
        FROM indice_cardiaco_table 
        JOIN pacientes 
        ON pacientes.cpf=indice_cardiaco_table.cpf
        WHERE indice_cardiaco_table.datetime BETWEEN '{form["date"]} 00:00:00' AND '{form["final_date"]} 23:59:59'
        """)
    cardiaco = cur.fetchall()
    columns_cardiaco = [x[0] for x in cur.description]
    columns_cardiaco = columns_cardiaco[3:]
    cur.execute(f"""
        SELECT pacientes.id, indice_pulmonar_table.cpf, pacientes.nome, indice_pulmonar_table.indice_pulmonar, indice_pulmonar_table.datetime 
        FROM indice_pulmonar_table 
        INNER JOIN pacientes ON pacientes.cpf=indice_pulmonar_table.cpf
        WHERE datetime BETWEEN '{form["date"]} 00:00:00' AND '{form["final_date"]} 23:59:59'
        """)
    pulmonar = cur.fetchall()
    columns_pulmonar = [x[0] for x in cur.description]
    columns_pulmonar = columns_pulmonar[3:]
    print(columns_cardiaco)
    res = {}
    for result in cardiaco:
        if str(result[0]) in res.keys():
            res[str(result[0])]["cardiaco"].append(dict(zip(columns_cardiaco, result[3:])))
            res[str(result[0])]["cardiaco"][-1]["datetime"] = res[str(result[0])]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
        else:
            res[str(result[0])] = {"cpf":result[1],"nome":result[2],"cardiaco":[],"pulmonar":[]}
            res[str(result[0])]["cardiaco"].append(dict(zip(columns_cardiaco, result[3:])))
            res[str(result[0])]["cardiaco"][-1]["datetime"] = res[str(result[0])]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    for result in pulmonar:
        if str(result[0]) in res.keys():
            res[str(result[0])]["pulmonar"].append(dict(zip(columns_pulmonar, result[3:])))
            res[str(result[0])]["pulmonar"][-1]["datetime"] = res[str(result[0])]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
        else:
            res[str(result[0])] = {"cpf":result[1],"nome":result[2],"cardiaco":[],"pulmonar":[]}
            res[str(result[0])]["pulmonar"].append(dict(zip(columns_pulmonar, result[3:])))
            res[str(result[0])]["pulmonar"][-1]["datetime"] = res[str(result[0])]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    final_res = []
    for id in res.keys():
        final_res.append({"id":str(id),"data":res[str(id)]})
    cur.close()
    return jsonify(final_res)


#EXTRA Rota que consulta algum indice, ou ambos, de um dado paciente dentro de um intervalo de dias
@app.route('/api/patient/<id>/dates', methods=['POST'])
def getPatientIndiceByDates(id):
    form = request.get_json()
    if "final_date" not in form.keys():
        form["final_date"] = form["dates"]
    res = {}
    cur = mysql.connection.cursor()
    if form["type"] in ["cardiaco", "both"]:
        cur.execute(f"""
            SELECT * FROM indice_cardiaco_table WHERE cpf = "{form["cpf"]}" AND (datetime BETWEEN '{form["date"]} 00:00:00' AND '{form["final_date"]} 23:59:59')""")
        cardiaco = cur.fetchall()
        columns = [x[0] for x in cur.description]
        columns = columns[1:]
        for result in cardiaco:
            if result[0] in res.keys():
                res[result[0]]["cardiaco"].append(
                    dict(zip(columns, result[1:])))
                res[result[0]]["cardiaco"][-1]["datetime"] = res[result[0]]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
            else:
                res[result[0]] = {"cardiaco": [], "pulmonar": []}
                res[result[0]]["cardiaco"].append(
                    dict(zip(columns, result[1:])))
                res[result[0]]["cardiaco"][-1]["datetime"] = res[result[0]]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")


    if form["type"] in ["pulmonar", "both"]:
        cur.execute(f"""
            SELECT * FROM indice_pulmonar_table WHERE cpf = "{form["cpf"]}" AND (datetime BETWEEN '{form["date"]} 00:00:00' AND '{form["final_date"]} 23:59:59')""")
        pulmonar = cur.fetchall()
        columns = [x[0] for x in cur.description]
        columns = columns[1:]
        for result in pulmonar:
            if result[0] in res.keys():
                res[result[0]]["pulmonar"].append(
                    dict(zip(columns, result[1:])))
                res[result[0]]["pulmonar"][-1]["datetime"] = res[result[0]]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
            else:
                res[result[0]] = {"cardiaco": [], "pulmonar": []}
                res[result[0]]["pulmonar"].append(
                    dict(zip(columns, result[1:])))
                res[result[0]]["pulmonar"][-1]["datetime"] = res[result[0]]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    final_res = []
    for cpf in res.keys():
        final_res.append({"cpf": cpf, "data": res[cpf]})
    cur.close()
    return jsonify(final_res)

# Consultar o valor mais recente de uma característica de um paciente que esteja entre um intervalo de valores a ser especificado na chamada da API;
@app.route('/api/patient/indice_between', methods=['POST'])
def getPatientIndiceBetween():
    form = request.get_json()
    cur = mysql.connection.cursor()
    table = "indice_cardiaco_table" if form["tipo"] == "cardiaco" else "indice_pulmonar_table"
    indice = table.replace("_table", "")
    cur.execute(
        f'''SELECT * FROM {table} WHERE cpf = "{form["cpf"]}" AND ({indice} BETWEEN {form["indice_min"]} AND {form["indice_max"]})''')
    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    res = []
    for i, result in enumerate(data):
        res.append(dict(zip(columns, result)))
        res[i]["datetime"] = res[i]["datetime"].strftime("%d/%m/%Y %H:%M")
    cur.close()
    return jsonify(res)


#Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API.
# +email e cpf
@app.route('/api/patient/<method>/<search>', methods=['GET'])
def getPatient(method,search):
    # form = request.get_json()
    cur = mysql.connection.cursor()
    if method in ["nome", "email"]:
        cur.execute(
            f'''SELECT
            id,nome,idade,cpf,rg,data_nasc,email,sexo,mae,pai,cep,endereco,numero,bairro,cidade,estado,telefone_fixo,celular,altura,peso,tipo_sanguineo,cor,signo
            FROM pacientes WHERE {method} LIKE "%{search}%" ORDER BY {method}''')
    elif method == "cpf":
        cur.execute(
        f'''SELECT
            id,nome,idade,cpf,rg,data_nasc,email,sexo,mae,pai,cep,endereco,numero,bairro,cidade,estado,telefone_fixo,celular,altura,peso,tipo_sanguineo,cor,signo
            FROM pacientes WHERE {method} = "{search}"''')
    else:
        return jsonify([])
    
    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    res = []
    for result in data:
        res.append(dict(zip(columns, result)))
    cur.close()
    return jsonify(res)


@app.route('/api/patient/<id>', methods=['GET'])
def getPatientById(id):
    # form = request.get_json()
    cur = mysql.connection.cursor()
    # if method in ["nome", "email"]:
    cur.execute(
        f'''SELECT
        id,nome,idade,cpf,rg,data_nasc,email,sexo,mae,pai,cep,endereco,numero,bairro,cidade,estado,telefone_fixo,celular,altura,peso,tipo_sanguineo,cor,signo
        FROM pacientes WHERE id = {id}''')

    data = cur.fetchall()
    columns = [x[0] for x in cur.description]
    res = []
    for result in data:
        res.append(dict(zip(columns, result)))
    cur.close()
    return jsonify(res)






if __name__ == '__main__':
    app.run()
