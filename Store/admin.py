from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.route("/")
def product():
    if 'username' in session:
        product = ['کالای 1', 'کالای 2', 'کالای 3', 'کالای 4', 'کالای 5']
        return render_template("admin/product.html", product=product)
    else:
        return redirect(url_for('login'))


def valid_login(username, password):
    return username == 'maktab' and password == 'maktab'


@bp.route("/order/")
def order():
    return render_template("admin/order.html")


@bp.route("/existing/")
def exsiting():
    return render_template("admin/existing.html")


@bp.route("/storehouse/")
def storehouse():
    stores = ['انبار شماره 1', 'انبار شماره 2', 'انبار شماره 3']
    return render_template("admin/storehouse.html", stores=stores)


@bp.route('/login/', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('admin.product'))
    else:
        if request.method == 'POST':
            if valid_login(request.form['username'], request.form['password']):
                session['username'] = request.form['username']
                return redirect(url_for("admin.product"))
            else:
                error = 'Invalid username/password'
                return render_template('admin/login.html', error=error)
        elif request.method == "GET":
            error = ""
            return render_template('admin/login.html', error=error)
