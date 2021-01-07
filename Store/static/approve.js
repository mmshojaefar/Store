approve_url = '../../api/mainProduct/approve/'

$('#submitOrderFinal').click(function(event){
    event.preventDefault()

    $('#formFirstName').removeClass('is-invalid')
    $('#formFirstName').next().html('')
    $('#formLastName').removeClass('is-invalid')
    $('#formLastName').next().html('')
    $('#formDate').removeClass('is-invalid')
    $('#formDate').next().html('')
    $('#formTelphone').removeClass('is-invalid')
    $('#formTelphone').next().html('')
    $('#formAddress').removeClass('is-invalid')
    $('#formAddress').next().html('')
    $('#FinalResualtModal').empty()

    var firstName = $('#formFirstName').val()
    var lastName = $('#formLastName').val()
    var date = $('#formDate').val()
    var tel = $('#formTelphone').val()
    var address = $('#formAddress').val()
    console.log(firstName, lastName, date, tel, address)
    $.post(approve_url, {
        'firstname' : firstName,
        'lastname' : lastName,
        'date' : date,
        'tel' : tel,
        'address' : address
    }, function(response, status){
        if(status=='success' && response['response']=='SUCCESS'){
            var data = '<label>سفارش با موفقیت ثبت شد</label>'
            $('#FinalModalLabel').html('موفقیت')
            $('#FinalResualtModal').append(data)
            $('#FinalModal').modal('show');
        }
        else if(status=='success' && response['response']!='SUCCESS'){
            if(response['response'] != 'FAILED' && response['response'] != 'FAILEDNULL' ){
                $(response['response']).addClass('form-control is-invalid')
                $(response['response']).next().html(response['msg'])
            }
            else{
                if( response['response'] == 'FAILEDNULL' ){
                    $('#FinalModalLabel').html('اخطار')
                    $('#FinalResualtModal').append(response['msg'])
                    $('#FinalModal').modal('show');    
                }
                else{
                    var data = '<label>موجودی کالاهای زیر به اتمام رسیده است</label>'
                    data += '<ul class="list-group">'
                    JSON.parse(response['msg']).forEach( pr => {
                        console.log(pr['name'])
                        data += '<li>' + pr['name'] + '</li>'
                    });
                    data += '</ul>'
                    $('#FinalResualtModal').append(data)
                    $('#FinalModal').modal('show'); 
                }
            }
        }
        else{
            $('#FinalModalLabel').html('اخطار')
            $('#FinalResualtModal').html('ارتباط با سرور قطع شده است. لطفا مجددا تلاش کنید')
            $('#FinalModal').modal('show');    
        }
        console.log(response)
        console.log(status)
    })
})