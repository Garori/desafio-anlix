from flask import Flask, request
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)


users = {}
id = 0

class UserAPI(Resource):
    def get(self, name):
        if name in users.keys():
            return users[name]
        else:
            return "nao existe"

    def post(self, name):
        global id
        users[name] = {'name': name, 'id': id}
        id += 1
        # users.append(user)
        return users[name]
    
api.add_resource(UserAPI, "/users/<string:name>", endpoint = 'user')