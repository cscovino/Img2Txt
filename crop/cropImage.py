import numpy
from PIL import Image, ImageDraw

# read image as RGB and add alpha (transparency)
im = Image.open("result/res_hqdefault.jpg").convert("RGBA")

# convert to numpy (for convenience)
imArray = numpy.asarray(im)

# create mask

polygon = [(64,57), (254,143), (222,215) ,(32,129)]

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
newIm.save("result/out.png")