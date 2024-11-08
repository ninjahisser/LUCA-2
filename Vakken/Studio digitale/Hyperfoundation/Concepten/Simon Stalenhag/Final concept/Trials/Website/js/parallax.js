
const pos = { x : 0, y : 0 };

const saveCursorPosition = function(x, y) {
    pos.x = (x / window.innerWidth).toFixed(100) - 50;
    pos.y = (y / window.innerHeight).toFixed(100) - 50;
    document.documentElement.style.setProperty('--cursorX', pos.x);
    document.documentElement.style.setProperty('--cursorY', pos.y);
    console.log(pos.x);
}

document.addEventListener('mousemove', e => { saveCursorPosition(e.clientX, e.clientY); })
