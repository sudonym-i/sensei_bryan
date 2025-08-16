from openai import OpenAI
import json
import os

MODEL = "mistralai/mistral-nemo"


def handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
    
    # Debug logging
    print("Function triggered")
    print("Event method:", event.get('httpMethod'))
    
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        body = json.loads(event['body'])
        input_text = body.get('text', '')
        
        print(f"Received input: {input_text}")
        
        if not input_text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No input text provided'})
            }

        api_key = os.environ.get('auth_ai')
        if not api_key:
            print("API key not found!")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'API key not configured'})
            }

        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": input_text}]
        )
        
        result = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'result': result})
        }
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }