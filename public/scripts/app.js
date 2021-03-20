//Variables setup
const dpi = "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)";
let dataCache;
var animImg;
var animText;
let body = $('body');
let width;
let checkAudio = false;
let dataPage = body.attr('data-page');
let play = false;
let infoData;

//Audio setup
let jazzAudio = $('#audio-1');
let vodkaAudio = $('#audio-2');
let barAudio = $('#audio-3');
let paperAudio = $('#audio-4');
let policeAudio = $('#audio-5');
let iceAudio = $('#audio-6');
let explosionAudio = $('#audio-7');
let gunAudio = $('#audio-8');
let shakerAudio = $('#audio-9');
let cocktailAudio = $('#audio-10');
let stirAudio = $('#audio-11');
let partyAudio = $('#audio-12');


$(document).ready(function () {
    width = $(window).width();

    scrollDesktop();
    getTweens();

    //Enlever le loader et initialiser les volumes de base
    setTimeout(function () {
        $('body').attr('data-load', 'false');

        jazzAudio.prop('volume', 0.05);
        barAudio.prop('volume', 0.1);
    }, 1500);

    // Réglages boutton next chapitre responsive
    if (width > 1025) {
        $('.nav__list').hover(function () {
            body.attr('data-desknav', 'true');
        })
        $('.btn--next').click(function () {
            let data = $(this).attr('data-chapitre');

            if (data == 'study') {
                //Ouvrir le case-study
                openPage('case-study/');
            } else {
                //Ouvrir le chapitre suivant
                nextChapitre(data, width);
            }
        });

        $('.nav__content').removeClass('nav__content--active');
    } else {
        $('.next__content').click(function () {
            let data = $(this).attr('data-chapitre');
            if (data == 'study') {
                //Ouvrir le case-study
                openPage('case-study/');
            } else {
                //Ouvrir lechapitre suivant
                nextChapitre(data, width);
            }
        });
    }

    //Boutton play music
    $('.btn--music').click(function (e) {
        e.preventDefault();

        if (play == true) {
            //Si la musique joue, mettre en pause
            jazzAudio.trigger('pause');
            barAudio.trigger('pause');

            $('#music').html('OFF');
            play = false;

            getMusic();
        } else {
            //Si la musique ne joue pas, jouer
            let chapitre = '.chapitre--' + $('body').attr('data-chapitre');
            let dataActif = $(chapitre).attr('data-actif');

            jazzAudio.trigger('play');
            barAudio.trigger('play');

            $('#music').html('ON');
            play = true;

            //Avoir la bonne musique
            getMusic(dataActif);
        }
    })

    //Page != side project et desktop
    if (dataPage != 'side' && width > 1025) {
        body.attr('data-desknav', 'true');

        //Scroll bar sur les autres pages
        $(window).scroll(function (event) {
            let scroll = $(window).scrollTop();
            let scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
            scrollPercent = Math.round(scrollPercent);
            scrollPercent += '%';

            $('.nav__bar').height(scrollPercent);
        });
    } else if (dataPage != 'side') {
        scrollTop('.chapitre--aside', 750);
    } else {
        $.getJSON('assets/scripts/data.json', function (data) {
            dataCache = data;
        });
    }

    // Mise en place des élèments au premier chargement
    $('.addon--message').on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
        body.removeClass('overflow');
        $('.addon--message').css('display', 'none');

        $('.chapitre').css('position', 'relative');
        $('.chapitre--intro').removeClass('block');
    });

    // Animation Menu + Changement de page via le menu
    $('.btn--nav').click((e) => {
        e.preventDefault();

        let chapitre = '.chapitre--' + body.attr('data-chapitre');

        if (body.attr('data-nav') == 'false') {
            body.attr('data-nav', 'true');

            $(chapitre).attr('data-animation', 'closeSlideRight');
            $('.addon--nav').attr('data-animation', 'comeSlideLeft');

        } else {

            $(chapitre).attr('data-animation', 'comeSlideRight');
            $('.addon--nav').attr('data-animation', 'closeSlideLeft');
            $(chapitre).css('position', 'absolute');

            body.attr('data-nav', 'false');
        }
    });

    // Navigation mobile
    $('.nav__content').click(function () {
        let data = $(this).attr('data-chapitre');

        if (dataPage != 'side') {
            if (data == 'tfa') {
                data = '../';
                openPage(data);
            } else {
                data = '../' + data + '/';
                openPage(data);
            }
        } else {
            let nav = this;
            let chapitreNext = '.chapitre--' + data;

            $(chapitreNext).attr('data-animation', 'comeSlideRight');
            $('.addon--nav').attr('data-animation', 'closeSlideLeft');

            body.attr('data-nav', 'false');
            body.attr('data-chapitre', $(this).attr('data-chapitre'));

            getMusic('1');

            $(chapitreNext).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                $('.nav__content').removeClass('nav__content--active');
                $(chapitreNext).css('position', 'relative');
                $(nav).addClass('nav__content--active');
            });
        }

    });

    // Scroll via boutton
    $('.btn--scroll').on('click', function () {
        width = $(window).width();
        let cible = '#' + $(this).attr('data-scroll');


        if (width > 1025) {
            let chapitre = '.chapitre--' + body.attr('data-chapitre');
            let numberBlock = $(chapitre).attr('data-count');
            let bar = (1 / (numberBlock - 1)) * 100;

            body.attr('data-desknav', 'true');
            $(chapitre).attr('data-actif', '2');
            bar += '%';

            $('.nav__bar').animate({
                height: bar
            }, 750);
        }

        scrollTop(cible, 750);
    });

    // Ouverture et ajout des données pour les informations
    $('.link--info').click(function (e) {
        e.preventDefault();
        infoData = 'info';

        let code = $(this).attr('href').slice(1);
        let info = dataCache[code];

        if (matchMedia(dpi).matches) {
            $('.info__background').css('background-image', `url(assets/images/base/${info.imgHigh})`);
        } else {
            $('.info__background').css('background-image', `url(assets/images/base/${info.img})`);
        }

        $('.info__sub--text').html(info.alt);
        $('.info__title').html(info.title);
        $('.info__text').html('');

        $.each(info.text, function (i, el) {
            let p = $('<p>').html(el);
            $('.info__text').append(p);
        })


        openInfo('info');
    });

    // Ouverture et ajout des données pour les recettes
    $('.link--recette').click(function (e) {
        e.preventDefault();
        infoData = 'recette';

        let code = $(this).attr('href').slice(1);
        let info = dataCache[code];

        $('.recette__link').removeClass('recette__link--active');
        $('.recette__link--histoire').addClass('recette__link--active');

        $('.recette').removeClass('recette--active');
        $('.recette__histoire').addClass('recette--active');



        if (matchMedia(dpi).matches) {
            $('.recette__background').css('background-image', `url(assets/images/base/${info.imgHigh})`);
        } else {
            $('.recette__background').css('background-image', `url(assets/images/base/${info.img})`);
        }

        $('.recette__title').html(info.title);
        $('.recette__ingredients').html('');
        $('.recette__etapes').html('');

        $.each(info.ingredients, function (i, el) {
            let li = $('<li>').html(el);
            $('.recette__ingredients').append(li);
        });

        $.each(info.etapes, function (j, etape) {
            let li = $('<li>').addClass('recette__el');
            let div = $('<div>').addClass('recette__content');

            let h3 = $('<h3>').html(`Étape ${j+1}`);
            let p = $('<p>').html(etape);

            div.append(h3);
            div.append(p);

            li.append(div);

            $('.recette__etapes').append(li);
        });

        $('.recette__histoire').html('');

        $.each(info.histoire, function (k, his) {
            let p = $('<p>').html(his);
            $('.recette__histoire').append(p);
        });

        openInfo('recette');

        //Navigation de l'addon recette
        $('.recette__link').click(function (e) {
            e.preventDefault();

            let open = '.recette__' + $(this).attr('href').slice(1);

            $('.recette__link').removeClass('recette__link--active');
            $(this).addClass('recette__link--active');

            $('.recette').removeClass('recette--active');
            $(open).addClass('recette--active');
        })

    });

    // Fermeture des addons
    $('.btn--info').click(function () {
        width = $(window).width();

        let chapitre = '.chapitre--' + body.attr('data-chapitre');
        let addon = '.addon--' + $(this).attr('data-addon');

        closeInfo(addon, chapitre, width);
    });

    // Animation menu desktop
    $('.nav__dots').hover(
        function () {
            $(this).prev().addClass('nav__content--active');
        },
        function () {
            $('.nav__content').removeClass('nav__content--active');
        }
    );

    // Navigation desktop
    $('.nav__dots').click(function () {
        let data = $(this).prev().attr('data-chapitre');

        if (dataPage != 'side') {
            if (data == 'tfa') {
                data = '../';
                openPage(data);
            } else {
                data = '../' + data + '/';
                openPage(data);
            }
        } else {
            let chapitreNext = '.chapitre--' + data;
            let chapitre = '.chapitre--' + $('body').attr('data-chapitre');
            let dots = $(this);

            body.attr('data-load', 'true');

            $(chapitreNext).attr('data-animation', '');

            setTimeout(function () {
                body.attr('data-chapitre', data);

                scrollTop(chapitreNext, 0);

                $(chapitreNext).attr('data-actif', '1');
                $(chapitre).attr('data-actif', '1');

                body.attr('data-desknav', 'false');

                $('.nav__dots').removeClass('nav__dots--active');
                $('.nav__content').removeClass('nav__content--active');

                dots.addClass('nav__dots--active');

                $('.nav__bar').height('0%');
            }, 300);

            setTimeout(function () {
                body.attr('data-load', 'false');
                getMusic('1');
            }, 1500);
        }

    });

    // Retour à la première page en desktop
    $('.nav__home').click(function (e) {
        e.preventDefault();

        let chapitreHome = $('.chapitre--intro');
        let chapitreData = $('body').attr('data-chapitre');

        if (chapitreData == 'aside') {
            openPage('../');
        } else {

            body.attr('data-load', 'true');
            $(chapitreHome).attr('data-animation', '');


            $('.nav__dots').removeClass('nav__dots--active');
            $('.nav__content[data-chapitre="intro"] + .nav__dots').addClass('nav__dots--active');

            setTimeout(function () {
                body.attr('data-chapitre', 'intro');
                chapitreHome.attr('data-actif', '1');

                scrollTop(chapitreHome, 0);

                body.attr('data-desknav', 'false');
            }, 300);

            setTimeout(function () {
                body.attr('data-load', 'false');
                getMusic('1');
            }, 1500);

        }
    });

    //Click nouvelle page
    $('.more__link, .nav__link').click(function (e) {
        e.preventDefault();

        openPage($(this).attr('href'));
    })
});

