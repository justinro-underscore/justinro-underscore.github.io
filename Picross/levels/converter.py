from PIL import Image
import sys
import json

def run(raw_file_path):
  raw_file = Image.open(raw_file_path, 'r')
  width, height = raw_file.size

  raw_file_data = list(raw_file.getdata())
  data = []
  for i in range(height):
    data.append(list(map(lambda x: [x[0], x[1], x[2], 1 if x[3] < 255 else 0], raw_file_data[(i * width):((i + 1) * width)])))
  
  converted_file_path = 'converted/' + raw_file_path[4:-4] + '.json'
  converted_file = open(converted_file_path, 'w')
  json.dump(data, converted_file, indent=2)
  print('Converted to ' + converted_file_path)

try:
  if len(sys.argv) > 1:
    raw_file_path = sys.argv[1]
    run(raw_file_path)
  else:
    print('python3 converter.py {{raw_file_path}}')
except RuntimeError as e:
  print('ERROR: ' + str(e))