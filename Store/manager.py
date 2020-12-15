from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect

bp = Blueprint("manager", __name__, url_prefix="/manager")

@bp.route("/")
def basket():
    return render_template("stuff.html")

@bp.route("/order")
def index():
    return render_template("order.html")

@bp.route("/exsiting")
def stuff():
    return render_template("exsiting.html")

@bp.route("/storehouse")
def stuff():
    return render_template("storehouse.html")

@bp.route("/login")
def stuff():
    return render_template("login.html")