import os.path
from os import listdir
from os.path import isfile, join

def main():
    doc_file_names = [f for f in listdir('./JSON_files') if isfile(join('./JSON_files', f))]
    doc_flows_names = [line.strip('\n').replace('PLH - ','') for line in doc_file_names]
    doc_flows_names = [line[:-5] for line in doc_flows_names] # remove .json from string
    print(doc_file_names)
    print(doc_flows_names)
    
if __name__ == '__main__':
    main()
