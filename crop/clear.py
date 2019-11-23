import os, shutil, argparse

parser = argparse.ArgumentParser(description='Base Path')
parser.add_argument('--basePath', default='./process/', help='base path')

args = parser.parse_args()

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
	#basePath="../process/"
	clearFolder(basePath + "crop")
	clearFolder(basePath + "cropRect")
	clearFolder(basePath + "images")
	clearFolder(basePath + "location")
	clearFolder(basePath + "mask")
	clearFolder(basePath + "metadata")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Base path')
    parser.add_argument('--basePath', required=True, help='Base path')
    
    args = parser.parse_args()
    main(basePath=args.basePath)