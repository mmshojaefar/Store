var url_list = "/api/product/list";
var url_edit = "/api/product/edit/";
var url_delete = "/api/product/delete/";
var url_add = "/api/product/add/";
var storehouse_list_url = "/api/storehouse/list/";

$.get(storehouse_list_url, function (response, status) {
  global_all_storehouse = [];
  JSON.parse(response).forEach(function (st) {
    global_all_storehouse.push(st.name);
  });
});

$.get(url_list, function (response, status) {
  var $tbody = $("tbody");
  JSON.parse(response).forEach(function (product) {
    var image = product.image;
    var name = product.name;
    var category = product.category;
    var subcategory = product.subcategory;
    var row = "";
    row += "<tr>";
    var src = "/static/" + image;
    row +=
      "<td>" +
      "<img style ='height:50px; width: 50px; border-radius: 10px' src=" +
      src +
      "></td>";
    console.log(image);
    row += "<td>" + name + "</td>";
    row += "<td>" + category + " >> " + subcategory + "</td>";
    row += "<td>";
    row +=
      "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
    row +=
      "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
    row += "</td>";
    row += "</tr>";
    $tbody.append(row);
  });
  $("table").show();
  $(".lds-default").hide();
  editRow();
  deleteRow();
  addRow();
  addImport();
});

function editRow() {

  var $div;
  $("tbody tr td:last-child button:first-child").click(function () {
    $div = $("#editModal .modal-body");
    $row = $(this).closest("tr").find("td");
    // var $image = $row.find("img").attr("src")
    var $name = $($row[1]).text();
    var $category = $($row[2]).text().split(" >> ")[0];
    var $subcategory = $($row[2]).text().split(" >> ")[1];
    $thisrow = this.closest('tr')
    $("#editFormName").removeClass("is-invalid");
    $("#editFormName").html("");
    $("#editFormCategory").removeClass("is-invalid");
    $("#editFormCategory").html("");
    $("#editFormSubcategory").removeClass("is-invalid");
    $("#editFormSubcategory").html("");
    $("#editFormImage").removeClass("is-invalid");
    $("#editFormImage").html("");
    $("#editFinalError").removeClass("form-control is-invalid");
    $("#editFinalError").html("");


    $($($div).find("#editFormName")).text($name);
    $($($div).find("#editFormCategory")).val($category);
    $($($div).find("#editFormSubcategory")).val($subcategory);
    // var fi = new FormData();
    //     var files = $('#image')[0].files;
    // if(files.length > 0 )
    //     fi.append('file',files[0]);
  });

  $("#editModal .editSaveButton").click(function (u1) {
    // console.log('ahannn')
    $("#editFormName").removeClass("is-invalid");
    $("#editFormCategory").removeClass("is-invalid");
    $("#editFormSubcategory").removeClass("is-invalid");
    $("#editFinalError").empty();
    // console.log('first step')

    u1.stopPropagation();
    $('#editForm').submit(function(u){
        u.stopImmediatePropagation()
        var formData = new FormData(this)
        formData.append('editFormName', $('#editFormName').text())
        u.preventDefault();
        fetch(url_edit, {
            method: "POST",
            body: formData
        })
        .then(function (res) {
            return res.json()
        })
        .then( (response) => {
            if(response['response'] == 'SUCCESS'){
                $div = $('#editModal .modal-body');
                console.log('Success')
                var $image = $($($div).find('#editFormImage')).prop('value')
                var $name = $($($div).find('#editFormName')).text();
                var $category = $($($div).find('#editFormCategory')).val();
                var $subcategory = $($($div).find('#editFormSubcategory')).val();
                console.log(response['msg'])
                var src = '/static/' + response['msg'];
                var row = '';
                row += '<tr>';
                row += '<td>' + '<img style = "height:50px; width:50px; border-radius:10px" src="' + src + '"</td>'
                row += '<td>' + $name + '</td>';
                row += '<td>' + $category + ' >> ' + $subcategory + '</td>';
                row += '<td>';
                row += '<button type="button" class="edit" data-bs-toggle="modal" data-bs-target="#editModal">ویرایش</button>';
                row += '<button type="button" class="delete" data-bs-toggle="modal" data-bs-target="#deleteModal">حذف</button>';
                row += '</td>';
                row += '</tr>';
                // $('tbody').append(row);
                $($thisrow).replaceWith(row)
                editRow();
                deleteRow();
                $('#editModal .modal-body input').val('');
                $('#editModal').modal('hide');
            }

            else if(response['response'] != 'SUCCESS') {
                if(response['response'] != 'FAILED' && response['response'] != 'FAILEDIMG' ) {
                    $(response['response']).addClass('form-control is-invalid')
                    $(response['response']).next().html(response['msg'])
                }
                else if(response['response'] == 'FAILED'){
                    $('#editFinalError').html(response['msg'])
                    $('#editFinalError').addClass('form-control is-invalid')
                }
                else{
                    $('#editFinalError').html(response['msg'])
                    $('#editFinalError').addClass('form-control is-invalid')
                    $('#addModal .addSaveButton').prop('disabled', 'disabled')

                    var counter = 3;
                    var myInterval = setInterval(()=>{
                        counter--;
                        if (counter<=0){
                            clearInterval(myInterval)
                            $('#addModal').modal('hide');
                            $('#addModal .addSaveButton').prop('disabled', false)
                        }
                    },1000)
                }
            }
        }).catch(function(){
            $('#editFinalError').html('ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید')
            $('#editFinalError').addClass('form-control is-invalid')
        })
    })

  })

  // $("tbody tr td:last-child button:first-child").click(function () {
  //   $div = $("#editModal .modal-body");
  //   $row = $(this).closest("tr").find("td");
  //   var $image = $row.find("img").attr("src")
  //   var $name = $($row[1]).text();
  //   var $category = $($row[2]).text().split(" >> ")[0];
  //   var $subcategory = $($row[2]).text().split(" >> ")[1];

  //   $("#editFormName").removeClass("is-invalid");
  //   $("#editFormName").html("");
  //   $("#editFormCategory").removeClass("is-invalid");
  //   $("#editFormCategory").html("");
  //   $("#editFormSubcategory").removeClass("is-invalid");
  //   $("#editFormSubcategory").html("");
  //   $("#editFinalError").removeClass("form-control is-invalid");
  //   $("#editFinalError").html("");

  //   $($($div).find("#editFormName")).text($name);
  //   $($($div).find("#editFormCategory")).val($category);
  //   $($($div).find("#editFormSubcategory")).val($subcategory);
  //   // var fi = new FormData();
  //   //     var files = $('#image')[0].files;
  //   // if(files.length > 0 )
  //   //     fi.append('file',files[0]);
  // });

  // $("#editModal .editSaveButton").click(function () {
  //   $("#editFormName").removeClass("is-invalid");
  //   $("#editFormCategory").removeClass("is-invalid");
  //   $("#editFormSubcategory").removeClass("is-invalid");
  //   $("#editFinalError").removeClass("form-control is-invalid");
  //   $("#editFinalError").html("");

  //   $name = $($($div).find("#editFormName")).text();
  //   $category = $($($div).find("#editFormCategory")).prop("value");
  //   $subcategory = $($($div).find("#editFormSubcategory")).prop("value");
  //   // $image = $($('div').find('#image')).prop("value");
  //   $.post(
  //     url_edit,
  //     {
  //       name: $name,
  //       category: $category,
  //       subcategory: $subcategory,
  //       // image : $image,
  //     },
  //     function (response, status) {
  //       if (status == "success" && response["response"] == "SUCCESS") {
  //         $($row[2]).text($category + " >> " + $subcategory);
  //         // $($row[0]).text($image)
  //         $("#editModal").modal("hide");
  //       } else if ((status = "success" && response["response"] != "SUCCESS")) {
  //         if (response["response"] != "FAILED") {
  //           $(response["response"]).addClass("form-control is-invalid");
  //           $(response["response"]).next().html(response["msg"]);
  //         } else {
  //           $("#editFinalError").html(response["msg"]);
  //           $("#editFinalError").addClass("form-control in-invalid");
  //         }
  //       } else {
  //         $("editFinalError").html(
  //           "ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید"
  //         );
  //         $("editFinalError").addClass("form-control is-invalid");
  //       }
  //     }
  //   );
  // });
}

