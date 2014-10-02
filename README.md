PresenTS
========

A typescript presentation framework based on ImpressJS and Typescript


Usage
-----
```typescript
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

```