$(window).resize(function () {
    width = $(window).width();

    let actifChapitre = '.chapitre--' + body.attr('data-chapitre');
    let actifBlock = $(actifChapitre).attr('data-actif');

    if (width > 1025) {
        if (dataPage != 'side' && width > 1025) {
            body.attr('data-desknav', 'true');
        } else {
            scrollTop(`${actifChapitre} > .box[data-block="${actifBlock}"]`, 100);

            $('.nav__content').removeClass('nav__content--active');

            if ($(actifChapitre).attr('data-actif') != 1) {
                $('body').attr('data-desknav', 'true');
            }
        }
    } else {
        getMusic('0');

        $('body').attr('data-desknav', 'false');

        $('.box__background').css('transform', 'none');
        $('.box__content').css('transform', 'none');
    }

    scrollDesktop();
    getTweens();

});

// Changement de chapitre - Remise à zéro pour chaque chapitre en desktop
function nextChapitre(data, width) {
    let chapitreNext = '.chapitre--' + data;

    body.attr('data-load', 'true');
    $(chapitreNext).attr('data-animation', '');


    if (width > 1025) {

        $('.nav__dots').removeClass('nav__dots--active');
        $(`.nav__content[data-chapitre="${data}"] + .nav__dots`).addClass('nav__dots--active');

        body.attr('data-desknav', 'false');

        $(chapitreNext).attr('data-actif', '1');

        $('.nav__bar').height('0%');

    } else {
        $('.nav__content').removeClass('nav__content--active');
        $(`.nav__content[data-chapitre="${data}"]`).addClass('nav__content--active');
    }

    setTimeout(function () {
        body.attr('data-chapitre', data);

        scrollTop(chapitreNext, 0);
    }, 300)

    setTimeout(function () {
        body.attr('data-load', 'false');
        getMusic('1');
    }, 1500);
}

