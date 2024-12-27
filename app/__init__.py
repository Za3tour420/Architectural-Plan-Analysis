from flask import Flask
from .routes import bp

def create_app():
    app = Flask(__name__)
    app.config.from_object("config")

    with app.app_context():
        app.register_blueprint(bp)

    return app