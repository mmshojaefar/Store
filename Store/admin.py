import functools
from flask import Blueprint, request, render_template, session, url_for, g
from werkzeug.utils import redirect
from Store.db import db
# from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash, check_password_hash


bp = Blueprint("admin", __name__, url_prefix="/admin")
# key = b'7iR8tJzXJX5fAxrnX1OHbCDOJ-Hja9Tphb2Acbzj3ac='
# f = Fernet(key)
db.admin.update_one({
    'name' : 'maktab',
    }, {
    '$set' : {
        'password' : generate_password_hash('maktab')
}})

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('username') is None:
            return redirect(url_for("admin.login"))
        return view(**kwargs)
    return wrapped_view


@bp.route("/")
@login_required
def product():
    if 'username' in session:
        return render_template("admin/product.html")
    else:
        return redirect(url_for('login'))


def valid_login(username, password):
    user = db.admin.find_one({
        'name' : username
    })
    if user:
        return check_password_hash(user['password'], password)
    return False


@bp.route("/order/")
@login_required
def order():
    return render_template("admin/order.html")


@bp.route("/existing/")
@login_required
def exsiting():
    return render_template("admin/existing.html")


@bp.route("/storehouse/")
@login_required
def storehouse():
    return render_template("admin/storehouse.html")


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


@bp.route('/logout/',methods=['GET'])
def logout():
    session.pop('username')
    return redirect(url_for("admin.login"))
