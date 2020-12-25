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
        $('table thead').show()
        var row = "<tr>";
        row += "<td>" + storehouse + "</td>";
        row += "<td>" + name + "</td>";
        row += "<td>" + price + "</td>";
        row += "<td>" + count + "</td>";
        row += "<td>" ;
        row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
        row += "<button class='delete'> حذف</button>";
        row += "</td>";
        row += "</tr>";
        $tbody.append(row);
    })

    $('tbody tr td:last-child button:first-child').click(function(){
        new bootstrap.Modal(document.getElementById('editModal'), {
            keyboard: false
        });
        $div = $("#editModal .modal-body");
        $data = $(this).closest('tr').find('td');
        var $name = $($data[1]).text(); 
        var $storehouse = $($data[0]).text(); 
        var data = "" 
        data = "<label for='storehouse'>انبار : </label>"
        data += "<input type='text' id='storehouse' name='storehouse'><br><br>"
        data += "<label for='name'>کالا : </label>"
        data += "<input type='text' id='name' name='name'><br><br>"
        data += "<label for='price'>قیمت : </label>"
        data += "<input type='text' id='price' name='price'><br><br>"
        data += "<label for='count'>تعداد : </label>"
        data += "<input type='text' id='count' name='count'><br><br>"
        $div.empty()
        $div.append(data);

        $($($div).find('input')[0]).prop("value", $storehouse)
        $($($div).find('input')[0]).prop("readonly", "readonly")
        $($($div).find('input')[1]).prop("value", $name)
        $($($div).find('input')[1]).prop("readonly", "readonly")
        
        $('#editModal .saveButton').click(function(event){
            event.preventDefault()
            $price = $($($div).find('input')[2]).prop("value");
            $count = $($($div).find('input')[3]).prop("value");
            $.post(url_edit, {
                storehouse : $storehouse,
                name : $name,
                price : $price,
                count : $count
            },function(response, status){
                if(status=='success')
                    console.log(status);
                console.log(response);
            });
            // $('#editModal').removeClass('show');
            $('#editModal').hide();
            $(".modal-backdrop").remove();
        })
    })
    
    // $('tbody tr td:last-child button:last-child').click(function(){
    //     console.log(this);
    //     $data = $(this).closest('tr').find('td');
    //     var name = $($data[1]).text(); 
    //     var storehouse = $($data[0]).text(); 
    //     console.log(name, storehouse);
    //     $.ajax({
    //         url : url_delete,
    //         data : {
    //             'name' : name,
    //             'storehouse' : storehouse,
    //         },
    //         type : "GET",
    //         success : function(){
    //             console.log(5555);
    //         },
    //         error : function(){
    //             console.log('eeee');
    //         }
    //     });
    // })
})
