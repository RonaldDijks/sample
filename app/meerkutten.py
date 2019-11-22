import os
import json
import argparse
from pathlib import Path

# from JSON to Python
x1 =  '{ "name":"John", "age":30, "city":"New York"}'
y1 = json.loads(x1)

# from Python to JSON
x2 = {
  "name": "John",
  "age": 30,
  "city": "New York"
}
y2 = json.dumps(x2)


parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('integers', metavar='N', type=int, nargs='+',
                    help='an integer for the accumulator')
parser.add_argument('--sum', dest='accumulate', action='store_const',
                    const=sum, default=max,
                    help='sum the integers (default: find the max)')

args = parser.parse_args()
print(args.accumulate(args.integers))