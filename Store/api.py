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
        
        if price == '':
            return {'response':'#editFormPrice', 'msg':'فیلد قیمت کالا نباید خالی باشد'}
        if count == '':
            return {'response':'#editFormCount', 'msg':'فیلد تعداد کالا نباید خالی باشد'}
        try:
            price = int(price)
        except:
            return {'response':'#editFormPrice', 'msg':'قیمت باید عددی صحیح باشد'}
        if price < 0:
            return {'response':'#editFormPrice', 'msg':'قیمت نباید عددی منفی باشد'}
        
        try:
            count = int(count)
        except:
            return {'response':'#editFormCount', 'msg':'تعداد باید عددی صحیح باشد'}
        if count < 0:
            return {'response':'#editFormCount', 'msg':'تعداد نباید عددی منفی باشد'}
        
        if 'username' not in session:
            return {'response':'FAILED', 'msg':'FAILED'}
        else:
            try:
                update_result = db.product.update({
                    'storehouse' : storehouse,
                    'name' : name
                }, 
                {'$set' : {'count': count,
                           'price': price
                }})
                if update_result['updatedExisting'] == False:
                    return {'response':'FAILED', 'msg':'کالایی با این مشخصات یافت نشد'}
                else:
                    return {'response':'SUCCESS','msg':'SUCCESS'}
            except:
                return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}
    else:
        return {'response':'FAILED', 'msg':'FAILED'}

@bp.route("/existing/delete/", methods=['GET'])
def existing_delete():
    name = request.args.get('name')
    storehouse = request.args.get('storehouse')
    price = request.args.get('price')
    count = request.args.get('count')
    
    try:
        price = int(price)
    except:
        return {'response':'FAILED', 'msg':'قیمت باید عددی صحیح و نامنفی باشد'}
    if price < 0:
            return {'response':'FAILED', 'msg':'قیمت باید عددی صحیح و نامنفی باشد'}
    
    try:
        count = int(count)
    except:
        return {'response':'FAILED', 'msg':'تعداد باید عددی صحیح و نامنفی باشد'}
    if count < 0:
        return {'response':'FAILED', 'msg':'تعداد باید عددی صحیح و نامنفی باشد'}
    
    if 'username' in session:
        try:
            remove_result = db.product.update({
                'storehouse' : storehouse,
                'name' : name,
                'price' : price,
                'count' : count
            }, 
            {'$set' : {'count': 0 } })
            print(remove_result)
            if remove_result['updatedExisting'] == False:
                return {'response':'FAILED', 'msg':'کالایی با این مشخصات یافت نشد'}
            else:
                return {'response':'SUCCESS','msg':'SUCCESS'}
        except:
            return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}
    else:
        return {'response':'FAILED', 'msg':'FAILED'}

@bp.route("/existing/add/", methods=['POST'])
def existing_add():
    if request.method == 'POST':
        storehouse = request.form['storehouse']
        name = request.form['name']
        price = request.form['price']
        count = request.form['count']
        category = request.form['category']
        subcategory = request.form['subcategory']
        # image = request.form['image']
        # print(type(image))
        
        if name == '':
            return {'response':'#addFormName', 'msg':'فیلد نام کالا نباید خالی باشد'}
        
        if price == '':
            return {'response':'#addFormPrice', 'msg':'فیلد قیمت کالا نباید خالی باشد'}
        try:
            price = int(price)
        except:
            return {'response':'#addFormPrice', 'msg':'قیمت باید عددی صحیح باشد'}
        if price < 0:
            return {'response':'#addFormPrice', 'msg':'قیمت نباید عددی منفی باشد'}
        
        if count == '':
            return {'response':'#addFormCount', 'msg':'فیلد تعداد کالا نباید خالی باشد'}
        try:
            count = int(count)
        except:
            return {'response':'#addFormCount', 'msg':'تعداد باید عددی صحیح باشد'}
        if count < 0:
            return {'response':'#addFormCount', 'msg':'تعداد نباید عددی منفی باشد'}
        
        if category == '':
            return {'response':'#addFormCategory', 'msg':'فیلد دسته بندی نباید خالی باشد'}
        else:
            category = category.strip()
            category = category.strip('،')
            for cat in category.replace(' ','').split('،'):
                if not cat.isalpha():
                    return {'response':'#addFormCategory', 'msg':'هیچ یک از دسته ها نباید کاراکتر غیر حرفی داشته باشد'}

        if subcategory == '':
            return {'response':'#addFormSubCategory', 'msg':'فیلد زیر گروه نباید خالی باشد'}
        else:
            subcategory = subcategory.strip()
            subcategory = subcategory.strip('،')
            for sub in subcategory.split('،'):
                if not sub.replace(' ','').isalpha():
                    return {'response':'#addFormSubCategory', 'msg':'هیچ یک از زیر گروه ها نباید کاراکتر غیر حرفی داشته باشد'}
        
        if 'username' not in session:
            return {'response':'FAILED', 'msg':'FAILED'}
        else:
            try:
                edited_category = []
                edited_subcategory = []
                for cat in category.split('،'):
                    edited_category.append(cat.strip())
                for sub in subcategory.split('،'):
                    edited_subcategory.append(sub.strip())

                db.product.insert_one({
                    'storehouse' : storehouse,
                    'name' : name,
                    'count' : count,
                    'price' : price,
                    'category' : edited_category,
                    'subcategory' : edited_subcategory,
                })
                return {'response':'SUCCESS','msg':'SUCCESS'}
            except:
                return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}
    return {}


@bp.route("/storehouse/list/")
def storehouse_list():
    all_products = db.storehouse.find({}, {'name':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/storehouse/edit/", methods=['POST'])
def storehosue_edit():
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


@bp.route("/order/list/",methods=['GET'])
def order_list():
    all_order = db.order.find({})
    json_string = dumps(all_order)
    return json_string

@bp.route("/mainProduct/list",methods=['POST'])
def mainProduct_list():
    name = request.form['name']
    price = request.form['price']
    count = request.form['count']
    print(name, price, count)
    if 'orders' not in session:
        session['orders'] = []
    
    session['orders'].append({'name' : name,
                              'price' : int(price),
                              'count' : int(count)})
    print(session)
    return {}
