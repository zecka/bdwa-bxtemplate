var sections = [];
var currentSection = 0;

$( document ).ready(function() {

    $('.hamburger').on('click',function(){
        $('.hamburger__icon').toggleClass('active')
        $('.header').toggleClass('active')
    });
    
    var i = 0;
    $('section.block').each(function(){
        sections.push(this);
        var bullet = '<a class="pagination__bullet" href="javascript:void(0)" data-id="'+i+'"></a>';
        $(this).attr('data-id', i);
        $(bullet).appendTo('.pagination');
        i++;
    });
    sections.reverse();

    $('.pagination__bullet').on('click', function(){
        var id = $(this).data('id');
        var section = $('section.block[data-id="'+id+'"]').find('.block__item__content');
        var sectionTop = $(section).offset().top;

        $('body,html').stop().animate({scrollTop:(sectionTop - 120)}, 500, 'swing', function() { 
            //alert("Finished animating");
         });
    });
});

$(document).on('scroll',function(){
    var active = getActiveSection();
    if(active !== currentSection){
        setActiveSection(active);
    }
})

function getActiveSection(){
    var windowHeight = $(window).height();
    var scrollBottom = $(window).scrollTop() + windowHeight;

    var activeSection = sections.find(function(section){
        var sectionTop = $(section).offset().top;
        var sectionHeight = $(section).outerHeight();
        if(sectionHeight < windowHeight){
            // Probably on desktop
            var sectionActivePoint = sectionTop + (sectionHeight / 3 * 2); // 2 tiers de l'élément visible
        }else{
            // Probably on mobile or small height window ratio desktop
            var sectionActivePoint = sectionTop + (windowHeight / 2); // Visible sur la moitier de l'écran
        }

        return scrollBottom > sectionActivePoint;
    });
    if(typeof activeSection == 'undefined'){
        activeSection = sections[(sections.length - 1)];
    }
    console.log($(activeSection).data('id'))

    return activeSection;

}

function setActiveSection(activeSection){
    var id = $(activeSection).data('id');
    $('.pagination__bullet').removeClass('active');
    $('.pagination__bullet[data-id="'+id+'"]').addClass('active');

}
