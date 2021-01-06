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
        name = request.form['name']
        category = request.form['category']
        subcategory = request.form['subcategory']
        # image = request.form['image']
        if name == '':
            return {'response': '#editFormName', 'msg': 'فیلد نام کالا نباید خالی باشد'}
        
        if category == '':
            return {'response': '#editFormCategory', 'msg': 'فیلد دسته بندی نباید خالی باشد'}
        
        if subcategory == '':
            return {'response': '#editFormSubcategory', 'msg': 'فیلد زیرگروه نباید خالی باشد'}

        if 'username' not in session:
            return {'response':'FAILED', 'msg':'FAILED'}
        else:
            try:
                cat = []
                subcat = []
                for c in category.split('،'):
                    cat.append(c.strip())
                for s in subcategory.split('،'):
                    subcat.append(s.strip())

                db.product.update({
                    'name' : name
                }, 
                {'$set' : {'category': cat,
                        'subcategory': subcat,
                        # 'image': image,
                }})
                return {'response': 'SUCCESS', 'msg': 'SUCCESS'}
            except:
                return {'response': 'FAILED', 'msg': 'لطفا کمی بعد مجددا تلاش کنید'}


@bp.route("/product/delete/", methods=['GET'])
def product_delete():
    if request.method == 'GET':
        # image = request.form['image']
        name = request.args.get('name')
        # category = request.form['category']
        if 'username' in session:
            db.product.remove({
                # 'image' : image,
                'name' : name,
                # 'category': category,
            })

        return 'SUCCESS'
    return 'FAILED'

@bp.route("/product/add/", methods=['POST'])
def product_add():
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        count = request.form['count']
        # image = request.form['image']
        description = request.form['description']
        storehouse = request.form['storehouse']
        category = request.form['category']
        subcategory = request.form['subcategory']

        if name == '':
            return {'response': '#addFormName', 'msg': 'فیلد نام کالا نباید خالی باشد'}
        
        if category == '':
            return {'response': '#addFormCategory', 'msg': 'فیلد دسته بندی نباید خالی باشد'}
        
        if subcategory == '':
            return {'response': '#addFormSubcategory', 'msg': 'فیلد زیرگروه نباید خالی باشد'}

        if price == '':
            return {'response': '#addFormPrice', 'msg': 'فیلد قیمت کالا نباید خالی باشد'}
        try:
            price = int(price)
        except:
            return {'response': '#addFormPrice', 'msg': 'قیمت باید عددی صحیح باشد'}
        if price < 0:
            return {'response': '#addFormPrice', 'msg': 'قیمت نباید عددی منفی باشد'}    

        if count == '':
            return {'response': '#addFormCount', 'msg': 'فیلد تعداد کالا نباید خالی باشد'}
        try:
            count = int(count)
        except:
            return {'response': '#addFormCount', 'msg': 'تعداد باید عددی صحیح باشد'}
        if count < 0:
            return {'response': '#addFormCount', 'msg': 'تعداد نباید عددی منفی باشد'}

        if description == '':
            return {'response': '#addFormDescription', 'msg': 'فیلد نام کالا نباید خالی باشد'}
        
        if 'username' not in session:
            return {'response': 'FAILED', 'msg': 'FAILED'}
        else:
            try:
                cat = []
                subcat = []
                for c in category.split('،'):
                    cat.append(c.strip())
                for s in subcategory.split('،'):
                    subcat.append(s.strip())
                
                db.product.insert({
                    'name': name,
                    'price': price,
                    'count': count,
                    # 'image': image,
                    'descripton': description,
                    'storehouse': storehouse,
                    'category': cat,
                    'subcategory': subcat
                })
                return {'response': 'SUCCESS', 'msg': 'SUCCESS'}
            except:
                return {'response': 'FAILED', 'msg': 'لطفا کمی بعد مجددا تلاش کنید'}
        

                


    #     if 'username' in session:
    #         db.product.insert({
    #             'name' : name,
    #             'price': price,
    #             'count': count,
    #             'image' : image,
    #             'description': description,
    #             'storehouse': storehouse,
    #             'category': category,
    #             'subcategory': subcategory,
    #         })
    #     return 'SUCCESS'
    # return 'FAILED'


