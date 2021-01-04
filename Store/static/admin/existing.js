var url_list = '/api/existing/list';
var url_edit = '/api/existing/edit/';
var url_delete = '/api/existing/delete/';
var url_add = '/api/existing/add/';
var storehouse_list_url = '/api/storehouse/list/';

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
        // $div.empty();
        $row = $(this).closest('tr').find('td');
        var $storehouse = $($row[0]).text();
        var $name = $($row[1]).text();
        var $price = $($row[2]).text();
        var $count = $($row[3]).text();
        $('#editFormPrice').removeClass('form-control is-invalid')
        $('#editFormCount').removeClass('form-control is-invalid')

        // var data = "" 
        // data += "<form class='needs-validation' novalidate>"
        // data += "<label>انبار :</label> "
        // data += "<label id='storehouse'></label><br><br>"
        // data += "<label>کالا :</label> "
        // data += "<label id='name'></label><br><br>"
        // data += "<label for='price'>قیمت :</label> "
        // data += "<input type='number' min=1 id='price' name='price'><br><br>"
        // data += "<label for='count'>تعداد :</label> "
        // data += "<input type='number' min=1 id='count' name='count'><br><br>"
        // data += "</form>"
        // $div.append(data);
        // $($($div).find('#storehouse')).text($storehouse);
        // $($($div).find('#name')).text($name)
        // $($($div).find('#price')).val($price)
        // $($($div).find('#count')).val($count)
        $($($div).find('#editFormStorehouse')).text($storehouse);
        $($($div).find('#editFormName')).text($name)
        $($($div).find('#editFormPrice')).val($price)
        $($($div).find('#editFormCount')).val($count)
    })

    $('#editModal .editSaveButton').click(function(){
        $('#editFormPrice').removeClass('is-invalid')
        $('#editFormCount').removeClass('is-invalid')
        // $storehouse = $($($div).find('#storehouse')).text();
        // $name = $($($div).find('#name')).text();
        // $price = $($($div).find('#price')).prop("value");
        // $count = $($($div).find('#count')).prop("value");
        $storehouse = $($($div).find('#editFormStorehouse')).text();
        $name = $($($div).find('#editFormName')).text();
        $price = $($($div).find('#editFormPrice')).prop("value");
        $count = $($($div).find('#editFormCount')).prop("value");
        // console.log($price)
        $.post(url_edit, {
            'storehouse' : $storehouse,
            'name' : $name,
            'price' : $price,
            'count' : $count
        },function(response, status){
            if(status=='success' && response['response']=='SUCCESS'){
                $($row[2]).text($price)
                $($row[3]).text($count)
                $('#editModal').modal('hide');
            }
            else if(status=='success' && response['response']!='SUCCESS'){
                if(response['response'] != 'FAILED'){
                    $(response['response']).addClass('form-control is-invalid')
                    $(response['response']).next().html(response['msg'])
                }
                else{
                    $('#editFinalError').html(response['msg'])
                    $('#editFinalError').addClass('form-control is-invalid')
                }
            }
        });
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
            console.log($storehouse, $name)
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
    data += "<input type='number' min=1 id='addPrice' name='addPrice'><br><br>"
    data += "<label for='addCount'>تعداد :</label> "
    data += "<input type='number' min=1 id='addCount' name='addCount'><br><br>"
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
    // console.group(fd)
    var $image
    $(document).on("click", ".addSaveButton", function(){
        $image = $($($div).find('#addImage')).prop("files");
        $('#addModal .addSaveButton').click(function(){
            // var fd = new FormData();
            // var files = $('#addImage').files;
            // if(files.length > 0 )
            //     fd.append('file',files[0]);
            
            $div = $("#addModal .modal-body");
            var $storehouse = $($($div).find('#addStorehouse')).prop("value");
            var $name = $($($div).find('#addName')).prop("value");
            var $price = $($($div).find('#addPrice')).prop("value");
            var $count = $($($div).find('#addCount')).prop("value");
            var $category = $($($div).find('#addCategory')).prop("value");
            console.log($image)
            
            $.post(url_add, {
                storehouse: $storehouse,
                name: $name,
                price: $price,
                count: $count,
                category: $category,
                // image: fd
                // image: $image
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
    })
}


$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }