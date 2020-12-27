from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect
from Store.db import db
from bson.json_util import dumps

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/product/list/")
def product_list():
    all_products = db.product.find({}, 
                    {'image':1, 'name':1, 'category':1, '_id':0})
    json_string = dumps(all_products)
    return json_string


@bp.route("/existing/list/")
def existing_list():
    all_products = db.product.find({}, 
                    {'storehouse':1 ,'name':1 ,'count':1, 'price':1, '_id':0})
    json_string = dumps(all_products)
    return json_string


@bp.route("/existing/edit/", methods=['POST'])
def existing_edit():
    if request.method == 'POST':
        storehouse = request.form['storehouse']
        name = request.form['name']
        price = request.form['price']
        count = request.form['count']
    print(11111111111111111111111111)
    print(storehouse)
    print(name)
    print(price)
    print(count)
    print(11111111111111111111111111)
    return {}


@bp.route("/existing/delete/", methods=['GET'])
def existing_delete():
    name = request.args.get('name')
    storehouse = request.args.get('storehouse')
    print(2222222222222222222222222)
    print(storehouse)
    print(name)
    print(2222222222222222222222222)
    return {}

@bp.route("/existing/add/", methods=['POST'])
def existing_add():
    # if request.method == 'POST':
        
    return {}