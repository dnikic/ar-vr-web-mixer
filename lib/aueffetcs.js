var delay = new Pizzicato.Effects.Delay({
    feedback: 0.6,
    time: 0.4,
    mix: 0.5
});



var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
    feedback: 0.6,
    time: 0.4,
    mix: 0.5
});

var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.6,
    time: 0.7,
    mix: 0.5,
    cutoff: 700
});

var distortion = new Pizzicato.Effects.Distortion({
    gain: 0.4
});

var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
    lowGain: 0.6,
    midLowGain: 0.8,
    midHighGain: 0.5,
    highGain: 0.6,
    mix: 1.0
});

var flanger = new Pizzicato.Effects.Flanger({
    time: 0.45,
    speed: 0.2,
    depth: 0.1,
    feedback: 0.1,
    mix: 0.5
});

var reverb = new Pizzicato.Effects.Reverb({
    time: 0.01,
    decay: 0.01,
    reverse: false,
    mix: 0.5
});

var tremolo = new Pizzicato.Effects.Tremolo({
    speed: 7,
    depth: 0.8,
    mix: 0.8
});

var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0.0
});

var compressor = new Pizzicato.Effects.Compressor({
    threshold: -24,
    ratio: 12
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 400,
    peak: 10
});

var highPassFilter = new Pizzicato.Effects.HighPassFilter({
    frequency: 10,
    peak: 10
});

var ringModulator = new Pizzicato.Effects.RingModulator({
    speed: 30,
    distortion: 1,
    mix: 0.5
});


                

