from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from decimal import Decimal
import os
from typing import List
from sqlalchemy import func, between
from sqlalchemy.orm import aliased, relationship, Mapped, Bundle
from urllib.parse import unquote_plus

# from sqlalchemy import create_engine
app = Flask(__name__)


app.config["MYSQL_USER"] = os.environ.get("MYSQL_USER")
app.config["MYSQL_DB"] = os.environ.get("MYSQL_DB")
app.config["MYSQL_PASSWORD"] = os.environ.get("MYSQL_PASSWORD")
app.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")

# app.config["MYSQL_USER"] = "root"
# app.config["MYSQL_DB"] = "desafio_anlix"
# app.config["MYSQL_PASSWORD"] = "123321"
# app.config["MYSQL_HOST"] = "localhost"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{app.config["MYSQL_USER"]}:{app.config["MYSQL_PASSWORD"]}@{app.config["MYSQL_HOST"]}/{app.config["MYSQL_DB"]}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


mysql:SQLAlchemy = SQLAlchemy(app)

with app.app_context():
    mysql.reflect()

class Base_Table():
    def __class_getitem__(self, key):
        return getattr(self, key)
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
class Pacientes(mysql.Model, Base_Table):
    __table__ = mysql.Model.metadata.tables['pacientes']
    _type = "pacientes"
    IndicesCardiacos: Mapped[List["IndiceCardiaco"]] = relationship()
    IndicesPulmonares: Mapped[List["IndicePulmonar"]] = relationship()


class IndiceCardiaco(mysql.Model, Base_Table):
    __table__ = mysql.Model.metadata.tables['indice_cardiaco_table']
    _type = "cardiaco"

class IndicePulmonar(mysql.Model, Base_Table):
    __table__ = mysql.Model.metadata.tables['indice_pulmonar_table']
    _type = "pulmonar"

session = mysql.session

def create_treated_res_fields(fields,items,not_in = []):
    to_return = {}
    for k in fields:
        if k not in not_in:
            item = items[k]
            to_return[k] = float(item) if isinstance(item, Decimal) else item
    return to_return


def create_treated_res_class(res:Base_Table, not_in = []):
    to_return = {}
    res = res.to_dict()
    for k in res.keys():
        print(k)
        if k not in not_in:
            item = res[k]
            to_return[k] = float(item) if isinstance(item, Decimal) else item
    return to_return

# mysql = MySQL()

# Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível;
@app.route('/api/patient/<id>/indice_cardiaco_last', methods=['GET'])
def getPatientLastIndiceCardiaco(id):
    res = session.scalars(
        mysql.select(
            IndiceCardiaco
            ).where(
                IndiceCardiaco.datetime == (
                    mysql.select(
                        func.max(
                            IndiceCardiaco.datetime
                            )
                        ).where(
                            IndiceCardiaco.pacientes_id == id
                            )
                    )
                )
        ).one_or_none()
    treated_res = []
    treated_res = [create_treated_res_class(res, ["id", "pacientes_id"])]
    treated_res[0]["datetime_cardiaco"] = treated_res[0]["datetime"].strftime("%d/%m/%Y %H:%M")
    treated_res[0].pop("datetime")
    return jsonify(treated_res)


#Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível;
@app.route('/api/patient/<id>/indice_pulmonar_last', methods=['GET'])
def getPatientLastIndicePulmonar(id):
    res = session.scalars(
        mysql.select(
            IndicePulmonar
        ).where(
            IndicePulmonar.datetime == (
                mysql.select(
                    func.max(
                        IndicePulmonar.datetime
                    )
                ).where(
                    IndicePulmonar.pacientes_id == id
                )
            )
        )
    ).one_or_none()
    treated_res = []
    treated_res = [create_treated_res_class(res, ["id", "pacientes_id"])]
    treated_res[0]["datetime_pulmonar"] = treated_res[0]["datetime"].strftime("%d/%m/%Y %H:%M")
    treated_res[0].pop("datetime")
    return jsonify(treated_res)


#Consultar em uma única chamada, todas as características de um paciente, com os valores mais recentes de cada uma
@app.route('/api/patient/<id>/both_indices_last', methods=['GET'])
def getPatientLastIndices(id):
    
    cardiaco_subq = mysql.select(
        IndiceCardiaco.datetime,
        IndiceCardiaco.indice_cardiaco
        ).where(IndiceCardiaco.datetime == (
            mysql.select(func.max(IndiceCardiaco.datetime))
            .where(IndiceCardiaco.pacientes_id == id).scalar_subquery()
        ))
    

    pulmonar_subq = mysql.select(
        IndicePulmonar.datetime,
        IndicePulmonar.indice_pulmonar
        ).where(IndicePulmonar.datetime == (
            mysql.select(func.max(IndicePulmonar.datetime))
            .where(IndicePulmonar.pacientes_id == id).scalar_subquery()
        ))
    

    cardiaco = session.execute(cardiaco_subq).one_or_none()
    pulmonar = session.execute(pulmonar_subq).one_or_none()
    total = {"cardiaco":cardiaco, "pulmonar":pulmonar}
    print(total)
    treated_res = {}
    # print(res)
    for tipo in total.keys():
        keys = total[tipo]._fields
        items = total[tipo]._asdict()
        for key in keys:
            if key == "datetime":
                # print(r[key])
                treated_res[f"datetime_{tipo}"] = items[key].strftime("%d/%m/%Y %H:%M")
            else:
                treated_res[key] = float(items[key]) if isinstance(items[key], Decimal) else items[key]

    treated_res = [treated_res]
    return jsonify(treated_res)

