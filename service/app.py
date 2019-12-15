from flask import Flask

UPLOAD_FOLDER = 'C:/work/ia/curso/TP03/process/images'

app = Flask(__name__)
app.secret_key = "secret key"
app.debug = True

app.config["LOCATION_IMAGES"] = "../process/location/"
app.config["TO_PROCESS_IMAGES"] = "../process/images/"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024