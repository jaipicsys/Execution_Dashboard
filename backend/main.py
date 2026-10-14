from flask import Flask
from flask_cors import CORS

import config
import db
from routes import api


def create_app():
    app = Flask(__name__)
    CORS(app, origins=config.CORS_ORIGINS)
    db.init_db()
    app.register_blueprint(api, url_prefix="/api")
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
