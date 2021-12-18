from PIL import Image
import sys
import json

def run(raw_file_path, level_name=None, location=None, quote=None):
  file_name = raw_file_path[4:-4]
  if level_name is None:
    level_name = file_name
  if location is None:
    location = '???'

  raw_file = Image.open(raw_file_path, 'r')
  width, height = raw_file.size

  raw_file_data = list(raw_file.getdata())
  data = []
  for i in range(height):
    data.append(list(map(lambda x: 1 if x[3] < 255 else 0, raw_file_data[(i * width):((i + 1) * width)])))

  game_data = {
    'name': level_name,
    'location': location,
    'quote': quote if quote != None else '',
    'height': height,
    'width': width,
    'file_name': file_name + '.png',
    'data': data,
  }

  converted_file_path = 'converted/' + file_name + '.json'
  converted_file = open(converted_file_path, 'w')
  json.dump(game_data, converted_file, indent=2)
  print('Converted to ' + converted_file_path)

try:
  if len(sys.argv) > 1:
    raw_file_path = sys.argv[1]
    if len(sys.argv) > 2:
      run(raw_file_path, sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None, sys.argv[4] if len(sys.argv) > 4 else None)
    else:
      run(raw_file_path)
  else:
    print('python3 converter.py {{raw_file_path}} {{level_name}} {{location}} {{quote}}')
except RuntimeError as e:
  print('ERROR: ' + str(e))