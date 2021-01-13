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
    row += "<td>" + name + "</td>";
    row += "<td>" + category + " >> " + subcategory + "</td>";
    row += "<td>";
    row +=
      "<button class='edit btn btn-primary' type='button' data-bs-toggle='modal' data-bs-target='#editModal' style='margin-left: 5px;'> ویرایش</button>";
    row +=
      "<button class='delete btn btn-primary' type='button' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
    row += "</td>";
    row += "</tr>";
    $tbody.append(row);
  });
  $("table").show();
  $("td").attr("valign", "middle");
  $(".lds-default").hide();
  editRow();
  deleteRow();
  addRow();
  addImport();
});

function editRow() {
  $("tbody tr td:last-child button:first-child").click(function () {
    $div = $("#editModal .modal-body");
    $row = $(this).closest("tr").find("td");
    var $name = $($row[1]).text();
    var $category = $($row[2]).text().split(" >> ")[0];
    var $subcategory = $($row[2]).text().split(" >> ")[1];

    $("#editFormName").removeClass("is-invalid");
    $("#editFormName").html("");
    $("#editFormCategory").removeClass("is-invalid");
    $("#editFormCategory").html("");
    $("#editFormSubcategory").removeClass("is-invalid");
    $("#editFormSubcategory").html("");
    $("#editFinalError").removeClass("form-control is-invalid");
    $("#editFinalError").html("");

    $($($div).find("#editFormName")).text($name);
    $($($div).find("#editFormCategory")).val($category);
    $($($div).find("#editFormSubcategory")).val($subcategory);
  });

  $("#editModal .editSaveButton").click(function () {
    $("#editFormName").removeClass("is-invalid");
    $("#editFormCategory").removeClass("is-invalid");
    $("#editFormSubcategory").removeClass("is-invalid");
    $("#editFinalError").removeClass("form-control is-invalid");
    $("#editFinalError").html("");

    $name = $($($div).find("#editFormName")).text();
    $category = $($($div).find("#editFormCategory")).prop("value");
    $subcategory = $($($div).find("#editFormSubcategory")).prop("value");
    $.post(
      url_edit,
      {
        name: $name,
        category: $category,
        subcategory: $subcategory,
      },
      function (response, status) {
        if (status == "success" && response["response"] == "SUCCESS") {
          $($row[2]).text($category + " >> " + $subcategory);
          $("#editModal").modal("hide");
        } else if ((status = "success" && response["response"] != "SUCCESS")) {
          if (response["response"] != "FAILED") {
            $(response["response"]).addClass("form-control is-invalid");
            $(response["response"]).next().html(response["msg"]);
          } else {
            $("#editFinalError").html(response["msg"]);
            $("#editFinalError").addClass("form-control in-invalid");
          }
        } else {
          $("editFinalError").html(
            "ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید"
          );
          $("editFinalError").addClass("form-control is-invalid");
        }
      }
    );
  });
}

function deleteRow() {
  var $name;
  var $category;
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
  var $div = $("#addModal .modal-body");
  $("#addProductBtn").click(function () {
    $($($div).find("#addFormName")).val("");
    $($($div).find("#addFormDescription")).val("");
    $($($div).find("#addFormCategory")).val("");
    $($($div).find("#addFormSubcategory")).val("");
    $($($div).find("#addFormPrice")).val("");
    $($($div).find("#addFormCount")).val("");
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
  });
  global_all_storehouse.forEach(function (st) {
    var option = new Option(st, st);
    $($($div).find("#addFormStorehouse")).append(option);
  });

  $("#addModal .addSaveButton").click(function () {
    $("#addFormName").removeClass("is-invalid");
    $("#addFormDescription").removeClass("is-invalid");
    $("#addFormCategory").removeClass("is-invalid");
    $("#addFormSubcategory").removeClass("is-invalid");
    $("#addFormPrice").removeClass("is-invalid");
    $("#addFormCount").removeClass("is-invalid");
    $("#addFinalError").removeClass("form-control is-invalid");

    $div = $("#addModal .modal-body");
    var $name = $($($div).find("#addFormName")).prop("value");
    var $price = $($($div).find("#addFormPrice")).prop("value");
    var $count = $($($div).find("#addFormCount")).prop("value");
    var $description = $($($div).find("#addFormDescription")).prop("value");
    var $storehouse = $($($div).find("#addFormStorehouse")).prop("value");
    var $category = $($($div).find("#addFormCategory")).prop("value");
    var $subcategory = $($($div).find("#addFormSubcategory")).prop("value");
    $.post(
      url_add,
      {
        name: $name,
        price: $price,
        count: $count,

        description: $description,
        storehouse: $storehouse,
        category: $category,
        subcategory: $subcategory,
      },
      function (response, status) {
        if (status == "success" && response["response"] == "SUCCESS") {
          var row = "";
          row += "<tr>";
          // $image
          row += "<td>" + "</td>";
          row += "<td>" + $name + "</td>";
          row += "<td>" + $category + " >> " + $subcategory + "</td>";
          row += "<td>";
          row +=
            "<button type='button' class='edit' data-bs-toggle='modal' data-bs-target='#editModal'> ویرایش</button>";
          row +=
            "<button class='delete' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
          row += "</td>";
          row += "</tr>";
          $("tbody").append(row);
          editRow();
          deleteRow();
          $("#addModal .modal-body input").val("");
          $("#addModal").modal("hide");
        } else if (status == "success" && response["response"] != "SUCCESS") {
          if (response["response"] != "FAILED") {
            $(response["response"]).addClass("form-control is-invalid");
            $(response["response"]).next().html(response["msg"]);
          } else {
            $("#addFinalError").html(response["msg"]);
            $("#addFinalError").addClass("form-control is-invalid");
          }
        } else {
          $("#addFinalError").html(response["لطفا مجددا تلاش کنید"]);
          $("#addFinalError").addClass("form-control is-invalid");
        }
      }
    );
  });
}

function addImport() {
  $div = $("#importModal .modal-body");
  $div.empty();
  var data = "";

  data += "<label for='addName'>انتخاب فایل :</label><br><br>";
  data +=
    "<input class='form-control' type='file' accept='.txt' id='addFile' name='addFile'>";
  $div.append(data);

  var fd = new FormData();
  var files = $("#addFile")[0].files;
  if (files.length > 0) fd.append("file", files[0]);

  $("#addModal .addSaveButton").click(function () {});
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
