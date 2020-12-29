from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client.store

def get_categories():
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
        for j in cat_list:
            pr.update({i: cat_list})
    return pr
