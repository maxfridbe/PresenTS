interface ITransform {
    Translate?: I3DValue;
    Rotate?: I3DValue;
    Scale?: number;
}
interface I3DValue {
    X: number;
    Y: number;
    Z: number;
}

module Transform {
    export function rotateZ(deg: number): string {
        return "rotateZ( " + deg + "deg) ";
    }
    export function rotateX(deg: number): string {
        return "rotateX( " + deg + "deg) ";
    }
    export function rotateY(deg: number): string {
        return "rotateY( " + deg + "deg) ";
    }
    export function translate3d(val: I3DValue): string {
        return "translate3d("
            + val.X + "px,"
            + val.Y + "px,"
            + val.Z + "px) ";
    }
    export function perspective(px: number): string {
        return "perspective(" + px + "px) ";
    }
    export function scale(scale: number) {
        return "scale( " + scale + ") ";
    }
}

module Utilities {
    export function GetText(path: string, callback: (string) => void) {
        var r = new XMLHttpRequest();
        r.open("GET", path, true);
        r.onreadystatechange = () => {
            if (r.readyState != 4 || r.status != 200) return;
            callback(r.responseText);
        };
        r.send();
    }
    export function Extend(defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }
}

class Slide {
    DisplayElement: HTMLDivElement;
    constructor(url, location: ITransform) {
        this.DisplayElement = document.createElement("div");
        this.DisplayElement.className = "presents-slide";
        this.CurrentState = Utilities.Extend(this.CurrentState, location);
        Utilities.GetText(url, (res) => {
            this.DisplayElement.innerHTML = res;
        });
        this.Position();
        this.FadeOut();
    }
    public CurrentState: ITransform = {
        Translate: { X: 0, Y: 0, Z: 0 },
        Rotate: { X: 0, Y: 0, Z: 0 },
        Scale: 1
    };
    FadeIn() {
        this.DisplayElement.style.opacity = "1";
    }
    FadeOut() {
        this.DisplayElement.style.opacity = ".3";
    }
    Position() {
        var state = this.CurrentState;
        var val = "translate(-50%, -50%) "
            + Transform.translate3d(state.Translate)
            + Transform.rotateX(state.Rotate.X)
            + Transform.rotateY(state.Rotate.Y)
            + Transform.rotateZ(state.Rotate.Z)
        + Transform.scale(state.Scale)
        ;

        this.DisplayElement.style.transform = val;

    }
}

class PresenTS {
    constructor(elem: HTMLElement, private zoomedOutScale: number = 1, private zoomBleed: number = .1) {
        this._hostingElement = elem;
        this._cameraElement = document.createElement("div");
        this._cameraElement.className = "camera";
        this._cameraElement.style.transformStyle = "preserve-3d";
        this._hostingElement.appendChild(this._cameraElement);
        this.resetView();
    }
    private _hostingElement: HTMLElement;
    private _cameraElement: HTMLElement;
    private _slides: Slide[] = [];
    public slideIdx = -1;

    private resetView() {
        this.SetCamera({
            Translate: { X: 0, Y: 0, Z: 0 },
            Rotate: { X: 0, Y: 0, Z: 0 },
            Scale: 1
        });
        this.SetView();
        this.slideIdx = -1;
    }

    private SetCamera(state: ITransform) {
        var val =
            Transform.rotateZ(state.Rotate.Z)
            + Transform.rotateY(state.Rotate.Y)
            + Transform.rotateX(state.Rotate.X)
            + Transform.translate3d(state.Translate)
        ;
        this._cameraElement.style.transform = val;
    }
    private SetView(scale= this.zoomedOutScale, perspective = 1000) {
        this._hostingElement.style.transform = Transform.scale(scale)
        + Transform.perspective(perspective);
    }
    private computeWindowScale(displaySlide: Slide) {
        var el = displaySlide.DisplayElement;
        var slideScale = displaySlide.CurrentState.Scale;

        var slide = el.children[0];
        var hScale = window.innerHeight / slide.clientHeight,
            wScale = window.innerWidth / slide.clientWidth,
            scale = hScale > wScale ? wScale : hScale;

        return (scale - scale * this.zoomBleed)/slideScale;
    }


