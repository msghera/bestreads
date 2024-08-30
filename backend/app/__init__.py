from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.routes import auth, reviews, people

    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(reviews, url_prefix='/reviews')
    app.register_blueprint(people, url_prefix='/people')

    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    return app
