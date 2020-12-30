from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect
from Store.db import db
from bson.json_util import dumps

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/product/list/")
def product_list():
    all_products = db.product.find({}, 
                    {'image':1, 'name':1, 'category':1, 'subcategory':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/product/edit/", methods=['POST'])
def product_edit():
    if request.method == 'POST':
        # image = request.form['image']
        name = request.form['name']
        category = request.form['category'].split('،')
        subcategory = request.form['subcategory'].split('،')
        if 'username' in session:
            db.product.update({
                # 'image' : image,
                'name' : name
            }, 
            {'$set' : {'category': category,
                    'subcategory': subcategory
            }})
        return 'SUCCESS'
    return 'FAILED'
    # return 'SUCCESS'


@bp.route("/product/delete/", methods=['GET'])
def product_delete():
    if request.method == 'POST':
        # image = request.form['image']
        name = request.form['name']
        category = request.form['category']
        if 'username' in session:
            db.product.remove({
                # 'image' : image,
                'name' : name,
                'category': category,
            })
        return 'SUCCESS'
    return 'FAILED'

@bp.route("/product/add/", methods=['POST'])
def product_add():
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        count = request.form['count']
        image = request.form['image']
        description = request.form['description']
        storehouse = request.form['storehouse']
        category = request.form['category'].split('،')
        subcategory = request.form['subcategory'].split('،')
        if 'username' in session:
            db.product.insert({
                'name' : name,
                'price': price,
                'count': count,
                'image' : image,
                'description': description,
                'storehouse': storehouse,
                'category': category,
                'subcategory': subcategory,
            })
        return 'SUCCESS'
    return 'FAILED'



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
        if 'username' in session:
            db.product.update({
                'storehouse' : storehouse,
                'name' : name
            }, 
            {'$set' : {'count': count,
                    'price': price
            }})
        return 'SUCCESS'
    return 'FAILED'


@bp.route("/existing/delete/", methods=['GET'])
def existing_delete():
    name = request.args.get('name')
    storehouse = request.args.get('storehouse')
    if 'username' in session:
        db.product.update({
            'storehouse' : storehouse,
            'name' : name
        }, 
        {'$set' : {'count': 0 } })
    return {}

@bp.route("/existing/add/", methods=['POST'])
def existing_add():
    if request.method == 'POST':
        storehouse = request.form['storehouse']
        name = request.form['name']
        price = request.form['price']
        count = request.form['count']
        category = request.form['category']
        # image = request.form['image']
        print(name, price, count, storehouse, category)
    return {}

@bp.route("/storehouse/list/")
def storehouse_list():
    all_products = db.storehouse.find({}, {'name':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/storehouse/edit/", methods=['POST'])
def storehosue_edit():
    # if request.method == 'POST':
    #     storehouse = request.form['storehouse']
    #     name = request.form['name']
    #     price = request.form['price']
    #     count = request.form['count']
    #     if 'username' in session:
    #         db.product.update({
    #             'storehouse' : storehouse,
    #             'name' : name
    #         }, 
    #         {'$set' : {'count': count,
    #                 'price': price
    #         }})
    #     return 'SUCCESS'
    # return 'FAILED'
    return 'SUCCESS'

@bp.route("/storehouse/delete/", methods=['GET'])
def storehosue_delete():
    # name = request.args.get('name')
    # storehouse = request.args.get('storehouse')
    # if 'username' in session:
    #     db.product.update({
    #         'storehouse' : storehouse,
    #         'name' : name
    #     }, 
    #     {'$set' : {'count': 0 } })
    return {}

@bp.route("/storehouse/add/", methods=['POST'])
def storehouse_add():
    if request.method == 'POST':
        name = request.form['name']
        # image = request.form['image']
        print(name)
    return {}
