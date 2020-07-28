import React, { useRef, useEffect } from 'react';

const AudioBigMeter = ({ userStream }) => {
    const bigMeter = useRef();

    useEffect(() => {
        let meterItem = null;
        let myElements = null;
        let num = 32;
        let array = new Uint8Array(num * 2);
        let width = 10;
        let context, analyser;

        if (context) return;

        for (let i = 0; i < num; i++) {
            meterItem = document.createElement('div');
            meterItem.className = 'line-meter';
            meterItem.style.background = '#426e92';
            meterItem.style.minWidth = width + 'px';
            meterItem.style.display = 'none';
            bigMeter.current.appendChild(meterItem);
        }

        context = new AudioContext();
        analyser = context.createAnalyser();

        try {
            if (userStream) {
                let src = context.createMediaStreamSource(userStream);
                src.connect(analyser);
            }
            loop();
        } catch (error) {
            alert(error + '\r\n Отклонено. Страница будет обновлена!');
        }

        function loop() {
            myElements = document.getElementsByClassName('line-meter');
            if (myElements.length > 0) {
                window.requestAnimationFrame(loop);
                analyser.getByteFrequencyData(array);
                for (var i = 0; i < num; i++) {
                    let height = array[i + num];
                    myElements[i].style.minHeight = height + 'px';
                    myElements[i].style.opacity = 0.008 * height;
                    myElements[i].style.display = 'block';
                    if (myElements[i].getBoundingClientRect().height > 100) {
                        myElements[i].style.backgroundColor = '#a1c7e6';
                    } else {
                        myElements[i].style.backgroundColor = '#426e92';
                    }
                }
            } else {
                return false;
            }
        }
    }, [userStream]);

    return <div className="big-meter" ref={bigMeter}></div>;
};

export default AudioBigMeter;
