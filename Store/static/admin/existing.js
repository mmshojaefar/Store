var url = 'http://127.0.0.1:5000/api/existing/list';
$.get(url, function(response, status){
    var $tbody = $("tbody")
    JSON.parse(response).forEach(function(product){
        var storehouse = product.storehouse;
        var name = product.name;
        var price = product.price;
        var count = product.count;
        var row = "<tr>";
        row += "<td>" + storehouse + "</td>";
        row += "<td>" + name + "</td>";
        row += "<td>" + price + "</td>";
        row += "<td>" + count + "</td>";
        row += "<td>" + '<a href=""> ویرایش</a><a href=""> حذف</a>' + "</td>";
        row += "</tr>";
        $tbody.append(row);
    })
    
})