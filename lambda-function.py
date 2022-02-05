import json
import urllib.request
import logging
from collections import OrderedDict
import pprint

def lambda_handler(event, context):
    message = event['Records'][0]['Sns']['Message']
    send_data = {
        "text": message,
    }
    send_text = json.dumps(send_data)
    request = urllib.request.Request(
        "https://hooks.slack.com/services/[Slackで作成したWebhook URL]", 
        data=send_text.encode('utf-8'), 
        method="POST"
    )
    with urllib.request.urlopen(request) as response:
        response_body = response.read().decode('utf-8')