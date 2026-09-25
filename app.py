from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route("/")
def inicio():
    return send_from_directory(".", "index.html")

@app.route("/universo")
def universo():
    return send_from_directory(".", "mi_universo.html")

@app.route("/script.js")
def javascript():
    return send_from_directory(".", "script.js")

if __name__ == "__main__":
    app.run(debug=True)