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


    # load json file 
    with open('./shared_folders/Philippines/files_urls.json', encoding="utf8") as json_file:
        file_urls = json.load(json_file)

    for file_name, url in file_urls.items():
        
        if url.startswith("https://docs.google.com/document"):
            time.sleep(3)
            DOCUMENT_ID = url.replace("https://docs.google.com/document/d/", "").replace("/edit","")

            result_doc = doc_service.documents().get(documentId=DOCUMENT_ID).execute()
            doc_content = result_doc.get('body').get('content')
            gdoc = open("./shared_folders/Philippines/reviewed_version/JSON_files/gdoc_json/gdoc_" + file_name + ".json", "w")
            json.dump(doc_content, gdoc, indent=4, sort_keys=True)
            gdoc.close()
                    
        """elif url.startswith("https://docs.google.com/spreadsheets/d/"):
            time.sleep(1)
            DOCUMENT_ID = url.replace("https://docs.google.com/spreadsheets/d/","").replace("/edit#gid=0","")
            include_grid_data = False
            request = spreadsheet_service.spreadsheets().get(spreadsheetId=DOCUMENT_ID, includeGridData=include_grid_data)
            response = request.execute()
            sheetName = response.get("sheets")[0].get("properties").get("title")
            range_name = sheetName

            result = spreadsheet_service.spreadsheets().values().get(spreadsheetId=DOCUMENT_ID, range=range_name).execute()
            rows = result.get('values', [])
            sheet_json = open('./shared_folders/Philippines/reviewed_version/csv_files/' + file_name + ".json", "w")
            json.dump(rows, sheet_json)
            sheet_json.close()
        """


          
    


if __name__ == '__main__':
    main()