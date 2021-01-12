var url_list = '/api/order/list';
var url_detail='/api/detail';


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
        var products_id=JSON.stringify(order.product);
        console.log(products_id)
            var row = ""
            row += "<tr>";
            row += "<td class='name_o'>" + name + "</td>";
            row += "<td class='total_o'>" + total + "</td>";
            row += "<td class='date_submit_o'>" + date_submit + "</td>";
            row += "<td style='display:none' class='address_o'>" + address + "</td>";
            row += "<td style='display:none' class='mobile_o'>" + mobile + "</td>";            
            row += "<td style='display:none' class='date_delivery_o'>" + date_delivery + "</td>";
            row += "<td style='display:none' class='products_id'>" + products_id.toString() + "</td>";

            
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
        $div = $("#checkmodal .modal-body");
        $div.empty();
        $row = $(this).closest('tr'); 
        var $name_o= $($row).find(".name_o").text();
        var $address_o = $($row).find(".address_o").text();
        var $mobile_o = $($row).find(".mobile_o").text();
        var $date_delivery_o = $($row).find(".date_delivery_o").text();
        var $date_submit_o = $($row).find(".date_submit_o").text();
        var $products_id=$($row).find(".products_id").text();

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
        

  
            var products=JSON.parse($products_id)
            id_product=Object.keys(products)
            console.log(id_product)
            // console.log(Object.keys(products).length)
            // console.log(products.length)

            // Table_detail
            t_detail = ''
            t_detail += "<br><br>"
            t_detail += "<table border=1 class='table table-striped' >"
                t_detail += "<thead>"
                    t_detail += "<tr>"
                        t_detail += "<th>کالا</th>"
                        t_detail += "<th>قیمت</th>"
                        t_detail += "<th>تعداد</th>"
                        t_detail += "<th>انبار</th>"
                    t_detail += "</tr>"
                t_detail += "</thead>"
                t_detail += "<tbody id='tbody_detail'></tbody>"
            t_detail += "</table>"
            $div.append(t_detail)

            // JSON.parse($products_id).forEach(function(product){
            console.log(products)
            var oid;
            for(oid in products){
                console.log(oid)
                var $name_product = products[oid].name;
                console.log($name_product)
                var $price_product = products[oid].price;
                console.log($price_product)
                var $count_product = products[oid].count;
                var $storehouse_product=products[oid].storehouse;
                
                    var row = ""
                    // row += "<br><br>"
                    row += "<tr>";
                    var str_href="/product/?name="+$name_product+"&price="+$price_product
                    row += "<td class='name_p'><a href='"+str_href+"'>"+$name_product+"</a></td>";
                    row += "<td class='price_p'>" + $price_product + "</td>";
                    row += "<td class='count_o'>" + $count_product + "</td>";
                    row += "<td class='storehouse_o'>" + $storehouse_product + "</td>";
                    row += "</tr>";
                    $('#tbody_detail').append(row);

                    // $($($div).find('#name_p')).text($name_product);
                    // $($($div).find('#price_p')).text($price_product)
                    // $($($div).find('#phone_o')).text($count_product);
                    // $($($div).find('#count_o')).text($storehouse_product);
            }

                
            // })

    })
}