function deleteRow() {
  var $name;
  var $category;
  // var $subcategory
  // var image
  $("tbody tr td:last-child button:last-child").click(function () {
    $("#deleteFinalError").removeClass("form-control is-invalid");
    $("#deleteFinalError").removeClass("form-control is-valid");
    $("#deleteFinalError").html("");

    $row_data = $(this).closest("tr");
    $row = $(this).closest("tr").find("td");
    $image = $($row[0]).text();
    $name = $($row[1]).text();
    $category = $($row[2]).text().split(" >> ")[0];
    $div = $("#deleteModal .modal-body");
    $div.empty();
    var data = "";
    data += "<label> آیا از حذف</label> ";
    data += "<label>" + $name + "</label> ";
    data += "<label'> در دسته بندی </label> ";
    data += "<label>" + $category + "</label> ";
    data += "<label> اطمینان دارید؟</label> ";
    $div.append(data);
  });

  $("#deleteModal .deleteSaveButton").click(function () {
    $("#deleteFinalError").removeClass("form-control is-invalid");
    $("#deleteFinalError").removeClass("form-control is-valid");
    $("#deleteFinalError").html("");

    $.ajax({
      url: url_delete,
      data: {
        name: $name,
      },
      type: "GET",
      success: function (response) {
        if (response["response"] == "SUCCESS") {
          console.log("aaaaaaaaaaaaaaaaa");
          $row_data.remove();
          $("#deleteModal").modal("hide");
        } else {
          $("#deleteFinalError").html(response["msg"]);
          $("#deleteFinalError").addClass("form-control is-invalid");
        }
      },
      error: function () {
        $("#deleteFinalError").html(
          "ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید"
        );
        $("#deleteFinalError").addClass("form-control is-invalid");
      },
    });
  });
}

