from flask import Blueprint, request, render_template, session, url_for, g
from werkzeug.utils import redirect
from Store.db import db

bp = Blueprint("main", __name__)


@bp.route("/")
def index():
    categories = db.product.find({}, {"category": 1, "_id": 0})
    res = [i['category'] for i in categories] 
    pr = {}
    response = []
    for g in range(len(res)):
        for j in range(len(res[g])):
            response.append(res[g][j])
    category_list = list(set(response))
    
    for i in category_list:
        cat_list = list(db.product.find({"category": i}, {"name": 1, "price": 1, "image": 1, "_id": 0}))
        for j in cat_list[-6:]:
            pr.update({i: cat_list})
    return render_template("index.html", pr=pr)


@bp.route("/basket/")
def basket():
    try:
        orders = list(session['orders'])
    except:
        orders = []
    sumAll = sum(list(map(lambda order: order['price']*order['count'], orders)))
 
    return render_template("basket.html", orders=orders, sumAll=sumAll)


@bp.route("/category/<ct>/")
def category(ct):
    categore_product = db.product.find(
                        {'category':ct},
                        {'name':1,
                         '_id':0, 
                        'price':1, 
                        'image':1})
    categories = db.product.find({}, {"category": 1,"subcategory":1, "_id": 0})
    list_categories = [i['category'] for i in categories]
    cat_dup = []
    for index_cat in range(len(list_categories)):
        cat_dup.extend(list_categories[index_cat])
    category_list = list(set(cat_dup))
    
    cat_subcat = {}
    for i in category_list:
        cat_subcat_list = list(db.product.find({"category": i}, {"subcategory": 1, "_id": 0}))
        subcat=[]
        for j in cat_subcat_list:
            subcat.extend(j["subcategory"])
        cat_subcat.update({i: subcat})
    return render_template("category.html", 
                            category = list(categore_product),
                            name = ct,
                            cat_subcat=cat_subcat)



@bp.route("/subcategory/<sct>")
def subcategory(sct):
    categore_product = db.product.find(
                        {'subcategory':sct},
                        {'name':1,
                         '_id':0, 
                        'price':1, 
                        'image':1});
    categories = db.product.find({}, {"category": 1,"subcategory":1, "_id": 0})
    list_categories = [i['category'] for i in categories]
    cat_dup = []
    for index_cat in range(len(list_categories)):
        cat_dup.extend(list_categories[index_cat])
    category_list = list(set(cat_dup))
    
    cat_subcat = {}
    for i in category_list:
        cat_subcat_list = list(db.product.find({"category": i}, {"subcategory": 1, "_id": 0}))
        subcat=[]
        for j in cat_subcat_list:
            subcat.extend(j["subcategory"])
        cat_subcat.update({i: subcat})
    return render_template("category.html", 
                            category = list(categore_product),
                            name = sct,
                            cat_subcat=cat_subcat)
    

@bp.route("/product/", methods=['GET'])
def product():
    name = request.args.get('name')
    price = request.args.get('price')
    product = db.product.find(
                        {'name':name,
                         'price':int(price)},
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
