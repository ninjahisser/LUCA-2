//HUE SHIFT MET FRAME COMPARISON

let mult = .5;
let frame_distance = 1;

let amplitude_now = thisComp.layer("Audio Amplitude").effect("Left Channel")("Slider")
let amplitude_before = thisComp.layer("Audio Amplitude").effect("Left Channel")("Slider").valueAtTime(time - framesToTime(frame_distance));

let difference = amplitude_now - amplitude_before;
let hueShift = difference * mult;

hsla = rgbToHsl(value);
hsla[0] = hueShift; //change this value, link it to a slider or whatever
hslToRgb(hsla);

// HUE SHIFT OP AMPLITUDE

let mult = .5;
let frame_duration = 100;

let snappedTime = Math.floor(timeToFrames(time) / frame_duration) * frame_duration;
snappedTime = framesToTime(snappedTime);

let amplitude = thisComp.layer("Audio Amplitude").effect("Left Channel")("Slider").valueAtTime(snappedTime);

let hueShift = (amplitude * mult)%1;

hsla = rgbToHsl(value);
hsla[0] = hueShift; //change this value, link it to a slider or whatever
hslToRgb(hsla);

// GET BPM

thisComp.layer("Globals").effect("BPM")("Slider");
