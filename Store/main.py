from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect
from Store.db import *

bp = Blueprint("main", __name__)


@bp.route("/")
def index():
    pri = get_categories()
    return render_template("index.html", pr=pri)


@bp.route("/basket/")
def basket():
    return render_template("basket.html")


@bp.route("/category/<name>")
def category(name):
    categore_product = db.product.find(
                        {'category':name},
                        {'name':1,
                         '_id':0, 
                        'price':1, 
                        'img':1}
                        );
    return render_template("category.html", 
                            category = list(categore_product),
                            name = name)


@bp.route("/product/<name>/")
def product(name):
    return render_template("product.html")  # <<<<<<<<<<<<<<<<<<<<


@bp.route("/basket/approve/")
def approve():
    return render_template("approve.html")
