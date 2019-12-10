import os, shutil
import json
import urllib.request
import subprocess
import sys
from app import app
from flask import Flask, request, redirect, jsonify, send_from_directory, send_file
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def clearFolder(folder):

	print("clearFolder ->", clearFolder)
	for the_file in os.listdir(folder):
		file_path = os.path.join(folder, the_file)
		try:
			if os.path.isfile(file_path):
				os.unlink(file_path)
			elif os.path.isdir(file_path):
				shutil.rmtree(file_path)
		except Exception as e:
			print('Failed to delete %s. Reason: %s' % (file_path, e))	

def executeProcess():
	command = 'exec.bat'

	process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
	output, error = process.communicate()
	return output

	
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/file-upload', methods=['POST'])
def upload_file():
	# check if the post request has the file part
	if 'file' not in request.files:
		resp = jsonify({'message' : 'No file part in the request'})
		resp.status_code = 400
		return resp
	file = request.files['file']
	if file.filename == '':
		resp = jsonify({'message' : 'No file selected for uploading'})
		resp.status_code = 400
		return resp
	if file and allowed_file(file.filename):	
		#Limpia las imagenes
		basePath = "../process/"
		clearFolder(basePath + "crop")
		clearFolder(basePath + "cropRect")
		clearFolder(basePath + "images")
		clearFolder(basePath + "location")
		clearFolder(basePath + "mask")
		clearFolder(basePath + "metadata")
	
		filename = secure_filename(file.filename)
		
		print("filename ->", filename)
		
		file.save(os.path.join(app.config['TO_PROCESS_IMAGES'], filename))
		
		ret = executeProcess()
		return ret
	else:
		resp = jsonify({'message' : 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
		resp.status_code = 400
		return resp
		
@app.route("/image/<image_name>")
def get_image(image_name):
	try:
		f = "../process/images/" + image_name
		return send_file(f, mimetype='image/jpg')
	except FileNotFoundError:
		abort(404)

@app.route("/localization/<image_name>")
def get_location(image_name):
	try:
		f = "../process/localization/" + image_name
		return send_file(f, mimetype='image/jpg')
	except FileNotFoundError:
		abort(404)
		
if __name__ == "__main__":
    app.run(host='0.0.0.0')