function addRow() {
  var $div;
  $("#addProductTopButton").click(function () {
    $div = $("#addModal .modal-body");
    $($($div).find("#addFormName")).val("");
    $($($div).find("#addFormDescription")).val("");
    $($($div).find("#addFormCategory")).val("");
    $($($div).find("#addFormSubcategory")).val("");
    $($($div).find("#addFormPrice")).val("");
    $($($div).find("#addFormCount")).val("");
    $($($div).find("#addFormImage")).val("");
    $($($div).find("#addFormStorehouse")).prop("selectedIndex", 0);

    $("#addFormName").removeClass("is-invalid");
    $("#addFormName").html("");
    $("#addFormDescription").removeClass("is-invalid");
    $("#addFormDescription").html("");
    $("#addFormCategory").removeClass("is-invalid");
    $("#addFormCategory").html("");
    $("#addFormSubcategory").removeClass("is-invalid");
    $("#addFormSubcategory").html("");
    $("#addFormPrice").removeClass("is-invalid");
    $("#addFormPrice").html("");
    $("#addFormCount").removeClass("is-invalid");
    $("#addFormCount").html("");
    $("#addFinalError").removeClass("form-control is-invalid");
    $("#addFinalError").html("");

    if ($("#addFormStorehouse").find("option").length == 0) {
      global_all_storehouse.forEach(function (st) {
        var option = new Option(st, st);
        $($($div).find("#addFormStorehouse")).append(option);
      });
    }
  });

  $("#addModal .addSaveButton").click(function (o1) {
    $("#addFormName").removeClass("is-invalid");
    $("#addFormDescription").removeClass("is-invalid");
    $("#addFormCategory").removeClass("is-invalid");
    $("#addFormSubcategory").removeClass("is-invalid");
    $("#addFormPrice").removeClass("is-invalid");
    $("#addFormCount").removeClass("is-invalid");
    $("#addFinalError").empty();

    o1.stopPropagation();
    $('#addForm').submit(function(o2){
        o2.stopImmediatePropagation()
        var formData = new FormData(this)
        o2.preventDefault();
        console.log('majiiiiiiiiid')
        fetch(url_add, {
            method: "POST",
            body: formData
        })
        .then(function (res) {
            return res.json()
        })
        .then( (response) => {
            console.log('majiiiiiiiiid')
            if(response['response'] == 'SUCCESS'){
                $div = $('#addModal .modal-body');
                var $name = $($($div).find('#addFormName')).prop('value');
                var $category = $($($div).find('#addFormCategory')).prop('value');
                var $subcategory = $($($div).find('#addFormSubcategory')).prop('value');
                console.log(response['msg'])
                var src = '/static/' + response['msg'];
                var row = '';
                row += '<tr>';
                row += '<td>' + '<img style = "height:50px; width:50px; border-radius:10px" src="' + src + '"</td>'
                row += '<td>' + $name + '</td>';
                row += '<td>' + $category + ' >> ' + $subcategory + '</td>';
                row += '<td>';
                row += '<button type="button" class="edit" data-bs-toggle="modal" data-bs-target="#editModal">ویرایش</button>';
                row += '<button type="button" class="delete" data-bs-toggle="modal" data-bs-target="#deleteModal">حذف</button>';
                row += '</td>';
                row += '</tr>';
                $('tbody').append(row);
                editRow();
                deleteRow();
                $('#addModal .modal-body input').val('');
                $('#addModal').modal('hide');
            }

            else if(response['response'] != 'SUCCESS') {
                if(response['response'] != 'FAILED' && response['response'] != 'FAILEDIMG' ) {
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
                            $('#addModal').modal('hide');
                            $('#addModal .addSaveButton').prop('disabled', false)
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

function addImport() {
  $div = $("#importModal .modal-body");
  $div.empty();
  var data = "";

  data += "<label for='addName'>انتخاب فایل :</label><br><br>";
  data += "<input type='file' accept='.txt' id='addFile' name='addFile'>";
  $div.append(data);

  var fd = new FormData();
  var files = $("#addFile")[0].files;
  if (files.length > 0) fd.append("file", files[0]);

  $("#addModal .addSaveButton").click(function () {
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
    // $('#addModal').modal('hide');
  });
}

$("th").click(function () {
  var table = $(this).parents("table").eq(0);
  var rows = table
    .find("tr:gt(0)")
    .toArray()
    .sort(comparer($(this).index()));
  this.asc = !this.asc;
  if (!this.asc) {
    rows = rows.reverse();
  }
  for (var i = 0; i < rows.length; i++) {
    table.append(rows[i]);
  }
});
function comparer(index) {
  return function (a, b) {
    var valA = getCellValue(a, index),
      valB = getCellValue(b, index);
    return $.isNumeric(valA) && $.isNumeric(valB)
      ? valA - valB
      : valA.toString().localeCompare(valB);
  };
}
function getCellValue(row, index) {
  return $(row).children("td").eq(index).text();
}
