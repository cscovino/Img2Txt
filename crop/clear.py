import os, shutil

def clearFolder(folder):
	for the_file in os.listdir(folder):
		file_path = os.path.join(folder, the_file)
		try:
			if os.path.isfile(file_path):
				os.unlink(file_path)
			elif os.path.isdir(file_path):
				shutil.rmtree(file_path)
		except Exception as e:
			print('Failed to delete %s. Reason: %s' % (file_path, e))

def main(basePath):
	basePath="../process/"
	clearFolder(basePath + "crop")
	clearFolder(basePath + "cropRect")
	clearFolder(basePath + "images")
	clearFolder(basePath + "location")
	clearFolder(basePath + "mask")
	clearFolder(basePath + "metadata")


if __name__ == '__main__':
	basePath = "../process/"
	main(basePath)
