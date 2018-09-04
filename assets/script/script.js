let index = 0;
let is_loading = false;
let language = 'zh-tw';

$(document).ready(function(){

    appendData(language);

    $(window).scroll(function(){
        //當捲到最下200px時，載入新item
        if($(window).scrollTop() + $(window).height() > $(document).height() - 200){
            if(!is_loading){
                appendData(language);
            }
        }
    });
})

function request(lang, callback){

    console.log('loading');

    is_loading = true;

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams/?autoplay=false&game=Overwatch&language='+lang+'&limit=10&offset='+index,
        headers: {  //
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'fs578pi55x8w9nf9mdz8pyjeb92n67'
        },

        success: function(data){
            console.log(data);
            callback(null, data);
        },
        error: function(e){
            console.log('error');
            callback(null, e);
        }
    });
}

function appendData(lang){
    request(lang, (e, data) =>{
        const {streams} = data;
        const $content = $('#content');
        for (let stream of streams){
            $content.append(getData(stream));
        }
        index += 10;
        is_loading = false;
    });
}

function getData(data){
    var logo = data.channel.logo;
    var preview = data.preview.medium;

    return `
        <li class='item'>
            <a href="${data.channel.url}" target="_blank" rel="noopener noreferrer">
                <div class='video'>
                    <img class='placeholder' src='${preview}' />
                </div>
                <div class='avatar'> 
                    <img class='img_' src='${logo}'>
                    <div id='info_' class='info'> 
                        <p class='channel'> ${data.channel.status} </p>  
                        <p class='host'> ${data.channel.display_name} </p>
                    </div>
                </div>
            </a>
        </li>`;
}

// i18n
function change_language(lang) {
    console.log('lang: ' + lang);
    index = 0;
    language = lang;
    refresh();
    appendData(language);
}

function refresh() {
    $('#content').empty();
}

function go_top() {
    $('html,body').animate({
        scrollTop: 0
    }, 1000);
}