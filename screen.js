let info = document.getElementById('screen-info')

updateInfo()
addEventListener("resize", updateInfo);

function updateInfo() {
    let Wwidth = window.innerWidth;
    let Wheight = window.innerHeight;
    let Swidth = screen.width;
    let Sheigth = screen.height;
    let text = document.getElementById('screen-text');
    if (Wheight != 1080 || Wwidth != 1920) {
        if (Sheigth == 1080 && Swidth == 1920) {
            text.innerHTML =
                "Your screen will be this size when you enter full screen mode. <span style=\"color: aqua;\">Press F11</span>"

        } else if (Swidth == Wwidth && Sheigth == Wheight) {
            text.innerHTML =
                `Your screen has a size of ${Swidth} x ${Sheigth}px. This isn't optimal! <br>
                Display errors may occur in the presentation!`
        } else {
            text.innerHTML =
                `Your screen has in full screen mode a size of ${Swidth} x ${Sheigth}px and <br>
                        in this screen a size of ${Wwidth} x ${Wheight} px.This isn't optimal! <br>
                        Display errors may occur in the presentation!`
        }
        if (info.getAttribute('visible') == 'false') {
            info.setAttribute('visible', 'show')
            info.animate([
                { transform: "translateY(calc(-100% + 10px))" },
            ], {
                duration: 1000,
                iterations: 1,
                fill: 'forwards',
                easing: 'ease'
            })
        }
    } else {
        if (info.getAttribute('visible') == 'show') disapear_info()
    }
}

function disapear_info() {
    info.animate([
        { transform: "none" },
    ], {
        duration: 1000,
        iterations: 1,
        fill: 'forwards',
        easing: 'ease'
    }).onfinish = () => {
        info.setAttribute('visible', 'shown')
    };

}