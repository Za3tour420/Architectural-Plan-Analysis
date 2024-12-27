from flask import Blueprint, request, render_template, Response
import base64
from .chat import generate_chat_response
from .utils import process_image

bp = Blueprint('main', __name__)

CHAT_TEMPLATE = [
    {
        'role': 'system',
        'content': (
            "Your name is Clark and you are part of the GenMinds group. "
            "You are a helpful assistant designed to analyze architectural house plans. "
            "You will assess the quality of the house structure based on an image and prompt provided and suggest improvements. "
            "Be concise, insightful, and rate the design on a scale of 1-10. Format responses clearly using headings, bold text, and bullet points. "
            "If asked an irrelevant question, politely redirect the user to the task at hand."
        ),
    },
]

@bp.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@bp.route("/analyze", methods=["POST"])
def analyze():
    user_prompt = request.form.get("user_prompt", "")
    image_file = request.files.get("file")

    image_data = process_image(image_file)
    messages = CHAT_TEMPLATE.copy()
    messages.append({'role': 'user', 'content': user_prompt, 'images': [image_data] if image_data else []})

    return Response(generate_chat_response(messages), content_type='text/plain')
