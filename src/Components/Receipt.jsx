import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Receipt.css';

const Receipt = () => {
  const location = useLocation();
  const data = location.state;
  const receiptRef = useRef();

  if (!data) return <p>No receipt data available.</p>;

  const {
    consultationId,
    name,
    consultingDept,
    consultingDoctor,
    date,
  } = data;
  

  const formattedDate = new Date(date).toLocaleDateString('en-IN');

  const downloadPDF = () => {
  const input = receiptRef.current;

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const signature = new Image();
      signature.src = '/signature.png';
      signature.onload = () => {
        pdf.addImage(signature, 'PNG', pdfWidth - 60, pdfHeight - 40, 50, 20); // bottom right
        pdf.save(`Receipt_${consultationId}.pdf`);
      };
  });
};


  return (
    <div className="receipt-wrapper">
      <div className="receipt-container" ref={receiptRef}>
        <h2>Consultation Receipt</h2>
        <div className="receipt-details">
          <p><strong>Consultation ID:</strong> {consultationId}</p>
          <p><strong>Patient Name:</strong> {name}</p>
          <p><strong>Consulting Department:</strong> {consultingDept}</p>
          <p><strong>Consulting Doctor:</strong> {consultingDoctor}</p>
          <p><strong>Consultation Date:</strong> {formattedDate}</p>
          <p><strong>Payment Status:</strong> ✅ PAID</p>
        </div>
      </div>

      <div className="receipt-buttons">
        <button onClick={() => window.print()}>🖨️ Print</button>
        <button onClick={downloadPDF}>📄 Download PDF</button>
      </div>
      <div className="signature-area">
    <img src="/signature.png" alt="Signature" className="signature-img" />
    <p className="stamp-text">Authorized Signature</p>
  </div>
    </div>
  );
};

export default Receipt;
