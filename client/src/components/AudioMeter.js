import React, { useRef, useEffect } from 'react';

export default function AudioMeter() {
    let audioContext = useRef(null);
    let canvasContext = useRef(null);
    let canvasMeter = useRef(null);
    let meter = null;
    let rafID = null;
    var mediaStreamSource = null;
    let WIDTH = 400;
    let HEIGHT = 10;

    useEffect(() => {
        canvasMeter.current = canvasContext.current.getContext('2d');

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext.current = new AudioContext();

        try {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia(
                {
                    audio: {
                        mandatory: {
                            googEchoCancellation: 'false',
                            googAutoGainControl: 'false',
                            googNoiseSuppression: 'false',
                            googHighpassFilter: 'false',
                        },
                        optional: [],
                    },
                },
                gotStream,
                didntGetStream,
            );
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }

        function didntGetStream() {
            alert('Stream generation failed.');
        }
    });

    function gotStream(stream) {
        mediaStreamSource = audioContext.current.createMediaStreamSource(
            stream,
        );
        meter = createAudioMeter(audioContext.current);
        mediaStreamSource.connect(meter);

        drawLoop();
    }

    function drawLoop() {
        canvasMeter.current.clearRect(0, 0, WIDTH, HEIGHT);

        if (meter.checkClipping()) {
            canvasMeter.current.fillStyle = 'red';
        } else {
            canvasMeter.current.fillStyle = 'green';
        }

        canvasMeter.current.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

        rafID = window.requestAnimationFrame(drawLoop);
        return rafID;
    }

    function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
        var processor = audioContext.createScriptProcessor(256);

        processor.onaudioprocess = volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.95;
        processor.clipLag = clipLag || 750;

        processor.connect(audioContext.destination);

        processor.checkClipping = function () {
            if (!this.clipping) return false;
            if (this.lastClip + this.clipLag < window.performance.now())
                this.clipping = false;
            return this.clipping;
        };

        processor.shutdown = function () {
            this.disconnect();
            this.onaudioprocess = null;
        };

        return processor;
    }

    function volumeAudioProcess(event) {
        const buf = event.inputBuffer.getChannelData(0);
        let bufLength = buf.length;
        let sum = 0;
        let x;

        for (let i = 0; i < bufLength; i++) {
            x = buf[i];
            if (Math.abs(x) >= this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }
            sum += x * x;
        }

        let rms = Math.sqrt(sum / bufLength);
        this.volume = Math.max(rms, this.volume * this.averaging);
    }

    return (
        <div>
            <canvas
                className="audio-indicator"
                id="meter"
                height="10"
                ref={canvasContext}
            ></canvas>
        </div>
    );
}