@bp.route("/existing/list/")
def existing_list():
    all_products = db.product.find({}, 
                    {'storehouse':1 ,'name':1 ,'count':1, 'price':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/existing/edit/", methods=['POST'])
def existing_edit():
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


@bp.route("/storehouse/list/")
def storehouse_list():
    all_products = db.storehouse.find({}, {'name':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/storehouse/edit/", methods=['POST'])
def storehosue_edit():
    name = request.form['name']
    previous_name = request.form['previous_name']
    print(previous_name, name)
    if name == '':
        return {'response':'#editFormName', 'msg':'فیلد نام انبار نباید خالی باشد'}

    if name == previous_name:
        return {'response':'FAILED', 'msg':'نام جدیدی برای انبار انتخاب کنید' }
    if 'username' not in session:
            return {'response':'FAILED', 'msg':'FAILED'}
    else:
        try:
            update_storehouses = db.storehouse.update({
                'name' : previous_name
            }, 
            {'$set' : { 'name': name }
            })

            try:
                update_products = db.product.update_many({
                    'storehouse' : previous_name
                },
                {'$set' : { 'storehouse' : name }
                })
            except:
                return {'response':'FAILED', 'msg':'تغییر نام انبار انجام نشد. لطفا کمی بعد مجددا تلاش کنید'}
            
            if update_storehouses['updatedExisting'] == False:
                return {'response':'FAILED', 'msg':'انباری با این نام یافت نشد'}
            else:
                return {'response':'SUCCESS','msg':f'نام {previous_name} با {update_products.modified_count} عدد کالا به {name} تغییر پیدا کرد'}
        except:
            return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}

@bp.route("/storehouse/delete/", methods=['GET'])
def storehosue_delete():
    name = request.args.get('name')
    if 'username' not in session:
        return {'response':'FAILED', 'msg':'FAILED'}
    else:
        try:
            remove_storehouse = db.storehouse.delete_one({
                'name' : name
            })
            try:
                remove_product = db.product.update_many({
                    'storehouse' : name
                },
                { '$set' : { 'count' : 0 }
                })
            except:
                return {'response':'FAILED', 'msg':'حذف موجودی کالا های انبار انجام نشد. لطفا کمی بعد مجددا تلاش کنید'}

            if remove_storehouse.deleted_count == 0:
                return {'response':'FAILED', 'msg':'انباری با این نام یافت نشد'}
            else:
                return {'response':'SUCCESS','msg':f'موجودی {remove_product.modified_count} تا از کالا های انبار {name} به صفر تغییر پیدا کرد'}
        except:
            return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}

@bp.route("/storehouse/add/", methods=['POST'])
def storehouse_add():
    name = request.form['name']

    if name == '':
        return {'response':'#addFormName', 'msg':'فیلد نام انبار نباید خالی باشد'}
    
    if 'username' not in session:
        return {'response':'FAILED', 'msg':'FAILED'}
    else:
        try:
            db.storehouse.insert_one({
                'name' : name,
            })
            return {'response':'SUCCESS','msg':'SUCCESS'}
        except:
            return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}


@bp.route("/order/list/",methods=['GET'])
def order_list():
    all_order = db.order.find({})
    json_string = dumps(all_order)
    return json_string

@bp.route("/mainProduct/list/",methods=['POST'])
def mainProduct_list():
    name = request.form['name']
    price = int(request.form['price'])
    count = int(request.form['count'])

    if 'orders' not in session:
        session['orders'] = []
    
    all_order = session['orders']
    for ords in all_order:
        if ords['name'] == name and ords['price'] == price:
            if ords['count'] > 0: 
                ords['count'] = count
    else:
        if count > 0:
            all_order.append({'name' : name,
                            'price' : price,
                            'count' : count})
    session['orders'] = all_order
    print(session)
    return {}

@bp.route("/mainProduct/delete/",methods=['POST'])
def mainProduct_delete():
    name = request.form['name']
    price = int(request.form['price'])

    if 'orders' not in session:
        session['orders'] = []
    
    all_order = session['orders']
    for ords in all_order:
        if ords['name'] == name and ords['price'] == price:
            all_order.remove(ords)
            return {'response' : 'SUCCESS'}
    else:
        return {'response' : 'FAILED'}
    session['orders'] = all_order
    return {}
