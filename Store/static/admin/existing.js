var url_list = 'http://127.0.0.1:5000/api/existing/list';
var url_edit = 'http://127.0.0.1:5000/api/existing/edit/';
var url_delete = 'http://127.0.0.1:5000/api/existing/delete/';
var url_add = 'http://127.0.0.1:5000/api/existing/add/';
var storehouse_list_url = 'http://127.0.0.1:5000/api/storehouse/list/';

$.get(storehouse_list_url, function(response, status){
    global_all_storehouse = []
    JSON.parse(response).forEach(function(st){
        global_all_storehouse.push(st.name)

    })
})

$.get(url_list, function(response, status){
    
    var $tbody = $("tbody")
    $('table').show()
    JSON.parse(response).forEach(function(product){
        var storehouse = product.storehouse;
        var name = product.name;
        var price = product.price;
        var count = product.count;
        if(!(count < 0)){
            var row = ""
            row += "<tr>";
            row += "<td>" + storehouse + "</td>";
            row += "<td>" + name + "</td>";
            row += "<td>" + price + "</td>";
            row += "<td>" + count + "</td>";
            row += "<td>" ;
            row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
            row += "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
            row += "</td>";
            row += "</tr>";
            $tbody.append(row);
        }
    })
    editRow();
    deleteRow();
    addRow()
})

function editRow(){
    $('tbody tr td:last-child button:first-child').click(function(){
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
        data += "<input type='number' id='price' name='price'><br><br>"
        data += "<label for='count'>تعداد :</label> "
        data += "<input type='number' id='count' name='count'><br><br>"
        $div.append(data);
        $($($div).find('#storehouse')).text($storehouse);
        $($($div).find('#name')).text($name)
        
        $('#editModal .editSaveButton').click(function(){
            $price = $($($div).find('#price')).prop("value");
            $count = $($($div).find('#count')).prop("value");
            console.log($price)
            $.post(url_edit, {
                storehouse : $storehouse,
                name : $name,
                price : $price,
                count : $count
            },function(response, status){
                if(status=='success' && response=='SUCCESS'){
                    $($row[2]).text($price)
                    $($row[3]).text($count)
                }
            });
            $('#editModal').modal('hide');
        })
    })
}

function deleteRow(){
    $('tbody tr td:last-child button:last-child').click(function(){
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
            $('#deleteModal').modal('hide');
        })
        
    })

}

function addRow(){
    $div = $("#addModal .modal-body");
    $div.empty();
    var data = "" 

    data += "<label for='addStorehouse'>انبار :</label> "
    // data += "<input type='text' id='addStorehouse' name='addStorehouse'><br><br>"
    data += "<select name=all_storehouse id='addStorehouse'>"
    data += "</select><br><br>"
    data += "<label for='addName'>کالا :</label> "
    data += "<input type='text' id='addName' name='addName'><br><br>"
    data += "<label for='addPrice'>قیمت :</label> "
    data += "<input type='number' id='addPrice' name='addPrice'><br><br>"
    data += "<label for='addCount'>تعداد :</label> "
    data += "<input type='number' id='addCount' name='addCount'><br><br>"
    data += "<label for='addCategory'>دسته بندی :</label> "
    data += "<input type='text' id='addCategory' name='addCategory'><br><br>"
    data += "<label for='addImage'>تصویر :</label> "
    data += "<input type='file' accept='image/*' id='addImage' name='addImage'><br><br>"
    $div.append(data);

    global_all_storehouse.forEach(function(st){
        var option = new Option(st, st);
        $($($div).find('#addStorehouse')).append(option)

    })
    // storehouse, category get select tag

    var fd = new FormData();
        var files = $('#addImage')[0].files;
    if(files.length > 0 )
        fd.append('file',files[0]);

    $('#addModal .addSaveButton').click(function(){
        $div = $("#addModal .modal-body");
        var $storehouse = $($($div).find('#addStorehouse')).prop("value");
        var $name = $($($div).find('#addName')).prop("value");
        var $price = $($($div).find('#addPrice')).prop("value");
        var $count = $($($div).find('#addCount')).prop("value");
        var $category = $($($div).find('#addCategory')).prop("value");
        // var $image = $($($div).find('#addImage')).prop("value");

        $.post(url_add, {
            storehouse: $storehouse,
            name: $name,
            price: $price,
            count: $count,
            category: $category,
            // image: fd
        }, function(response, status){
            if(status == 'success'){
                var row = "";
                row += "<tr>";
                row += "<td>" + $storehouse + "</td>";
                row += "<td>" + $name + "</td>";
                row += "<td>" + $price + "</td>";
                row += "<td>" + $count + "</td>";
                row += "<td>" ;
                row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
                row += "<button type='button' class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
                row += "</td>";
                row += "</tr>";
                $('tbody').append(row);
                editRow();
                deleteRow();
                $('#addModal .modal-body input').val('');

            }
        })
        
        $('#addModal').modal('hide');
    })
}
