url_delete = "../api/mainProduct/delete/"

$('#basketApprove').click(function(){
    window.location.href='/basket/approve/';
})

$('.deleteProductFromBasket').click(function(){
    var $row = this.closest('tr')
    var $name = $($($row).find('td')[0]).html()
    var $price = $($($row).find('td')[1]).html()
    var $count = $($($row).find('td')[2]).html()
    console.log($name, $price, parseInt($price))
    $.post(url_delete,{
        'name' : $name,
        'price' : $price
    }, function(response, status){
        if(status == 'success' && response['response'] == 'SUCCESS'){
            currentSum = parseInt($('#sumPriceAllProduct').text())
            newSum = currentSum - parseInt($count) * parseInt($price)
            $('#sumPriceAllProduct').html(newSum.toString())
            $row.remove()
        }
    })
})