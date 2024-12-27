import base64

def process_image(image_file):
    if image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')
    return None