// Fonction pour ouvrir les addons
function openInfo(id) {
    let chapitre = '.chapitre--' + body.attr('data-chapitre');
    let addon = '.addon--' + id;

    width = $(window).width();

    $(addon).scrollTop(0);

    if (id == 'recette') {
        getMusic('10');
    } else {
        getMusic('9');
    }

    $('.box').click(function () {
        if (width > 1025) {
            if (body.attr('data-info') == 'true') {
                let chapitre = '.chapitre--' + body.attr('data-chapitre');
                let addon = '.addon--' + infoData;

                closeInfo(addon, chapitre, width);
            }
        }
    });

    setTimeout(function () {
        body.attr('data-info', 'true');
    }, 350)

    if (width < 1025) {
        $(chapitre).attr('data-animation', 'closeSlideLeft');
        $(addon).attr('data-animation', 'comeSlideRight');
    } else {
        $(chapitre).attr('data-animation', 'closeSlideLeftDesktop');
        $(addon).attr('data-animation', 'comeSlideRight');
    }
}

// Fonction pour fermer les addons
function closeInfo(addon, chapitre, width) {
    body.attr('data-info', 'false');

    if (width < 1025) {
        $(addon).attr('data-animation', 'closeSlideRight');
        $(chapitre).attr('data-animation', 'comeSlideLeft');
    } else {
        $(addon).attr('data-animation', 'closeSlideRight');
        $(chapitre).attr('data-animation', 'comeSlideLeftDesktop');
    }
}