# Consultar para uma determinada data (dia, mês e ano), todas as características existentes de todos os pacientes da base de dados;
@app.route('/api/dates/both_indices', methods=['POST'])
def getDatesBothIndices():
    # poderia ter feito com join ou union aqui de alguma forma, mas essa foi a forma que ficou mais fácil de configurar a saída
    # sei que não é a melhor forma de fazer pq tem duas chamadas para o bd
    form = request.get_json()
    if "final_date" not in form.keys():
        form["final_date"] = form["date"]
    # cur = mysql.connection.cursor()
    cardiaco = mysql.select(
        Pacientes.nome, Pacientes.id, Pacientes.cpf,
        IndiceCardiaco.indice_cardiaco, IndiceCardiaco.datetime
    ).join_from(
        Pacientes, Pacientes.IndicesCardiacos
    ).where(
        between(IndiceCardiaco.datetime, f"{form["date"]} 00:00:00",f"{form["final_date"]} 23:59:59")
    ).order_by(Pacientes.nome).order_by(IndiceCardiaco.datetime)
    print(cardiaco)
    pulmonar = mysql.select(
        Pacientes.nome, Pacientes.id, Pacientes.cpf,
        IndicePulmonar.indice_pulmonar, IndicePulmonar.datetime
    ).join_from(
        Pacientes, Pacientes.IndicesPulmonares
    ).where(
        between(IndicePulmonar.datetime, f"{form["date"]} 00:00:00", f"{form["final_date"]} 23:59:59")
    ).order_by(Pacientes.nome).order_by(IndicePulmonar.datetime)

    res_cardiaco = session.execute(cardiaco).all()
    res_pulmonar = session.execute(pulmonar).all()
    treated_res = {}
    # print(res_cardiaco)
    for r in res_cardiaco:
        keys = r._fields
        break
    for r in res_cardiaco:
        items = r._asdict()
        if r.id not in treated_res.keys():
            treated_res[r.id] = {"id":r.id,"data":{"nome":r.nome, "cpf":r.cpf,"pulmonar":[],"cardiaco":[]}}
        treated_res[r.id]["data"]["cardiaco"].append(create_treated_res_fields(keys,items,["id", "nome", "cpf"]))
        treated_res[r.id]["data"]["cardiaco"][-1]["datetime"] = treated_res[r.id]["data"]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    for r in res_pulmonar:
        keys = r._fields
        break
    for r in res_pulmonar:
        items = r._asdict()
        if r.id not in treated_res.keys():
            treated_res[r.id] = {"id":r.id,"data":{"nome":r.nome, "cpf":r.cpf,"pulmonar":[],"cardiaco":[]}}
        treated_res[r.id]["data"]["pulmonar"].append(create_treated_res_fields(keys,items,["id", "nome", "cpf"]))
        treated_res[r.id]["data"]["pulmonar"][-1]["datetime"] = treated_res[r.id]["data"]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    
    treated_res = [treated_res[paciente_id] for paciente_id in treated_res.keys()]
    return jsonify(treated_res)