    AddSlide(slide: Slide) {
        this._slides.push(slide);
        this._cameraElement.appendChild(slide.DisplayElement);
    }
    LookatNextSlide() {
        if (this._slides.length <= this.slideIdx + 1) {
            this.LookatAll();
            return;
        }
        this.LookatSlide(this.slideIdx + 1);
    }

    LookatPrevSlide() {
        if (this.slideIdx == 0) {
            this.LookatAll();
            return;
        }
        this.LookatSlide(this.slideIdx - 1);
    }
    LookatAll() {
        if (this.slideIdx >= 0)
            this._slides[this.slideIdx].FadeOut();
        this.resetView();
    }
    LookatSlide(idx: number) {
        if (this.slideIdx >= 0)
            this._slides[this.slideIdx].FadeOut();

        this.slideIdx = idx;
        var currentSlide = this._slides[this.slideIdx];
        var st = currentSlide.CurrentState;
        var scale = this.computeWindowScale(currentSlide);
        var newState: ITransform = {
            Translate: { X: -st.Translate.X, Y: -st.Translate.Y, Z: -st.Translate.Z },
            Rotate: { X: -st.Rotate.X, Y: -st.Rotate.Y, Z: -st.Rotate.Z },
            // Scale: 1
        };
        this.SetView(scale);
        this.SetCamera(newState);
        this._slides[this.slideIdx].FadeIn();
    }

    LookatFirstSlide() {
        this.LookatSlide(0);
    }

    LookatLastSlide() {
        this.LookatSlide(this._slides.length - 1);
    }
}




window.onload = () => {
    var slides: Slide[] = [
        new Slide("slides/examplewide.htm", { Translate: { X: -100, Y: -600, Z: 100 }, Rotate: { X: -60, Y: 0, Z: 0 }, Scale: 2 }),
        new Slide("slides/example.htm", { Translate: { X: 0, Y: 0, Z: 0 } }),
        new Slide("slides/example2.htm", { Translate: { X: 200, Y: 0, Z: 0 }, Rotate: { X: 0, Y: 0, Z: -90 } }),
        new Slide("slides/examplewide.htm", { Translate: { X: 100, Y: -200, Z: 0 }, Rotate: { X: 0, Y: 0, Z: -180 } }),
        new Slide("slides/examplewide.htm", { Translate: { X: -200, Y: -100, Z: 0 }, Rotate: { X: 0, Y: 0, Z: -270 } }),
        new Slide("slides/exampleBigger.htm", { Translate: { X: -100, Y: 300, Z: 0 }, Rotate: { X: 0, Y: 0, Z: 0 } }),
        new Slide("slides/exampleBigger.htm", { Translate: { X: 300, Y: 300, Z: 0 }, Rotate: { X: 0, Y: 0, Z: -90 } }),
        new Slide("slides/example4.htm", { Translate: { X: -400, Y: -200, Z: 100 }, Rotate: { X: 0, Y: 60, Z: 0 } }),
        new Slide("slides/example4.htm", { Translate: { X: -450, Y: 0, Z: 100 }, Rotate: { X: 0, Y: 60, Z: 0 } }),
        new Slide("slides/example4.htm", { Translate: { X: -500, Y: 200, Z: 100 }, Rotate: { X: 0, Y: 60, Z: 0 } }),
        new Slide("slides/example4.htm", { Translate: { X: -550, Y: 400, Z: 100 }, Rotate: { X: 0, Y: 60, Z: 0 } }),
        new Slide("slides/examplewide.htm", { Translate: { X: -100, Y: 600, Z: 100 }, Rotate: { X: 60, Y: 0, Z: 0 } }),
    ];

    var el = document.getElementById('content');
    var presentation = new PresenTS(el, .7);
    slides.forEach(s => { presentation.AddSlide(s); });



    window.onkeydown = (ev: KeyboardEvent) => {
        if (ev.keyCode == 27) {//esc = 27
            presentation.LookatAll();
        }
        if (ev.keyCode == 39) {//right = 39
            if (presentation.slideIdx >= 0) {
                presentation.LookatNextSlide();
            } else {
                presentation.LookatFirstSlide();
            }
            ev.preventDefault();
        }
        if (ev.keyCode == 37) {//left = 37
            if (presentation.slideIdx < 0) {
                presentation.LookatLastSlide();
            } else {
                presentation.LookatPrevSlide();
            }

            ev.preventDefault();
        }
    };
};
