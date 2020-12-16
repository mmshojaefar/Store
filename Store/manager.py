from flask import Blueprint, request, render_template, session, url_for, flash, g
from werkzeug.utils import redirect

bp = Blueprint("manager", __name__, url_prefix="/manager")

@bp.route("/")
def stuff():
    if 'username' in session:
        return render_template('manager/stuff.html')
    else:
        return redirect(url_for('login'))
    
def valid_login(username, password):
    return username == 'maktab' and password == 'maktab'

@bp.route("/order/")
def order():
    return render_template("manager/order.html")

@bp.route("/existing/")
def exsiting():
    return render_template("manager/existing.html")

@bp.route("/storehouse/")
def storehouse():
    stores = ['انبار شماره 1' , 'انبار شماره 2' ,'انبار شماره 3']
    return render_template("manager/storehouse.html", stores = stores)

@bp.route('/login/', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return render_template('manager/stuff.html')
    else:
        if request.method == 'POST':
            if valid_login(request.form['username'],request.form['password']):
                session['username'] = request.form['username']
                return redirect(url_for("manager.stuff"))
            else:
                error = 'Invalid username/password'
                return render_template('manager/login.html', error=error)
        elif request.method=="GET":
            error=""
            return render_template('manager/login.html', error=error)