#ROTA para o gráfico
@app.route('/api/patient/<id>/dates', methods=['POST'])
def getPatientIndiceByDates(id):
    form = request.get_json()
    if "final_date" not in form.keys():
        form["final_date"] = form["dates"]
    treated_res = {}
    # cur = mysql.connection.cursor()
    if form["type"] in ["cardiaco", "both"]:

        cardiaco = mysql.select(
                IndiceCardiaco.indice_cardiaco,
                IndiceCardiaco.pacientes_id,
                IndiceCardiaco.datetime,
                IndiceCardiaco.indice_cardiaco.label("y"),
                (func.unix_timestamp(IndiceCardiaco.datetime)*1000).label("x")
            ).where(
                IndiceCardiaco.pacientes_id == id
            ).where(
                between(
                    IndiceCardiaco.datetime, f"{form["date"]} 00:00:00", f"{form["final_date"]} 23:59:59"
                )
            ).order_by(
                IndiceCardiaco.datetime
            )
        # print(cardiaco)
        res_cardiaco = session.execute(cardiaco).all()
        # print(res_cardiaco)
        # print(len(res_cardiaco))
        for r in res_cardiaco:
            keys = r._fields
            break
        # print(keys)
        for r in res_cardiaco:
            # print("aa")
            # print(r._asdict())
            items = r._asdict()
            # print(items)
            if r.pacientes_id not in treated_res.keys():
                treated_res[r.pacientes_id] = {"data": {"id": r.pacientes_id, "pulmonar": [], "cardiaco": []}}
            treated_res[r.pacientes_id]["data"]["cardiaco"].append(create_treated_res_fields(keys, items, ["pacientes_id"]))
            treated_res[r.pacientes_id]["data"]["cardiaco"][-1]["datetime"] = treated_res[r.pacientes_id]["data"]["cardiaco"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    # print(treated_res)


    if form["type"] in ["pulmonar", "both"]:
        pulmonar = (
            mysql.select(
                IndicePulmonar.indice_pulmonar,
                IndicePulmonar.pacientes_id,
                IndicePulmonar.datetime,
                IndicePulmonar.indice_pulmonar.label("y"),
                (func.unix_timestamp(IndicePulmonar.datetime)*1000).label("x")
            )
            .where(
                IndicePulmonar.pacientes_id == id
            )
            .where(
                between(
                    IndicePulmonar.datetime, f"{form["date"]} 00:00:00", f"{form["final_date"]} 23:59:59"
                )
            )
            .order_by(
                IndicePulmonar.datetime
            )
        )

        res_pulmonar = session.execute(pulmonar).all()
        for r in res_pulmonar:
            keys = r._fields
            break
        for r in res_pulmonar:
            items = r._asdict()
            # print(items)
            if r.pacientes_id not in treated_res.keys():
                treated_res[r.pacientes_id] = {"data": {"id": r.pacientes_id, "pulmonar": [], "cardiaco": []}}
            treated_res[r.pacientes_id]["data"]["pulmonar"].append(create_treated_res_fields(keys, items, ["pacientes_id"]))
            treated_res[r.pacientes_id]["data"]["pulmonar"][-1]["datetime"] = treated_res[r.pacientes_id]["data"]["pulmonar"][-1]["datetime"].strftime("%d/%m/%Y %H:%M")

    treated_res = [treated_res[paciente_id] for paciente_id in treated_res.keys()]
    return jsonify(treated_res)


# Consultar o valor mais recente de uma característica de um paciente que esteja entre um intervalo de valores a ser especificado na chamada da API;
@app.route('/api/patient/<id>/indices_between', methods=['POST'])
def getPatientIndiceBetween(id):
    # print(IndicePulmonar["indice_pulmonar"])
    form = request.get_json()
    table = IndiceCardiaco if form["tipo"] == "cardiaco" else IndicePulmonar
    indice = "indice_cardiaco" if form["tipo"] == "cardiaco" else "indice_pulmonar"
    query = mysql.select(
        table
    ).where(
        table.pacientes_id == id
    ).where(
        between(
            table[indice], form["min_indice"], form["max_indice"]
        )
    ).order_by(
        table.datetime
    )
    treated_res = []
    if form["historic_last"] == "LIMIT 1":
        res = session.scalars(
            query
        ).first()
        print(res)
        treated_res.append(create_treated_res_class(res, ["pacientes_id", "id"]))
        treated_res[-1]["datetime"] = treated_res[-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    else:
        res = session.scalars(
            query
        ).all()
        for r in res:
            treated_res.append(create_treated_res_class(r,["pacientes_id","id"]))
            treated_res[-1]["datetime"] = treated_res[-1]["datetime"].strftime("%d/%m/%Y %H:%M")
    return jsonify(treated_res)


#Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API.
# +email e cpf
@app.route('/api/patient/<method>/<search>', methods=['GET'])
def getPatient(method,search):
    if method in ["nome", "email"]:
        res = session.execute(
            mysql.select(
                *(Pacientes[c] for c in Pacientes.__table__.columns.keys() if c not in ["senha"])
            ).where(
                Pacientes[method].ilike(f"%{unquote_plus(search)}%")
            ).order_by(
                Pacientes[method]
            )
        ).all()
    elif method == "cpf":
        res = session.execute(
            mysql.select(
                *(Pacientes[c] for c in Pacientes.__table__.columns.keys() if c not in ["senha"])
            ).where(
                Pacientes[method] == search
            )
        ).one_or_none()
        treated_res = []
        keys = res._fields
        items = res._asdict()
        treated_res.append(create_treated_res_fields(keys, items))
        return jsonify(treated_res)
    else:
        return jsonify([])
    
    treated_res = []
    keys = res[0]._fields
    for r in res:
        items = r._asdict()
        treated_res.append(create_treated_res_fields(keys,items))
    return jsonify(treated_res)


@app.route('/api/patient/<id>', methods=['GET'])
def getPatientById(id):
    # form = request.get_json()

    res = session.execute(
        mysql.select(
            *(Pacientes[c] for c in Pacientes.__table__.columns.keys() if c not in ["senha"])
        ).where(
            Pacientes.id == id
        )
    ).one_or_none()

    treated_res = []
    keys = res._fields
    items = res._asdict()
    treated_res.append(create_treated_res_fields(keys, items))
    return jsonify(treated_res)






if __name__ == '__main__':
    app.run()
