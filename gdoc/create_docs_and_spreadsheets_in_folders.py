from __future__ import print_function
import pickle
import os.path
import json
from os import listdir
from os.path import isfile, join
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
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

    
    drive_service = build('drive', 'v3', credentials=creds)
    doc_service = build('docs', 'v1', credentials=creds)
    spreadsheet_service = build('sheets', 'v4', credentials=creds)
    
    
    # create external folder
    file_metadata = {
        'name': 'ParenText Jamaica',
        'mimeType': 'application/vnd.google-apps.folder'
    }
    folder_file = drive_service.files().create(body=file_metadata,
                                        fields='id').execute()
    parent_id = folder_file.get('id')
    parentext_folder_id = parent_id

    # get names of the JSON files for docs
    
    doc_file_names = [f for f in listdir('./JSON_files') if isfile(join('./JSON_files', f))]
    doc_flows_names = [line.strip('\n').replace('PLH - ','') for line in doc_file_names]
    doc_flows_names = [line[:-5] for line in doc_flows_names] # remove .json from string

    # get names of the csv files for sheets
    
    sheet_file_names = [f for f in listdir('./csv_files') if isfile(join('./csv_files', f))]
    sheet_flows_names = [line.strip('\n') for line in sheet_file_names]
    sheet_flows_names = [line[:-4] for line in sheet_flows_names] # remove .csv from string

    # combine the 2 lists
    flows_names = doc_flows_names + sheet_flows_names
    # create list for building folder structure from the names of the files
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

    # variable for saving the IDs of the created folders and files
    folders_IDs = {}
    files_IDs = {}
    files_urls = {}

    parent_folders_path = ""

    # function to create the folder structure
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

    
    # create the folder structure
    create_layer_of_folders(folders_in_lists, parent_folders_path, parent_id)

    # save the IDS of the created folders
    folders_IDs['ParenText'] = parentext_folder_id

    with open('./folders_IDs.json', 'w') as outfile:
        json.dump(folders_IDs, outfile)


 ##################################################################################
     
    # functions to create spreadsheets

    def export_csv_file(file_path: str, name: str):
        if not os.path.exists(file_path):
            print("file path does not exists")
            return
        try:
            file_metadata = {
                'name' : name,
                'mimeType' : 'application/vnd.google-apps.spreadsheet',
                'properties': {
                    'title': title
                }
            }

            media = MediaFileUpload(filename = file_path, mimetype = 'text/csv')
            response = drive_service.files().create(
                media_body = media,
                body = file_metadata
            ).execute()

            
            return response
        except Exception as e:
            print(e)
            return
    
    
    # create spreadsheets #############################################
    
    for fl in range(len(sheet_flows_names)):
        time.sleep(6)
        # define title
        curr_flow = sheet_flows_names[fl]
        curr_flow_split = curr_flow.split(" - ")
        title = curr_flow_split[-1]
        curr_flow_split.pop()
        curr_flow_path = ' - '.join(curr_flow_split)

        

        
        csv_file_path = './csv_files/' + sheet_file_names[fl]

        spreadsheet_file = export_csv_file(csv_file_path,title)
        print('Created spreadsheet with title: ' + title)

        DOCUMENT_ID = spreadsheet_file.get('id')

        files_IDs[curr_flow] = DOCUMENT_ID
        files_urls[curr_flow] = "https://docs.google.com/spreadsheets/d/" + DOCUMENT_ID + "/edit#gid=0"
        

        #formatting of the file (column width, background color, text wrapping)
        ranges = []  
        # True if grid data should be returned.
        # This parameter is ignored if a field mask was set in the request.
        include_grid_data = False

        request = spreadsheet_service.spreadsheets().get(spreadsheetId=DOCUMENT_ID, includeGridData=include_grid_data)
        response = request.execute()
        
        sheetId = response.get("sheets")[0].get("properties").get("sheetId")
        
        n_rows = response.get("sheets")[0].get("properties").get("gridProperties").get("rowCount")
       

        formatting_requests = []

        formatting_requests.append(
            {"repeatCell":{
                "range": {
                "sheetId": sheetId,
                "startRowIndex": 1,
                "endRowIndex": n_rows-1,
                "startColumnIndex": 4,
                "endColumnIndex": 5
                },
                "cell": {
                    'userEnteredFormat': {
                            "backgroundColor":{ 
                                    "red": 0.39,
                                    "green": 0.65, 
                                    "blue": 0.39,
                                    "alpha": 1 	
                                }
                        }
                },
                "fields": 'userEnteredFormat.backgroundColor'
                }

            }
        
        )

        formatting_requests.append(
            {"repeatCell":{
                "range": {
                "sheetId": sheetId,
                "startRowIndex": 0,
                "startColumnIndex": 0
                },
                "cell": {
                    'userEnteredFormat': {
                            "wrapStrategy": "WRAP"
                        }
                },
                "fields": 'userEnteredFormat.wrapStrategy'
                }

            }
        
        )
        
    

        formatting_requests.append( {
            "updateDimensionProperties": {
                "range": {
                "sheetId": sheetId,
                "dimension": "COLUMNS",
                "startIndex": 4,
                "endIndex": 5
                },
                "properties": {
                "pixelSize": 300
                },
                "fields": "pixelSize"
                }
            },
        )

        formatting_requests.append( {
            "updateDimensionProperties": {
                "range": {
                "sheetId": sheetId,
                "dimension": "COLUMNS",
                "startIndex": 0,
                "endIndex": 2
                },
                "properties": {
                "pixelSize": 150
                },
                "fields": "pixelSize"
                }
            },
        )

        formatting_requests.append( {
            "updateDimensionProperties": {
                "range": {
                    "sheetId": sheetId,
                    "dimension": "COLUMNS",
                    "startIndex": 5,
                    "endIndex": 16
                },
                "properties": {
                "pixelSize": 200
                },
                "fields": "pixelSize"
                }
            },
        )

        

        spreadsheet_service.spreadsheets().batchUpdate(
            spreadsheetId=DOCUMENT_ID, body={'requests': formatting_requests}).execute()
        print('Sent requests to document: {0}'.format(len(formatting_requests)))
    
        

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
    
    # create google docs #############################################
    
    for fl in range(len(doc_flows_names)):
        time.sleep(6)
        # initialise the doc
        curr_flow = doc_flows_names[fl]
        curr_flow_split = curr_flow.split(" - ")
        title = curr_flow_split[-1]
        curr_flow_split.pop()
        curr_flow_path = ' - '.join(curr_flow_split)

    
        body = {
            "title": title,
        }
        
        doc = doc_service.documents().create(body=body).execute()
        print('Created document with title: {0}'.format(doc.get('title')))
        DOCUMENT_ID = doc.get('documentId')

        files_IDs[curr_flow] = DOCUMENT_ID
        files_urls[curr_flow] = "https://docs.google.com/document/d/" + DOCUMENT_ID + "/edit"
    
        # load json file 
        with open('./JSON_files/' + doc_file_names[fl], encoding="utf8") as json_file:
            data = json.load(json_file)
    
   
        requests = []
        
        for i in data:
            make_requests(i, data[i], level = 1, requests = requests)
        
        requests.reverse()
        
        result = doc_service.documents().batchUpdate(
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




    #create files with files IDS and urls
    with open('./files_IDs.json', 'w') as outfile:
        json.dump(files_IDs, outfile)

    with open('./files_urls.json', 'w') as outfile:
        json.dump(files_urls, outfile)



if __name__ == '__main__':
    main()
