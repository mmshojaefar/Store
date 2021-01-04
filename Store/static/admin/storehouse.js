var url_list = '/api/storehouse/list';
var url_edit = '/api/storehouse/edit/';
var url_delete = '/api/storehouse/delete/';
var url_add = '/api/storehouse/add/';

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
        // console.log(this)
        $div = $("#editModal .modal-body");
        $div.empty();
        $row = $(this).closest('tr').find('td');
        var data = "" 
        data += "<label>نام انبار :</label> "
        data += "<input id='name'><br><br>"
        $div.append(data);  
    })

    $('#editModal .editSaveButton').click(function(){
        $name = $($($div).find('#name')).prop('value')
        // console.log($name)
        $.post(url_edit, {
            name : $name,
        },function(response, status){
            if(status=='success' && response=='SUCCESS'){
                $($row[0]).text($name)
            }
        });
        $('#editModal').modal('hide');
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
            // console.log($name)
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
    
    // console.log(this)
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