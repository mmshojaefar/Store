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
            row += "<button type='button' class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
            row += "</td>";
            row += "</tr>";
            $tbody.append(row);
        }
    })
    $('.lds-default').hide()
    $('table').show()
    addRow()
    editRow();
    deleteRow();
})

function editRow(){
    // var $div
    // var $row
    $('tbody tr td:last-child button:first-child').click(function(){
        $div = $("#editModal .modal-body");
        $row = $(this).closest('tr').find('td');
        var $storehouse = $($row[0]).text();
        var $name = $($row[1]).text();
        var $price = $($row[2]).text();
        var $count = $($row[3]).text();
        $('#editFormPrice').removeClass('is-invalid')
        $('#editFormPrice').html("")
        $('#editFormCount').removeClass('is-invalid')
        $('#editFormCount').html("")
        $('#editFinalError').removeClass('form-control is-invalid')
        $('#editFinalError').html("")

        $($($div).find('#editFormStorehouse')).text($storehouse);
        $($($div).find('#editFormName')).text($name)
        $($($div).find('#editFormPrice')).val($price)
        $($($div).find('#editFormCount')).val($count)
    })

    $('#editModal .editSaveButton').click(function(){
        $('#editFormPrice').removeClass('is-invalid')
        $('#editFormCount').removeClass('is-invalid')
        $('#editFinalError').removeClass('form-control is-invalid')
        $('#editFinalError').html("")
       
        $storehouse = $($($div).find('#editFormStorehouse')).text();
        $name = $($($div).find('#editFormName')).text();
        $price = $($($div).find('#editFormPrice')).prop("value");
        $count = $($($div).find('#editFormCount')).prop("value");

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
            else{
                $('#editFinalError').html('ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید')
                $('#editFinalError').addClass('form-control is-invalid')
            }
        });
    })
}

function deleteRow(){
    var $storehouse 
    var $name
    var $price 
    var $count
    $('tbody tr td:last-child button:last-child').click(function(){

        $('#deleteFinalError').removeClass('form-control is-invalid')
        $('#deleteFinalError').removeClass('form-control is-valid')
        $('#deleteFinalError').html("")

        $row = $(this).closest('tr');
        $row_data = $(this).closest('tr').find('td');
        $storehouse = $($row_data[0]).text(); 
        $name = $($row_data[1]).text();
        $price = $($row_data[2]).text(); 
        $count = $($row_data[3]).text();
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
    })

    $('#deleteModal .deleteSaveButton').click(function(){

        $('#deleteFinalError').removeClass('form-control is-invalid')
        $('#deleteFinalError').removeClass('form-control is-valid')
        $('#deleteFinalError').html("")
        
        console.log(555555566)
        $.ajax({
            url : url_delete,
            data : {
                'name' : $name,
                'storehouse' : $storehouse,
                'price' : $price,
                'count' : $count
            },
            type : "GET",
            success : function(response){
                if(response['response'] == 'SUCCESS'){
                    console.log(response)
                    $row.remove();
                    $('#deleteModal').modal('hide');
                }
                else{
                    console.log(response)
                    $('#deleteFinalError').html(response['msg'])
                    $('#deleteFinalError').addClass('form-control is-invalid')
                }
            },
            error : function(){
                $('#deleteFinalError').html('ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید')
                $('#deleteFinalError').addClass('form-control is-invalid')
            }
        });
    })
}

