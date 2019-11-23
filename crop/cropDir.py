import numpy
import os
from PIL import Image, ImageDraw

def createPolygon(list):
	polygon = []
	
	for i in range(0, len(list), 2):
		t = (int(list[i]), int(list[i+1]))
		polygon.append(t)

	return(polygon)

def createRectFromPolygon(list):
	x = 0
	y = 0
	x1 = 0
	y1 = 0
	
	polygon = []

	x = int(list[0])
	y = int(list[1])
	x1 = x
	y1 = y
	
	for i in range(2, len(list), 2):
	
		v = int(list[i])
		v1 = int(list[i+1])
		
		if(v < x):
			x = v
		
		if(v > x1):
			x1 = v
			
		if(v1 < y):
			y = v1
		
		if(v1 > y1):
			y1 = v1	

	polygon = (x, y, x1, y1)

	return(polygon)
	
	
def readPolygon(txtPath, imgPath, cropPath, cropRectPath, imageToCrop):
	index = 0;
	f = open(txtPath + imageToCrop + ".txt","r")
	lines = f.readlines()
	
	for line in lines:
		if(len(line) > 1):
			coords = line.split(',')
			polygon = createPolygon(coords)

			#Crop polygon
			targetImgName = crop(imgPath, cropPath, imageToCrop, ".jpg", index, polygon)
			
			#Crop to rect
			polygon = createRectFromPolygon(coords)
			cropRect(imgPath, cropRectPath, imageToCrop, ".jpg", str(index) + "_rect", polygon)
			
			index = index + 1
			
def cropRect(imgPath, cropRectPath, imageToCrop, extention, sufix, polygon):
	img  = Image.open(imgPath + imageToCrop + extention)
	area = img.crop(polygon)

	print(imgPath + imageToCrop + extention, " cropRect -> ",cropRectPath + imageToCrop + sufix + ".png")
	area.save(cropRectPath + imageToCrop + sufix + extention, 'png')
	area.close()

def crop(path, cropPath, imageToCrop, extention, index, polygon):

	# read image as RGB and add alpha (transparency)
	im = Image.open(path + imageToCrop + extention).convert("RGBA")
	
	# convert to numpy (for convenience)
	imArray = numpy.asarray(im)

	# create mask
	maskIm = Image.new('L', (imArray.shape[1], imArray.shape[0]), 0)
	ImageDraw.Draw(maskIm).polygon(polygon, outline=1, fill=1)
	mask = numpy.array(maskIm)

	# assemble new image (uint8: 0-255)
	newImArray = numpy.empty(imArray.shape,dtype='uint8')

	# colors (three first columns, RGB)
	newImArray[:,:,:3] = imArray[:,:,:3]

	# transparency (4th column)
	newImArray[:,:,3] = mask*255

	# back to Image from numpy
	newIm = Image.fromarray(newImArray, "RGBA")
	
	targetImgName = imageToCrop + str(index) + ".png"

	print(path + imageToCrop + extention , " crop -> ", cropPath + targetImgName)

	newIm.save(cropPath + targetImgName)
	return(targetImgName)

#Main code
def main():
	txtPath="../process/metadata/"
	sourcePath="../process/images/"
	cropPath="../process/crop/"
	cropRectPath="../process/cropRect/"

	files = os.listdir(txtPath)

	for file in files:
		fileName = file.split('.')
		readPolygon(txtPath, sourcePath, cropPath, cropRectPath, fileName[0])

if __name__ == '__main__':
	main()
