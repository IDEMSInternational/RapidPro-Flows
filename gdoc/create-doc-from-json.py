from __future__ import print_function
import pickle
import os.path
import json
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

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
  
    title = 'PLH Doc From json'
    
    body = {
        "title": title
    }
    doc = service.documents().create(body=body).execute()
    print('Created document with title: {0}'.format(doc.get('title')))
    DOCUMENT_ID = doc.get('documentId')

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
    
    # load json file
    with open('plh_master_for_doc.json') as json_file:
        data = json.load(json_file)
    
    # json is a list of 1 element so extract this
    data = data[0]
    requests = []
    requests.append(insert_text("plh_master_for_doc", "Title", first = True))
    for i in data:
        make_requests(i, data[i], level = 1, requests = requests)
    
    requests.reverse()
    #requests = []
    #requests.append(insert_text(text = "Some more text under H2", style = ''))
    #requests.append(insert_text(text = "Head 2", style = 'HEADING_2'))
    #requests.append(insert_text(text = "Some para text", style = ''))
    #requests.append(insert_text(text = "Head 1", style = 'HEADING_1', first = True))

    result = service.documents().batchUpdate(
        documentId=DOCUMENT_ID, body={'requests': requests}).execute()
    print('Sent requests to document: {0}'.format(len(requests)))

if __name__ == '__main__':
    main()
