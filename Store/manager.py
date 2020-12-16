from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect

bp = Blueprint("manager", __name__, url_prefix="/manager")


@bp.route("/")
def stuff():
    stuff = ['کالای 1', 'کالای 2', 'کالای 3', 'کالای 4', 'کالای 5']
    return render_template("manager/stuff.html", stuff = stuff)


@bp.route("/order/")
def order():
    return render_template("manager/order.html")


@bp.route("/existing/")
def exsiting():
    return render_template("manager/existing.html")


@bp.route("/storehouse/")
def storehouse():
    stores = ['انبار شماره 1', 'انبار شماره 2', 'انبار شماره 3']
    return render_template("manager/storehouse.html", stores=stores)


@bp.route("/login/")
def login():
    return render_template("manager/login.html")
