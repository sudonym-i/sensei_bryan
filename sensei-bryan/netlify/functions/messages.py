from openai import OpenAI
import json
import os

#meta-llama/llama-3.2-1b-instruct:free
#              ^^ Free but terrible LLM model - Definitely use for testing however

# openai/gpt-4.1-nano
#          ^^ Not free, but affordable and much better preformance

MODEL = "mistralai/mistral-nemo"


# def get_response(prompt):
   
#     print("......")
    
#     completion = client.chat.completions.create(
#         model = MODEL,
#         messages=[{"role": "user","content": prompt}]
#     )

#     print(completion.choices[0].message.content)

#     print("\n\n") # temporary spacing for demo
#     return False

def handler(event, context):
    # Handle CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
    
    # Handle preflight requests
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse the request body
        body = json.loads(event['body'])
        input_text = body.get('text', '')
        
        if not input_text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No text provided'})
            }

        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=os.environ.get('ai_auth'))
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
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }