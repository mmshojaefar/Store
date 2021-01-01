var url_list = '/api/product/list';
var url_edit = '/api/product/edit/';
var url_delete = '/api/product/delete/';
var url_add = '/api/product/add/';
// var storehouse_list_url = 'http://127.0.0.1:5000/api/storehouse/list/';

// $.get(storehouse_list_url, function(response, status){
//     global_all_storehouse = []
//     JSON.parse(response).forEach(function(st){
//         global_all_storehouse.push(st.name)

//     })
// })

$.get(url_list, function(response, status){
    
    var $tbody = $("tbody")
    $('table').show()
    JSON.parse(response).forEach(function(product){
        // var image = product.image;
        var image = new Image();
        image.src = product.image;
        var name = product.name;
        var category = product.category;
        var subcategory = product.subcategory;
        var row = ""
        row += "<tr>";
        row += "<td>" + image + "</td>";
        row += "<td>" + name + "</td>";
        row += "<td>" + category + ' >> ' + subcategory + "</td>";
        row += "<td>" ;
        row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
        row += "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
        row += "</td>";
        row += "</tr>";
        $tbody.append(row);
    })
    editRow();
    deleteRow();
    addRow();
    addImport()
})

function editRow(){
    $('tbody tr td:last-child button:first-child').click(function(){
        $div = $("#editModal .modal-body");
        $div.empty();
        $row = $(this).closest('tr').find('td');
        var $image = $($row[0]).text();
        var $name = $($row[1]).text();
        var data = "" 
        data += "<label>image :</label> "
        data += "<label id='image'></label><br><br>"
        data += "<label>کالا :</label> "
        data += "<label id='name'></label><br><br>"
        data += "<label for='category'>دسته بندی :</label> "
        data += "<input id='category' name='category'><br><br>"
        data += "<label for='subcategory'>زیرگروه :</label> "
        data += "<input id='subcategory' name='subcategory'><br><br>"
        $div.append(data);
        $($($div).find('#image')).text($image);
        $($($div).find('#name')).text($name)
        
        $('#editModal .editSaveButton').click(function(){
            $category = $($($div).find('#category')).prop("value");
            $subcategory = $($($div).find('#subcategory')).prop("value");
            console.log($category)
            $.post(url_edit, {
                image : $image,
                name : $name,
                category : $category,
                subcategory: $subcategory,
            },function(response, status){
                if(status=='success' && response=='SUCCESS'){
                    $($row[2]).text($category + ' >> ' + $subcategory)
                }
            });
            $('#editModal').modal('hide');
        })
    })
}

function deleteRow(){
    $('tbody tr td:last-child button:last-child').click(function(){
        $row = $(this).closest('tr').find('td');
        var $image = $($row[0]).text();
        var $name = $($row[1]).text();
        var $category = $($row[2]).text().split(" >> ")[0]; 
        $div = $("#deleteModal .modal-body");
        $div.empty()
        var data = "";
        data += "<label> آیا از حذف</label> ";
        data += "<label>" + $name + "</label> ";
        data += "<label'> در دسته بندی </label> ";
        data += "<label>" + $category + "</label> ";
        data += "<label> با تصویر </label> ";
        data += "<label>" + $image + "</label> ";
        data += "<label> اطمینان دارید؟</label> ";
        $div.append(data);
        
        $('#deleteModal .deleteSaveButton').click(function(){
            $.ajax({
                url : url_delete,
                data : {
                    'name' : $name,
                    'category' : $category,
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

    data += "<label for='addName'>نام کالا :</label> "
    data += "<input type='text' id='addName' name='addName'><br><br>"
    data += "<label for='addDescription'>شرح کالا :</label> "
    data += "<input type='text' id='addDescription' name='addDescription'><br><br>"
    data += "<label for='addCategory'>دسته بندی :</label> "
    data += "<input type='text' id='addCategory' name='addCategory'><br><br>"
    data += "<label for='addSubcategory'>زیرگروه :</label> "
    data += "<input type='text' id='addSubcategory' name='addSubcategory'><br><br>"
    data += "<label for='addPrice'>قیمت :</label> "
    data += "<input type='text' id='addPrice' name='addPrice'><br><br>"
    data += "<label for='addCount'>تعداد :</label> "
    data += "<input type='text' id='addCount' name='addCount'><br><br>"
    data += "<label for='addStorehouse'>انبار :</label> "
    data += "<input type='text' id='addStorehouse' name='addStorehouse'><br><br>"
    data += "<label for='addImage'>تصویر :</label> "
    data += "<input type='file' accept='image/*' id='addImage' name='addImage'><br><br>"
    $div.append(data);

    var fd = new FormData();
        var files = $('#addImage')[0].files;
    if(files.length > 0 )
        fd.append('file',files[0]);

    $('#addModal .addSaveButton').click(function(){
        $div = $("#addModal .modal-body");
        var $name = $($($div).find('#addName')).prop("value");
        var $price = $($($div).find('#addPrice')).prop("value");
        var $count = $($($div).find('#addCount')).prop("value");
        var $image = $($($div).find('#addImage')).prop("value");
        var $description = $($($div).find('#addDescription')).prop("value");
        var $storehouse = $($($div).find('#addStorehouse')).prop("value");
        var $category = $($($div).find('#addCategory')).prop("value");
        var $subcategory = $($($div).find('#addSubcategory')).prop("value");

        $.post(url_add, {
            name: $name,
            price: $price,
            count: $count,
            image: $image,
            description: $description,
            storehouse: $storehouse,
            category: $category,
            subcategory: $subcategory,
        }, function(response, status){
            if(status == 'success'){
                var row = ""
                row += "<tr>";
                row += "<td>" + $image + "</td>";
                row += "<td>" + $name + "</td>";
                row += "<td>" + $category + ' >> ' + $subcategory + "</td>";
                row += "<td>" ;
                row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
                row += "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
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

function addImport(){
    $div = $("#importModal .modal-body");
    $div.empty();
    var data = "" 

    data += "<label for='addName'>انتخاب فایل :</label><br><br>"
    data += "<input type='file' accept='.txt' id='addFile' name='addFile'>"
    $div.append(data);

    var fd = new FormData();
        var files = $('#addFile')[0].files;
    if(files.length > 0 )
        fd.append('file',files[0]);

    $('#addModal .addSaveButton').click(function(){
        // $div = $("#addModal .modal-body");
        // var $name = $($($div).find('#addName')).prop("value");
        // var $category = $($($div).find('#addCategory')).prop("value");
        // var $subcategory = $($($div).find('#addSubcategory')).prop("value");
        // var $image = $($($div).find('#addImage')).prop("value");

        // $.post(url_add, {
        //     name: $name,
        //     category: $category,
        //     subcategory: $subcategory,
        //     image: $image,
        // }, function(response, status){
        //     if(status == 'success'){
        //         var row = ""
        //         row += "<tr>";
        //         row += "<td>" + $image + "</td>";
        //         row += "<td>" + $name + "</td>";
        //         row += "<td>" + $category + ' >> ' + $subcategory + "</td>";
        //         row += "<td>" ;
        //         row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
        //         row += "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
        //         row += "</td>";
        //         row += "</tr>";
        //         $('tbody').append(row);
        //         editRow();
        //         deleteRow();
        //         $('#addModal .modal-body input').val('');

        //     }
        // })
        
        $('#addModal').modal('hide');
    })
}
