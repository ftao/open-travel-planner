#!/usr/bin/env python
'''
parse station_name.js file

usage:
  parse_station_name.py [-i INFILE] [-o OUTFILE] [-f FORMAT]

options:

  -i INFILE --input=INFILE        input file     [default: -]
  -o OUTFILE --output=OUTFILE     output file    [default: -]
  -f FORMAT --format=FORMAT       output format  [default: default]


'''
import docopt
import sys



def parse(text):
    start = text.find("'")
    end = text.find("'", start +1)

    data = text[start+1:end]
    data = data[1:] #remove first @
    stations = data.split('@')
    result = []
    for station in stations:
        parts = station.split('|')
        result.append(parts)

    return result


def format_record(record, fmt=None):
    if fmt == 'csv':
        return ','.join(record) + '\n'
    else:
        return repr(record) + '\n'

def main(inf, outf, fmt=None):
    text = inf.read()
    records = parse(text)
    for record in records:
        outf.write(format_record(record, fmt))

if __name__ == "__main__":
    args = docopt.docopt(__doc__, version='0.1')

    if args['--input'] == '-':
        inf = sys.stdin
    else:
        inf = open(args['--input'], 'r')

    if args['--output'] == '-':
        outf = sys.stdout
    else:
        outf = open(args['--ouput'], 'w')

    main(inf, outf, args['--format'])
