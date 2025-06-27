import React from "react";
<<<<<<< HEAD
import { FaDownload } from "react-icons/fa";
import QRCode from "react-qr-code";


=======
import QRCode from "react-qr-code";

>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
const QRCodePreview = ({ itemNumber, price, size }) => {
    if (!itemNumber || !price || !size) return null;

    const qrValue = `Item Number: ${itemNumber}, Price: ${price}, Size: ${size} `;

    const handleDownload = () => {
        const svg = document.querySelector("#qr-code svg");
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svg)], {
            type: "image/svg+xml",
        });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "product-qr.svg";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
<<<<<<< HEAD
        <div className="broder text-center flex">
            <div id="qr-code" className=" rounded p-2 bg-white ">
                <QRCode value={qrValue} className="w-20 h-20" />
            </div>
            <button
                onClick={handleDownload}
                className=""
            >
                <FaDownload />
=======
        <div className="mt-4 text-center">
            {/* <h3 className="font-semibold mb-2">QR Code Preview</h3> */}
            <div id="qr-code" className="inline-block border rounded p-2 bg-white">
                <QRCode value={qrValue} />
            </div>
            <button
                onClick={handleDownload}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
                Download QR Code
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
            </button>
        </div>
    );
};

export default QRCodePreview;