function addRow(){
    var $div;
    $('#addExistingTopButton').click(function(){
        $div = $("#addModal .modal-body");
        $($($div).find('#addFormName')).val("");
        $($($div).find('#addFormPrice')).val("");
        $($($div).find('#addFormCategory')).val("");
        $($($div).find('#addFormSubCategory')).val("");
        $($($div).find('#addFormCount')).val("");
        $($($div).find('#addFormStorehouse')).prop("selectedIndex",0);

        
        $('#addFormName').removeClass('is-invalid')
        $('#addFormName').next().html("")
        $('#addFormPrice').removeClass('is-invalid')
        $('#addFormPrice').next().html("")
        $('#addFormCount').removeClass('is-invalid')
        $('#addFormCount').next().html("")
        $('#addFormCategory').removeClass('is-invalid')
        $('#addFormCategory').next().html("")
        $('#addFormSubCategory').removeClass('is-invalid')
        $('#addFormSubCategory').next().html("")
        $('#editFinalError').removeClass('form-control is-invalid')
        $('#editFinalError').html("")

        if($('#addFormStorehouse').find('option').length == 0){
            global_all_storehouse.forEach(function(st){
                var option = new Option(st, st);
                $($($div).find('#addFormStorehouse')).append(option)
                
            })
        }
    })

    // $('#tesssst').click(function(event){
    //     console.log(111111)
    //     event.preventDefault()
    //     // $image = $('#tesssst1').prop('files')[0]
    //     var formData = new FormData()
    //     formData.append('image',fileInputElement.files[0])
    //     // console.log($image)
    //     $.post('../../api/existing/add_image/',{
    //         'image' : formData
    //     }, function(response){
    //         console.log(response)
    //     })
    // })
    

    // $('#addForm').submit(function(e){
    //     console.log(555)
    //     e.preventDefault();
    //     var formData = new FormData(this);
    //     formData.append('name', 'abs')
    //     console.log(formData)
    //     fetch('/api/existing/add_image/', {
    //         method: "POST", 
    //         body: formData
    //     })
    // })


    // $('#addForm').submit(function(e){
    //     e.preventDefault();
    //     var formData = new FormData(this);
    //     for (var p of formData) {
    //         console.log(p);
    //     }
    //     $('#addModal .addSaveButton').click(function(){
    //         fetch('/api/existing/add_image/', {
    //             method: "POST", 
    //             body: formData
    //         })
    //         .then(function(res){
    //             console.log(res)
    //             console.log(4444)
    //         })
    //         console.log(5555)
    //     })
    // })



    $('#addModal .addSaveButton').click(function(e1){
        $('#addFormName').removeClass('is-invalid')
        $('#addFormPrice').removeClass('is-invalid')
        $('#addFormCount').removeClass('is-invalid')
        $('#addFormCategory').removeClass('is-invalid')
        $('#addFormSubCategory').removeClass('is-invalid')
        $('#addFinalError').removeClass('form-control is-invalid')
        
        e1.stopPropagation()
        $('#addForm').submit(function(e){
            e.stopImmediatePropagation()
            var formData = new FormData(this); 
            e.preventDefault();
            fetch(url_add, {
                method: "POST", 
                body: formData
            })
            .then(function (res) {
                return res.json()
            })
            .then( (response) => {
                console.log(response['response']);
                console.log(response['msg']);
                if(response['response'] == 'SUCCESS'){
                    $div = $("#addModal .modal-body");
                    var $storehouse = $($($div).find('#addFormStorehouse')).prop("value");
                    var $name = $($($div).find('#addFormName')).prop("value");
                    var $price = $($($div).find('#addFormPrice')).prop("value");
                    var $count = $($($div).find('#addFormCount')).prop("value");
                    
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
                    $('#addModal').modal('hide');
                }
                else if(response['response'] != 'SUCCESS'){
                    if(response['response'] != 'FAILED' && response['response'] != 'FAILEDIMG'){
                        $(response['response']).addClass('form-control is-invalid')
                        $(response['response']).next().html(response['msg'])
                    }
                    else if(response['response'] == 'FAILED'){
                        $('#addFinalError').html(response['msg'])
                        $('#addFinalError').addClass('form-control is-invalid')
                    }
                    else{
                        $('#addFinalError').html(response['msg'])
                        $('#addFinalError').addClass('form-control is-invalid')
                        $('#addModal .addSaveButton').prop('disabled', 'disabled')

                        var counter = 3;
                        var myInterval = setInterval(()=>{
                            counter--;
                            if (counter<=0){
                                clearInterval(myInterval)
                                $('#editModal').modal('hide');
                                $('#editModal .editSaveButton').prop('disabled', false)    
                            }
                        },1000)
                    }
                }
            }).catch(function(){
                $('#addFinalError').html('ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید')
                $('#addFinalError').addClass('form-control is-invalid')
            })

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