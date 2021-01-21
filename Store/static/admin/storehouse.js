var url_list = "/api/storehouse/list";
var url_edit = "/api/storehouse/edit/";
var url_delete = "/api/storehouse/delete/";
var url_add = "/api/storehouse/add/";

$.get(url_list, function (response, status) {
  var $tbody = $("tbody");
  JSON.parse(response).forEach(function (st) {
    var name = st.name;
    var row = "";
    row += "<tr>";
    row += "<td>" + name + "</td>";
    row += "<td>";
    row +=
      "<button type='button' class='edit btn btn-primary' data-bs-toggle='modal' data-bs-target='#editModal' style='margin-left: 5px;'> ویرایش</button>";
    row +=
      "<button type='button' class='delete btn btn-primary' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
    row += "</td>";
    row += "</tr>";
    $tbody.append(row);
  });
  $(".lds-default").hide();
  $("td").attr("valign", "middle");
  $("table").show();
  editRow();
  deleteRow();
  addRow();
});

function editRow() {
  var $div;
  var $row;
  $("tbody tr td:last-child button:first-child").click(function () {
    $div = $("#editModal .modal-body");
    $row = $(this).closest("tr").find("td");
    var $previous_name = $($row[0]).text();
    $("#editFormName").val("");
    $("#editFormPreName").text($previous_name);
    $("#editFormName").removeClass("is-invalid");
    $("#editFormName").html("");
    $("#editFinalError").removeClass("form-control is-invalid");
    $("#editFinalError").removeClass("form-control is-valid");
    $("#editFinalError").html("");
  });

  $("#editModal .editSaveButton").click(function () {
    $("#editFormName").removeClass("is-invalid");
    $("#editFinalError").removeClass("form-control is-invalid");
    $("#editFinalError").removeClass("form-control is-valid");
    $("#editFinalError").html("");

    var $name = $($($div).find("#editFormName")).prop("value");
    var $previous_name = $($row[0]).text();
    console.log($name)
    console.log($previous_name)
    $.post(
      url_edit,
      {
        name: $name,
        previous_name: $previous_name,
      },
      function (response, status) {
        if (status == "success" && response["response"] == "SUCCESS") {
          $($row[0]).text($name);
          $("#editFinalError").html(response["msg"]);
          $("#editFinalError").addClass("form-control is-valid");
          $("#editModal .editSaveButton").prop("disabled", "disabled");
          var counter = 3;
          var myInterval = setInterval(() => {
            counter--;
            if (counter <= 0) {
              clearInterval(myInterval);
              $("#editModal").modal("hide");
              $("#editModal .editSaveButton").prop("disabled", false);
            }
          }, 1000);
        } else if (status == "success" && response["response"] != "SUCCESS") {
          if (response["response"] != "FAILED") {
            $(response["response"]).addClass("form-control is-invalid");
            $(response["response"]).next().html(response["msg"]);
          } else {
            $("#editFinalError").html(response["msg"]);
            $("#editFinalError").addClass("form-control is-invalid");
          }
        } else {
          $("#editFinalError").html(
            "ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید"
          );
          $("#editFinalError").addClass("form-control is-invalid");
        }
      }
    );
  });
}

function deleteRow() {
  var $div;
  var $row;
  $("tbody tr td:last-child button:last-child").click(function () {
    $("#deleteFinalError").removeClass("form-control is-invalid");
    $("#deleteFinalError").removeClass("form-control is-valid");
    $("#deleteFinalError").html("");

    $row = $(this).closest("tr").find("td");
    $div = $("#deleteModal .modal-body");
    var $name = $($row[0]).text();
    $div.empty();
    var data = "";
    data += "<label>آیا از حذف </label> ";
    data += "<label>" + $name + "</label> ";
    data += "<label> و تمام کالا های آن اطمینان دارید؟</label> ";
    $div.append(data);
  });

  $("#deleteModal .deleteSaveButton").click(function () {
    $("#deleteFinalError").removeClass("form-control is-invalid");
    $("#deleteFinalError").removeClass("form-control is-valid");
    $("#deleteFinalError").html("");

    var $name = $($row[0]).text();
    $.ajax({
      url: url_delete,
      data: {
        name: $name,
      },
      type: "GET",
      success: function (response) {
        if (response["response"] == "SUCCESS") {
          $("#deleteFinalError").html(response["msg"]);
          $("#deleteFinalError").addClass("form-control is-valid");
          $("#deleteModal .deleteSaveButton").prop("disabled", "disabled");
          var counter = 3;
          var myInterval = setInterval(() => {
            counter--;
            if (counter <= 0) {
              clearInterval(myInterval);
              $("#deleteModal").modal("hide");
              $row.remove();
              $("#deleteModal .deleteSaveButton").prop("disabled", false);
            }
          }, 1000);
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
  $("#addStorehouseTopButton").click(function () {
    $div = $("#addModal .modal-body");
    $("#addFormName").val("");
    $("#addFormName").removeClass("is-invalid");
    $("#addFormName").next().html("");
  });

  $("#addModal .addSaveButton").click(function () {
    $("#addFormName").removeClass("is-invalid");
    $("#addFinalError").removeClass("form-control is-invalid");
    var $name = $($($div).find("#addFormName")).prop("value");

    $.post(
      url_add,
      {
        name: $name,
      },
      function (response, status) {
        if (status == "success" && response["response"] == "SUCCESS") {
          var row = "";
          row += "<tr>";
          row += "<td valign='middle'>" + $name + "</td>";
          row += "<td valign='middle'>";
          row +=
            "<button type='button' class='edit btn btn-primary' data-bs-toggle='modal' data-bs-target='#editModal' style='margin-left: 5px;'> ویرایش</button>";
          row +=
            "<button type='button' class='delete btn btn-primary' data-bs-toggle='modal' data-bs-target='#deleteModal'> حذف</button>";
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
          $("#addFinalError").html(
            "ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید"
          );
          $("#addFinalError").addClass("form-control is-invalid");
        }
      }
    );
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
