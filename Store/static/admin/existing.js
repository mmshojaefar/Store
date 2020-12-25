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
        var editModal = new bootstrap.Modal(document.getElementById('editModal'), {
            keyboard: false
        });
        // editModal.show();
        $div = $("#editModal .modal-body");
        $div.empty();
        $row = $(this).closest('tr').find('td');
        var $storehouse = $($row[0]).text(); 
        var $name = $($row[1]).text();  
        var data = "" 
        data += "<label>انبار :</label> "
        data += "<label id='storehouse'></label><br><br>"
        data += "<label>کالا :</label> "
        data += "<label id='name'></label><br><br>"
        data += "<label for='price'>قیمت :</label> "
        data += "<input type='text' id='price' name='price'><br><br>"
        data += "<label for='count'>تعداد :</label> "
        data += "<input type='text' id='count' name='count'><br><br>"
        $div.append(data);
        $($($div).find('#storehouse')).text($storehouse);
        $($($div).find('#name')).text($name)
        
        $('#editModal .editSaveButton').click(function(){
            $price = $($($div).find('#price')).prop("value");
            $count = $($($div).find('#count')).prop("value");
            $.post(url_edit, {
                storehouse : $storehouse,
                name : $name,
                price : $price,
                count : $count
            },function(response, status){
                if(status=='success'){
                    $($row[2]).text($price)
                    $($row[3]).text($count)
                }
                console.log(response);
            });
            // $('#editModal').removeClass('show');
            // editModal.hide()
            $('#editModal').hide();
            $(".modal-backdrop").hide();
        })
    })
    
    $('tbody tr td:last-child button:last-child').click(function(event){
        var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
            keyboard: false
        });
        deleteModal.show();

        $row = $(this).closest('tr').find('td');
        var $storehouse = $($row[0]).text(); 
        var $name = $($row[1]).text();
        var $price = $($row[2]).text(); 
        var $count = $($row[3]).text();
        $div = $("#deleteModal .modal-body");
        $div.empty()
        var data = "";
        data += "<label> آیا از حذف</label> ";
        data += "<label>" + $count + "</label> ";
        data += "<label'> عدد </label> ";
        data += "<label>" + $name + "</label> ";
        data += "<label> به قیمت </label> ";
        data += "<label>" + $price + "</label> ";
        data += "<label> تومان از </label> ";
        data += "<label>" + $storehouse + "</label> ";
        data += "<label> اطمینان دارید؟</label> ";
        $div.append(data);

        
        $('#deleteModal .deleteSaveButton').click(function(){
            console.log('12345')
            $.ajax({
                url : url_delete,
                data : {
                    'name' : $name,
                    'storehouse' : $storehouse,
                },
                type : "GET",
                success : function(){
                    $row.hide();
                },
                error : function(){
                    console.log('eeee');
                }
            });
            deleteModal.hide()
        })
        
    })
    
})
