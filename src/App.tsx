import {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {scan, ScanResult} from 'qr-scanner-wechat'

const interval_ms = 100;

const App = () => {
    const webcamRef = useRef<null | Webcam>(null);
    const [currentQRCode, setCurrentQRCode] = useState('');
    useEffect(() => {
        const decode = async () => {
            const screenshot = webcamRef.current?.getCanvas();
            if (!screenshot) {
                await new Promise(resolve => setTimeout(resolve, interval_ms)).then(decode);
                return;
            }
            let result: undefined | ScanResult = undefined;
            try {
                const context = screenshot.getContext('2d');
                if (!context) {
                    alert('Failed to get 2d context');
                    throw "__";
                }
                result = await scan(context.getImageData(0, 0, screenshot.width, screenshot.height));
            } catch (e) {
                console.log(e);
            }
            if (result?.text) {
                setCurrentQRCode(result?.text);
            }
            await new Promise(resolve => setTimeout(resolve, interval_ms)).then(decode);
        }
        decode();
    }, []);

    useEffect(() => {
        if(currentQRCode && currentQRCode !== ''){
            console.log(currentQRCode);
            fetch(`/?code=${encodeURIComponent(currentQRCode)}`);
        }
        }, [currentQRCode]);
    return (
        <Webcam ref={webcamRef}/>
    );
}

export default App;