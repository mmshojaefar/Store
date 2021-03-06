import os
from flask import Flask
from flask import render_template


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="&a*mP_5>ZJs#!@12/",
        JSON_AS_ASCII = False
    )
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from Store import main, admin, api
    app.register_blueprint(api.bp)
    app.register_blueprint(main.bp)
    app.register_blueprint(admin.bp)
    app.register_error_handler(404, page_not_found)

    return app


def page_not_found(e):
  return(render_template('404.html'))

