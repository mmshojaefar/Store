var url_list = 'http://127.0.0.1:5000/api/storehouse/list';
var url_edit = 'http://127.0.0.1:5000/api/storehouse/edit/';
var url_delete = 'http://127.0.0.1:5000/api/storehouse/delete/';
var url_add = 'http://127.0.0.1:5000/api/storehouse/add/';

$.get(url_list, function(response, status){
    var $tbody = $("tbody")
    $('table').show()
    JSON.parse(response).forEach(function(st){
        var name = st.name;
        var row = ""
        row += "<tr>";
        row += "<td>" + name + "</td>";
        row += "<td>" ;
        row += "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
        row += "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
        row += "</td>";
        row += "</tr>";
        $tbody.append(row);
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
        var data = "" 
        data += "<label>نام انبار :</label> "
        data += "<input id='name'><br><br>"
        $div.append(data);
        
        $('#editModal .editSaveButton').click(function(){
            $name = $($($div).find('#name')).prop('value')
            $.post(url_edit, {
                name : $name,
            },function(response, status){
                if(status=='success' && response=='SUCCESS'){
                    $($row[0]).text($name)
                }
            });
            $('#editModal').modal('hide');
        })
    })
}

function deleteRow(){
    $('tbody tr td:last-child button:last-child').click(function(){
        $row = $(this).closest('tr').find('td');
        var $name = $($row[0]).text();
        $div = $("#deleteModal .modal-body");
        $div.empty()
        var data = "";
        data += "<label>آیا از حذف </label> ";
        data += "<label>" + $name + "</label> ";
        data += "<label> و تمام کالا های آن اطمینان دارید؟</label> ";
        $div.append(data);
        
        $('#deleteModal .deleteSaveButton').click(function(){
            $.ajax({
                url : url_delete,
                data : {
                    'name' : $name
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

    data += "<label for='name'>نام انبار :</label> "
    data += "<input type='text' id='name' name='name'><br><br>"
    $div.append(data);

    $('#addModal .addSaveButton').click(function(){
        $div = $("#addModal .modal-body");
        var $name = $($($div).find('#name')).prop("value");

        $.post(url_add, {
            name: $name,
        }, function(response, status){
            if(status == 'success'){
                var row = "";
                row += "<tr>";
                row += "<td>" + $name + "</td>";
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
