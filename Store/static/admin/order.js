var url_list = '/api/order/list';


$.get(url_list, function(response, status){
    var $tbody = $("tbody")
    $('table').show()

    JSON.parse(response).forEach(function(order){
        var name = order.name;
        var total = order.total;
        var date_submit = order.date_submit;
        var date_delivery=order.date_delivery;
        var address=order.address;
        var mobile=order.mobile;
        var id=order._id;
            var row = ""
            row += "<tr>";
            row += "<td class='name_o'>" + name + "</td>";
            row += "<td class='total_o'>" + total + "</td>";
            row += "<td class='date_submit_o'>" + date_submit + "</td>";
            row += "<td style='display:none' class='address_o'>" + address + "</td>";
            row += "<td style='display:none' class='mobile_o'>" + mobile + "</td>";            
            row += "<td style='display:none' class='date_delivery_o'>" + date_delivery + "</td>";
            row += "<td style='display:none' class='id_o'>" + id + "</td>";
            row += "<td>" ;
            row += "<button type='button' class='check' data-bs-toggle='modal' data-bs-target='#checkmodal'>بررسی سفارش</button>";
            row += "</td>";
            row += "</tr>";
            $tbody.append(row);
    })
    checkRow()
})

function checkRow(){

    $('tbody tr td:last-child button').click(function(){
        // console.error(this)
        $div = $("#checkmodal .modal-body");
        $div.empty();
        $row = $(this).closest('tr');
        console.log($row)
        
        var $name_o= $($row).find(".name_o").text();
        console.log($name_o)
        var $address_o = $($row).find(".address_o").text();
        var $mobile_o = $($row).find(".mobile_o").text();
        var $date_delivery_o = $($row).find(".date_delivery_o").text();
        var $date_submit_o = $($row).find(".date_submit_o").text();


        var data = "" 
        data += "<label>نام مشتری :</label> "
        data += "<label id='name_o'></label><br><br>"
        data += "<label>آدرس :</label> "
        data += "<label id='address_o'></label><br><br>"
        data += "<label>تلفن :</label> "
        data += "<label id='phone_o'></label><br><br>"
        data += "<label>زمان تحویل :</label> "
        data += "<label id='date_delivery_o'></label><br><br>"
        data += "<label>زمان سفارش :</label> "
        data += "<label id='date_submit_o'></label><br><br>"

        $div.append(data);
        $($($div).find('#name_o')).text($name_o);
        $($($div).find('#address_o')).text($address_o)
        $($($div).find('#phone_o')).text($mobile_o);
        $($($div).find('#date_delivery_o')).text($date_delivery_o)
        $($($div).find('#date_submit_o')).text($date_submit_o)
        
        
    })
}