//Fonction nouvelle page credits, etc.
function openPage(id) {
    window.location.href = id;
}

function scrollTop(cible, time) {
    $('html, body').animate({
        scrollTop: $(cible).offset().top
    }, time);
}

//Fonction de scroll sur desktop
function scrollDesktop() {
    $(document).on('DOMMouseScroll mousewheel', function (event) {
        width = $(window).width();

        let actifChapitre = '.chapitre--' + body.attr('data-chapitre');
        let chapitreNext = '.chapitre--' + $(actifChapitre).attr('data-next');
        let previousChapitre = '.chapitre--' + $(actifChapitre).attr('data-previous');

        let numberBlock = parseInt($(actifChapitre).attr('data-count'));
        let blockActif = parseInt($(actifChapitre).attr('data-actif'));
        let previous = $(actifChapitre).attr('data-previous');
        let nextData = $(actifChapitre).attr('data-next');

        let scrollBody = body.attr('data-scroll');

        let bar;

        if (width > 1025 && body.attr('data-info') == 'false' && body.attr('data-page') == 'side') {
            if (scrollBody == 'active' && !body.hasClass('overflow')) {
                //Scroll Down
                if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
                    if (blockActif == numberBlock) {
                        if (actifChapitre == '.chapitre--jours') {
                            openPage('case-study/')
                        } else {
                            body.attr('data-load', 'true');
                            $(chapitreNext).attr('data-animation', '');

                            body.attr('data-scroll', 'inactive');

                            setTimeout(function () {
                                body.attr('data-chapitre', nextData);
                                body.attr('data-desknav', 'false');
                                $('.nav__dots').removeClass('nav__dots--active');
                                $(`.nav__content[data-chapitre="${nextData}"] + .nav__dots`).addClass('nav__dots--active');

                                scrollTop(chapitreNext, 0);

                                $('.nav__bar').height('0%');
                                getMusic('1');
                            }, 300);

                            setTimeout(function () {
                                body.attr('data-load', 'false');
                                body.attr('data-scroll', 'active');
                            }, 1500);
                        }
                    } else {
                        body.attr('data-scroll', 'inactive');

                        blockActif++;

                        if (blockActif != 1) {
                            body.attr('data-desknav', 'true');
                        }

                        bar = ((blockActif - 1) / (numberBlock - 1)) * 100;
                        bar += '%';

                        scrollTop(`${actifChapitre} > .box[data-block="${blockActif}"]`, 750);

                        $('.nav__bar').animate({
                            height: bar
                        }, 750);

                        $(actifChapitre).attr('data-actif', blockActif);


                        setTimeout(function () {
                            body.attr('data-scroll', 'active');
                        }, 1500);

                        getMusic(blockActif);

                    }

                    //Scroll top
                } else {
                    blockActif--;

                    if (blockActif == 0) {
                        if (actifChapitre == '.chapitre--intro') {
                            return;
                        } else {
                            let previous = $(actifChapitre).attr('data-previous');
                            numberBlock = $(previousChapitre).attr('data-count');

                            body.attr('data-load', 'true');
                            $(previousChapitre).attr('data-animation', '');

                            $('.nav__dots').removeClass('nav__dots--active');
                            $(`.nav__content[data-chapitre="${previous}"] + .nav__dots`).addClass('nav__dots--active');

                            body.attr('data-scroll', 'inactive');

                            setTimeout(function () {
                                body.attr('data-chapitre', previous);
                                body.attr('data-desknav', 'true');

                                scrollTop(`${previousChapitre} > .box[data-block="${numberBlock}"]`, 0);

                                $(actifChapitre).attr('data-actif', '1');
                                $(previousChapitre).attr('data-actif', numberBlock);

                                $('.nav__bar').height('100%');

                                getMusic('1');
                            }, 300);

                            setTimeout(function () {
                                body.attr('data-load', 'false');
                                body.attr('data-scroll', 'active');
                            }, 1500);
                        }
                    } else {

                        bar = ((blockActif - 1) / (numberBlock - 1)) * 100;
                        bar += '%';

                        body.attr('data-scroll', 'inactive');

                        if (blockActif == 1) {
                            body.attr('data-desknav', 'false');
                        }

                        scrollTop(`${actifChapitre} > .box[data-block="${blockActif}"]`, 750);

                        $('.nav__bar').animate({
                            height: bar
                        }, 750);

                        setTimeout(function () {
                            body.attr('data-scroll', 'active');
                        }, 1500);

                        $(actifChapitre).attr('data-actif', blockActif);

                        getMusic(blockActif);
                    }
                }
            }
        }
    });
}

