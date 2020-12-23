from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect
from Store.db import db
from bson.json_util import dumps

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.route("/product/list")
def product_list():
    all_products = db.product.find({}, 
                    {'image':1, 'name':1, 'category':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/existing/list")
def existing_list():
    all_products = db.product.find({}, 
                    {'storehouse':1 ,'name':1 ,'count':1, 'price':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

