from flask import Blueprint, request, render_template, session, url_for, g, current_app
from werkzeug.utils import redirect, secure_filename
from Store.db import db
from bson.json_util import dumps
from json import dumps as json_dumps
from Store.admin import login_required
from os import SEEK_END, path

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/product/list/")
@login_required
def product_list():
    all_products = db.product.find({}, 
                    {'image':1, 'name':1, 'category':1, 'subcategory':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/product/edit/", methods=['POST'])
@login_required
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
@login_required
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
@login_required
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
@login_required
def existing_list():
    all_products = db.product.find({}, 
                    {'storehouse':1 ,'name':1 ,'count':1, 'price':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/existing/edit/", methods=['POST'])
@login_required
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
@login_required
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
    
    try:
        remove_result = db.product.update({
            'storehouse' : storehouse,
            'name' : name,
            'price' : price,
            'count' : count
        }, 
        {'$set' : {'count': 0 } })
        if remove_result['updatedExisting'] == False:
            return {'response':'FAILED', 'msg':'کالایی با این مشخصات یافت نشد'}
        else:
            return {'response':'SUCCESS','msg':'SUCCESS'}
    except:
        return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}

@bp.route("/existing/add/", methods=['POST'])
@login_required
def existing_add():
    storehouse = request.form['addFormStorehouse']
    name = request.form['addFormName']
    price = request.form['addFormPrice']
    count = request.form['addFormCount']
    category = request.form['addFormCategory']
    subcategory = request.form['addFormSubCategory']
    image = request.files['addFormImage']

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
    
    image.seek(0, SEEK_END)
    file_length = image.tell()
    print(file_length)
    if file_length > 1024*1024:
        return {'response':'#addFormImage', 'msg':'سایز عکس نباید بیشتر از یک مگا بایت باشد'}


    try:
        edited_category = []
        edited_subcategory = []
        for cat in category.split('،'):
            edited_category.append(cat.strip())
        for sub in subcategory.split('،'):
            edited_subcategory.append(sub.strip())
        
        pr = db.product.insert_one({
            'storehouse' : storehouse,
            'name' : name,
            'count' : count,
            'price' : price,
            'category' : edited_category,
            'subcategory' : edited_subcategory,
            'image' : 'images/defaultIMG.png'
        })

        if not image:
            image_name = 'images/defaultIMG.png'
        else:
            try:
                image_name = f'images/{str(pr.inserted_id)}.gif'
                folder_path = url_for('static', filename=image_name)
                full_path = current_app.root_path + folder_path
                image.save(full_path)
            except:
                return {'response':'FAILEDIMG', 'msg':'کالا اضافه شد اما خطایی در ذخیره سازی عکس رخ داد. لطفا بعدا عکس را اضافه کنید'}
        
        db.product.update({
            'storehouse' : storehouse,
            'name' : name,
            'count' : count,
            'price' : price,
            'category' : edited_category,
            'subcategory' : edited_subcategory,
        }, 
        {'$set' : {
            'image' : image_name
        }})

        return {'response':'SUCCESS','msg':'SUCCESS'}
    except:
        return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}


@bp.route("/storehouse/list/")
@login_required
def storehouse_list():
    all_products = db.storehouse.find({}, {'name':1, '_id':0})
    json_string = dumps(all_products)
    return json_string

@bp.route("/storehouse/edit/", methods=['POST'])
@login_required
def storehosue_edit():
    name = request.form['name']
    previous_name = request.form['previous_name']
    if name == '':
        return {'response':'#editFormName', 'msg':'فیلد نام انبار نباید خالی باشد'}

    if name == previous_name:
        return {'response':'FAILED', 'msg':'نام جدیدی برای انبار انتخاب کنید' }

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
@login_required
def storehosue_delete():
    name = request.args.get('name')
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
@login_required
def storehouse_add():
    name = request.form['name']

    if name == '':
        return {'response':'#addFormName', 'msg':'فیلد نام انبار نباید خالی باشد'}
    
    try:
        db.storehouse.insert_one({
            'name' : name,
        })
        return {'response':'SUCCESS','msg':'SUCCESS'}
    except:
        return {'response':'FAILED', 'msg':'لطفا کمی بعد مجددا تلاش کنید'}


@bp.route("/order/list/",methods=['GET'])
@login_required
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
                break;
    else:
        if count > 0:
            all_order.append({'name' : name,
                            'price' : price,
                            'count' : count})
    session['orders'] = all_order
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
            session['orders'] = all_order
            return {'response' : 'SUCCESS'}
    session['orders'] = all_order
    return {'response' : 'FAILED'}


@bp.route("/detail/")
@login_required
def detail():
    all_products = db.product.find({}, 
                    {'name':1, 'price':1, 'storehouse':1,'count':1})
    json_string = dumps(all_products)
    return json_string

@bp.route("/mainProduct/approve/", methods=['POST'])
def approve_order():
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    date = request.form['date']
    tel = request.form['tel']
    address = request.form['address']

    if firstname == '':
        return {'response':'#formFirstName', 'msg':'لطفا نام خود را وارد کنید'}
    
    if lastname == '':
        return {'response':'#formLastName', 'msg':'لطفا نام خانوادگی خود را وارد کنید'}

    if date == '':
        return {'response':'#formDate', 'msg':'لطفا تاریخ مناسب برای تحویل کالا را وارد کنید'}
    # add if for check data #

    if tel == '':
        return {'response':'#formTelphone', 'msg':'لطفا شماره تلفن همراه خود را وارد کنید'}
    try:
        int(tel)
    except:
        return {'response':'#formTelphone', 'msg':'فرمت وارد شده برای تلفن همراه نادرست است'}
    if len(tel) != 11:
        return {'response':'#formTelphone', 'msg':'فرمت وارد شده برای تلفن همراه نادرست است'}
    if tel[0] != '0' or tel[1] != '9':
        return {'response':'#formTelphone', 'msg':'فرمت وارد شده برای تلفن همراه نادرست است'}

    if address == '':
        return {'response':'#formAddress', 'msg':'لطفا آدرس خود را وارد کنید'}

    if 'orders' not in session or len(session['orders']) == 0:
        return {'response':'FAILEDNULL', 'msg':'هیچ کالایی انتخاب نشده است'}

    check_list = []
    for ords in session['orders']:
        selected_product = db.product.find_one({
            'name' : ords['name'],
            'price' : ords['price']
        })
        if selected_product['count'] < ords['count']:
            check_list.append(ords)
    print(dumps(check_list))
    if len(check_list) > 0:
        return {'response' : 'FAILED', 'msg': json_dumps(check_list)}
    else:
        for ords in session['orders']:
            selected_product = db.product.find_one({
            'name' : ords['name'],
            'price' : ords['price']
            })
            current_count = selected_product['count']
            db.product.update({
            'name' : ords['name'],
            'price' : ords['price']
            }, 
            {'$set' : {
                'count': int(current_count) - int(ords['count'])
            }})
        session.pop('orders')
        return {'response' : 'SUCCESS'}
