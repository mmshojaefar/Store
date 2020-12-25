var url_list = 'http://127.0.0.1:5000/api/existing/list';
var url_edit = 'http://127.0.0.1:5000/api/existing/edit/';
var url_delete = 'http://127.0.0.1:5000/api/existing/delete/';


$.get(url_list, function(response, status){
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
        row += "<td>" ;
        row += "<button class='edit'> ویرایش</button>";
        row += "<button class='delete'> حذف</button>";
        row += "</td>";
        row += "</tr>";
        $tbody.append(row);
    })  
})


$(function(){
    $('tbody tr td:last-child button:first-child').click(function(){
        console.log(this);
        $data = $(this).closest('tr').find('td');
        var name = $($data[1]).text(); 
        var storehouse = $($data[0]).text(); 
        $.post(url_edit, {
                storehouse : storehouse,
                name : name,
                price : 8500,
                count : 30
        },function(response, status){
            if(status=='success')
                console.log(status);
            console.log(response);
        })
    })

    $('tbody tr td:last-child button:last-child').click(function(){
        console.log(this);
        $data = $(this).closest('tr').find('td');
        var name = $($data[1]).text(); 
        var storehouse = $($data[0]).text(); 
        console.log(name, storehouse);
        $.ajax({
            url : url_delete,
            data : {
                'name' : name,
                'storehouse' : storehouse,
            },
            type : "GET",
            success : function(){
                console.log(5555);
            },
            error : function(){
                console.log('eeee');
            }
        });
    })
})