// Effet en desktop
function getTweens() {
    width = $(window).width();

    let request = null;
    let mouse = {
        x: 0,
        y: 0
    };
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    $('.box').mousemove(function (event) {
        if (width > 1025) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
            cancelAnimationFrame(request);
            request = requestAnimationFrame(update);
        }
    });

    function update() {
        dx = (mouse.x - cx) / 2;
        dy = (mouse.y - cy) / 2;
        let tiltx = (dy / cy);
        let tilty = -(dx / cx);

        animImg = TweenMax.to(".box__background", 1, {
            x: tilty * 20,
            y: tiltx * 20,
            rotation: 0.01,
            ease: Power1.easeOut
        });
        animImg.duration(2);
        animText = TweenMax.to(".box__content:not(.box__content--next)", 1, {
            x: -tilty * 15,
            y: -tiltx * 15,
            rotation: 0.01,
            ease: Power2.easeOut
        });
        animText.duration(2);
    }
}

function getMusic(actif) {

    let total = [vodkaAudio, policeAudio, explosionAudio, gunAudio, stirAudio, partyAudio];

    let chapitre = $('body').attr('data-chapitre');

    if (play == true) {
        if (chapitre == 'prohibition' && actif == '2') {
            policeAudio.trigger('play');
            policeAudio.prop('volume', 0.3);
        } else if (chapitre == 'prohibition' && actif == '4') {
            gunAudio.trigger('play');
            gunAudio.prop('volume', 0.3);

            explosionAudio.trigger('play');
            explosionAudio.prop('volume', 0.3);

            barAudio.trigger('pause');
            jazzAudio.trigger('pause');

            checkAudio = true;
        } else if (chapitre == 'souffle' && actif == '3') {
            stirAudio.animate({
                volume: 0
            }, 100, function () {
                stirAudio.trigger('pause');
            });

            vodkaAudio.trigger('play');
            vodkaAudio.prop('volume', 0.05);

            barAudio.trigger('pause');
            jazzAudio.trigger('pause');

            checkAudio = true;
        } else if (chapitre == 'souffle' && actif == '4') {
            vodkaAudio.animate({
                volume: 0
            }, 100, function () {
                vodkaAudio.trigger('pause');
            });

            barAudio.trigger('play');
            jazzAudio.trigger('play');

            stirAudio.trigger('play');
            stirAudio.prop('volume', 0.1);
        } else if (chapitre == 'jours') {

            if (actif == '5') {

                shakerAudio.trigger('play');
                shakerAudio.prop('volume', 0.1);

                setTimeout(function () {
                    shakerAudio.trigger('pause');
                    cocktailAudio.trigger('play');
                    cocktailAudio.prop('volume', 0.4);
                }, 2000);
            }

            partyAudio.trigger('play');
            partyAudio.prop('volume', 0.05);

            barAudio.trigger('pause');
            jazzAudio.trigger('pause');

            checkAudio = true;
        } else {
            if (actif == '10') {
                iceAudio.trigger('play');
                iceAudio.prop('volume', 0.5);
            } else if (actif == '9') {
                paperAudio.trigger('play');
                paperAudio.prop('volume', 0.5);
            } else {
                $.each(total, function (i, j) {
                    j.animate({
                        volume: 0
                    }, 1000, function () {
                        j.trigger('pause');
                    });
                });

                if (checkAudio == true) {
                    barAudio.trigger('play');
                    jazzAudio.trigger('play');
                    checkAudio = false;
                }
            }
        }

    } else {
        $.each(total, function (i, j) {
            j.trigger('pause');
        });
    }
}

//# sourceMappingURL=app.js.map
