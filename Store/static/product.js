var url_list = '/api/mainProduct/list/';

$name = $('#name').text();
$price = $('#price').text();
$('#addToBasket').click(function(){
    $count = $('#count').val();
    console.log($count)
    $.ajax({
        url : url_list,
        data : {
            'name' : $name,
            'price' : $price,
            'count' : $count
        },
        type : "POST",
        success : function(response){
            console.log(response)
        },
        error : function(){
            console.log('eeee');
        }
    });
})