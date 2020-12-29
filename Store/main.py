from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect
from Store.db import db, get_categories

bp = Blueprint("main", __name__)


@bp.route("/")
def index():
    pri = get_categories()
    return render_template("index.html", pr=pri)


@bp.route("/basket/")
def basket():
    return render_template("basket.html")


@bp.route("/category/<ct>")
def category(ct):
    categore_product = db.product.find(
                        {'category':ct},
                        {'name':1,
                         '_id':0, 
                        'price':1, 
                        'img':1});
    return render_template("category.html", 
                            category = list(categore_product),
                            name = ct)


@bp.route("/product/<name>/")
def product(name):
    product = db.product.find(
                        {'name':name},
                        {'name':1,
                         'storehouse':1,
                         'price':1, 
                         'image':1,
                         'category':1,
                         'subcategory':1,
                         'discription':1,
                         '_id':0,});

    return render_template("product.html", products=list(product) )


@bp.route("/basket/approve/")
def approve():
    return render_template("approve.html")
