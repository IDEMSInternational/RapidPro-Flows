from __future__ import print_function
import pickle
import os.path
import json
from os import listdir
from os.path import isfile, join
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import time

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents']





def main():
    """Shows basic usage of the Docs API.
    Prints the title of a sample document.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('docs', 'v1', credentials=creds)
    drive_service = build('drive', 'v3', credentials=creds)
  

    file_metadata = {
        'name': 'ParenText',
        'mimeType': 'application/vnd.google-apps.folder'
    }
    folder_file = drive_service.files().create(body=file_metadata,
                                        fields='id').execute()
    parent_id = folder_file.get('id')

    
   
    # get names of the JSON files
    
    file_names = [f for f in listdir('./JSON_files') if isfile(join('./JSON_files', f))]
    flows_names = [line.strip('\n').strip('PLH - ') for line in file_names]
    flows_names = [line[:-5] for line in flows_names]
   
    
    folders_names_in_strings = []
    max_depth = 3

    for name in flows_names:
        name_list = name.split(" - ")
        name_list.pop()

        if len(name_list) > max_depth:
            name_list.pop()

        folders_names_in_strings.append(' - '.join(name_list))

    
    folders_names_in_strings = list(set(folders_names_in_strings))
    folders_in_lists = list(fol.split(" - ") for fol in folders_names_in_strings)

  
    folders_IDs = {}
    parent_folders_path = ""
    
    
    def create_layer_of_folders(folders_in_lists, parent_folders_path, parent_id):
        curr_layer_folders_to_create = list(set([folder[0] for folder  in folders_in_lists]))
        
        
        for folder in curr_layer_folders_to_create:
            
            file_metadata = {
            'name': folder,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [parent_id]
            }
            folder_file = drive_service.files().create(body=file_metadata,
                                                fields='id').execute()
            folders_IDs[parent_folders_path + folder + ' - '] = folder_file.get('id') 
            
            new_folders_in_lists = list(filter(lambda fol: (len(fol)>0 and fol[0]== folder), folders_in_lists))
            
            
            for fol in new_folders_in_lists:
                fol.pop(0)
                
            
            
            new_folders_in_lists = list(filter(lambda fol: len(fol)>0, new_folders_in_lists))
           


            if len(new_folders_in_lists) != 0:
                new_parents_folder_path = parent_folders_path + folder + ' - '
                create_layer_of_folders(new_folders_in_lists,new_parents_folder_path,folder_file.get('id'))
        


    create_layer_of_folders(folders_in_lists, parent_folders_path, parent_id)
    
    ##################################################################################
     
    # functions to create google docs
    def insert_text(text, style, first = False):
        requests = [
            {
                'insertText': {
                    'location': {
                        'index': 1,
                    },
                    'text': text if first else "\n"+text
                }
            }
        ]
        if style:
            requests.append(
                {
                    'updateParagraphStyle': {
                        'range': {
                            'startIndex': 1 if first else 2,
                            'endIndex':  len(text)
                        },
                        'paragraphStyle': {
                            'namedStyleType': style,
                        },
                        'fields': 'namedStyleType'
                    }
                }
            )
        return requests

    def make_requests(key, value, level, requests):
        requests.append(insert_text(text = key, style = 'HEADING_' + str(level)))
        if isinstance(value, str):
            req = insert_text(text = value, style = '')
            requests.append(req)
        elif isinstance(value, dict):
            for i in value:
                make_requests(i, value[i], level = level + 1, requests = requests)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    for i in item:
                        make_requests(i, item[i], level = level + 1, requests = requests)
                elif isinstance(item, str):
                    req = insert_text(text = item, style = '')
                    requests.append(req)

        requests
    
    # create google docs#############################################
    
    for fl in range(len(flows_names)):
        time.sleep(6)
        # initialise the doc
        curr_flow = flows_names[fl]
        curr_flow_split = curr_flow.split(" - ")
        title = curr_flow_split[-1]
        curr_flow_split.pop()
        curr_flow_path = ' - '.join(curr_flow_split)

    
        body = {
            "title": title,
        }
        
        doc = service.documents().create(body=body).execute()
        print('Created document with title: {0}'.format(doc.get('title')))
        DOCUMENT_ID = doc.get('documentId')
    
        # load json file
        with open('./JSON_files/' + file_names[fl], encoding="utf8") as json_file:
            data = json.load(json_file)
    
   
        requests = []
        
        for i in data:
            make_requests(i, data[i], level = 1, requests = requests)
        
        requests.reverse()
        
        result = service.documents().batchUpdate(
            documentId=DOCUMENT_ID, body={'requests': requests}).execute()
        print('Sent requests to document: {0}'.format(len(requests)))

        # move document to correct folder
        folder_id = folders_IDs[curr_flow_path + ' - ']
        # Retrieve the existing parents to remove
        file = drive_service.files().get(fileId=DOCUMENT_ID,
                                        fields='parents').execute()
        previous_parents = ",".join(file.get('parents'))
        # Move the file to the new folder
        file = drive_service.files().update(fileId=DOCUMENT_ID,
                                            addParents=folder_id,
                                            removeParents=previous_parents,
                                            fields='id, parents').execute()
        
      

        



    
 


    
    



if __name__ == '__main__':
    main()
