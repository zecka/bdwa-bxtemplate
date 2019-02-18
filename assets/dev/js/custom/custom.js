var sections = [];
var currentSection = 0;

$( document ).ready(function() {

    hamburgerInit();

    sectionInit();

    paginationInit();
    scrollNavigatorInit();
    
    var active = getActiveSection();
    setActiveSection(active);
});

$(document).on('scroll',function(){
    var active = getActiveSection();
    if(active !== currentSection){
        setActiveSection(active);
    }
})
function sectionInit(){
    var i = 0;
    $('section.block').each(function(){
        sections.push(this);
        var bullet = '<a class="pagination__bullet" href="javascript:void(0)" data-id="'+i+'"></a>';
        $(this).attr('data-id', i);
        $(bullet).appendTo('.pagination');
        i++;
    });
    sections.reverse();
}
function hamburgerInit(){
    $('.hamburger').on('click',function(){
        $('.hamburger__icon').toggleClass('active')
        $('.header').toggleClass('active')
    });
}
function paginationInit(){
    $('.pagination__bullet').on('click', function(){
        var id = $(this).data('id');
        var section = $('section.block[data-id="'+id+'"]').find('.block__item__content');
        var sectionTop = $(section).offset().top;

        $('body,html').stop().animate({scrollTop:(sectionTop - 120)}, 500, 'swing', function() { 
            //alert("Finished animating");
         });
    });
}
function scrollNavigatorInit(){
    $('.scroll-navigator__next').on('click', function(){
        var active = getActiveSection();
        console.log(active);
        id = $(active).data('id')
        if(id !== (sections.length - 1)){
            id=id+1;
            var section = $('section.block[data-id="'+id+'"]').find('.block__item__content');
            var sectionTop = $(section).offset().top;

            $('body,html').stop().animate({scrollTop:(sectionTop - 120)}, 500, 'swing', function() { 
                //alert("Finished animating");
            });
        }
    });

    $('.scroll-navigator__prev').on('click', function(){
        var active = getActiveSection();
        console.log(active);
        id = $(active).data('id')
        if(id !== 0){
            id=id-1;
            var section = $('section.block[data-id="'+id+'"]').find('.block__item__content');
            var sectionTop = $(section).offset().top;

            $('body,html').stop().animate({scrollTop:(sectionTop - 120)}, 500, 'swing', function() { 
                //alert("Finished animating");
            });
        }
    });
}
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

    return activeSection;

}

function setActiveSection(activeSection){
    var id = $(activeSection).data('id');
    $('.pagination__bullet').removeClass('active');
    $('.pagination__bullet[data-id="'+id+'"]').addClass('active');

}
