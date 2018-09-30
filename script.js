const ACCESS_KEY = '6279a85963f0d03fea485ec1231e191844ae5d25356d2935069ff2388653b3ab';
const image_placeholder = 'https://images.unsplash.com/photo-1480441466293-f2a569736293';
$(document).ready(function initializer() {
  $('body').css('background-image',`url(${image_placeholder})`);
  setCurrentTime();
  setInterval(function(){
    setCurrentTime();
  }, 10 * 1000);

  const username = getCookie('username');

  if (username) {
    $('.greeting').css('display','inline-block');
    $('.user-name').css('display','none');
    const interest = getCookie('interest');
    
    if (interest) {
      $('.interest').css('display','none');
      $('.interest-text').html(interest);
      $('.greeting').html(`Hello <span class="stored-name">${username}</span>.`);
      let picture_url = getCookie('picture');
      const photo_by_name = getCookie('photo-by-name');
      const photo_by_url = getCookie('photo-by-url');
      if (!picture_url) {
        newimage(interest);
        picture_url = getCookie('picture');
      }
      $('.photoby').html(photo_by_name);
      $('.photoby').attr('href',photo_by_url);
      $('body').css('background-image',`url(${picture_url})`);
      $('.change-btn').css('display','block');
    } else {
      $('.greeting').html(`What's your interst?`);
      $('.interest').css('display','inline-block');
    }
  } else {
    $('.interest').css('display','none');
    $('.user-name').css('display','inline-block');
    $('.greeting').html(`What's your name?`);
    $('.greeting').css('display','inline-block');
  }
  $('.user-name').keypress(function(e) {
    if(e.which == 13) {
      var username = e.target.value;
      if(!username) return;
      $('.user-name').fadeOut(function(){
        $('.greeting').html(`What's your interest?`);
        $('.interest').css('display','inline-block');
        $('.greeting').fadeIn(function(){
          setCookie('username', username,365);
        });
      });
    }
  });
  $('.interest').keypress(function(e) {
    if(e.which == 13) {
      var interest = e.target.value;
      if(!interest) return;
      newimage(interest);
      var username = getCookie('username');
      $('.interest').fadeOut(function(){
        $('.greeting').html(`Hello ${username}.`);
        $('.greeting').fadeIn(function(){

          setCookie('interest', interest,365);
        });
      });
    }
  });

  $('.change-btn').click(function(){
    $('.greeting').html(`What's your interest?`);
    $('.interest').css('display','inline-block');
    $('.interest').focus();
  });
});

function setCurrentTime() {
  const now = new Date();
  $('.time').html(now.getHours()+":"+ (now.getMinutes()<10?'0':'') + now.getMinutes());
  $('.date').html(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
}

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function newimage(keyword){
  if(!ACCESS_KEY){
    alert("Please update your access key");
    return;
  }
  const url = `https://api.unsplash.com/search/photos?query=${keyword}&per_page=20&orientation=landscape&client_id=${ACCESS_KEY}`;
  $.get(url, function(data) {
    const picture = data.results[0];

    const picture_url = picture.urls.raw;
    const photo_by_name = picture.user.name;
    const photo_by_url = picture.user.links.html;
    setCookie("picture",picture_url,0.5);
    setCookie("photo-by-name",photo_by_name,0.5);
    setCookie("photo-by-url",photo_by_url,0.5);
    $('.interest-text').html(keyword);
    $('.photoby').html(photo_by_name);
    $('.photoby').attr('href',photo_by_url);
    $('body').css('background-image',`url(${picture_url})`);
    $('.change-btn').css('display','block');
  });
}