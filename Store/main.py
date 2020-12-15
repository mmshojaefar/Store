from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect

bp = Blueprint("main", __name__)

@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/basket/")
def basket():
    return render_template("basket.html")

@bp.route("/category/")
def category():
    return render_template("category.html")

@bp.route("/stuff/<name>/")
def stuff(name):
    return render_template("stuff.html") # <<<<<<<<<<<<<<<<<<<<

@bp.route("/record/")
def record(name):
    return render_template("record.html")
