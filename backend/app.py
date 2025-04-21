from flask import Flask, jsonify
from flask_mysqldb import MySQL
import os
app = Flask(__name__)
mysql = MySQL(app)
app.config["MYSQL_USER"] = os.environ.get("MYSQL_USER")
app.config["MYSQL_DB"] = os.environ.get("MYSQL_DB")
app.config["MYSQL_PASSWORD"] = os.environ.get("MYSQL_PASSWORD")
app.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")
# mysql = MySQL()


@app.route('/data', methods=['GET'])
def get_data():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM pacientes''')
    data = cur.fetchall()
    cur.close()
    print(data)
    return jsonify(data)


# print(app.config["MYSQL_USER"])

if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    # print(app.config["MYSQL_USER"])
    # with open("/home/A.txt","w") as f:
    #     f.write(app.config["MYSQL_USER"])
    #     f.write(app.config["MYSQL_DB"])
    #     f.write(app.config["MYSQL_PASSWORD"])
    #     f.write(app.config["MYSQL_HOST"])
    app.run()
