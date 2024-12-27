import ollama

def generate_chat_response(messages):
    response = ollama.chat(model='llama3.2-vision', messages=messages, stream=True)
    for chunk in response:
        if 'message' in chunk and 'content' in chunk['message']:
            yield chunk['message']['content']