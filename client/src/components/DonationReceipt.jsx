import { FiDownload, FiPrinter, FiCheck, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Generate receipt HTML for PDF
const generateReceiptHTML = (donation, charity, donor) => {
  const receiptNumber = `DM-${donation._id?.slice(-8).toUpperCase() || 'XXXXXXXX'}`;
  const date = new Date(donation.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Donation Receipt - ${receiptNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8fafc;
          padding: 40px;
        }
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 32px;
          text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 8px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          margin-top: 12px;
        }
        .content { padding: 32px; }
        .receipt-number {
          text-align: center;
          padding: 16px;
          background: #f1f5f9;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .receipt-number span {
          font-size: 12px;
          color: #64748b;
          display: block;
        }
        .receipt-number strong {
          font-size: 20px;
          color: #1e293b;
          letter-spacing: 2px;
        }
        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .detail-group h3 {
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .detail-group p {
          color: #1e293b;
          font-size: 16px;
        }
        .amount-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 32px;
        }
        .amount-box span {
          font-size: 14px;
          color: #047857;
          display: block;
          margin-bottom: 4px;
        }
        .amount-box strong {
          font-size: 36px;
          color: #047857;
        }
        .tax-info {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .tax-info h4 {
          color: #92400e;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .tax-info p {
          color: #a16207;
          font-size: 13px;
        }
        .footer {
          border-top: 1px solid #e2e8f0;
          padding: 24px 32px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }
        .footer p { margin-bottom: 4px; }
        .thank-you {
          background: #f0f9ff;
          padding: 24px;
          text-align: center;
          border-radius: 12px;
        }
        .thank-you h3 {
          color: #0369a1;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .thank-you p {
          color: #0284c7;
          font-size: 14px;
        }
        @media print {
          body { padding: 0; background: white; }
          .receipt { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>❤️ DonateMatch</h1>
          <p>Official Donation Receipt</p>
          <div class="badge">✓ Verified Donation</div>
        </div>
        
        <div class="content">
          <div class="receipt-number">
            <span>RECEIPT NUMBER</span>
            <strong>${receiptNumber}</strong>
          </div>
          
          <div class="details">
            <div class="detail-group">
              <h3>Donor Information</h3>
              <p><strong>${donation.isAnonymous ? 'Anonymous Donor' : donor?.name || 'Valued Donor'}</strong></p>
              ${!donation.isAnonymous && donor?.email ? `<p>${donor.email}</p>` : ''}
            </div>
            <div class="detail-group">
              <h3>Date of Donation</h3>
              <p><strong>${date}</strong></p>
              <p>Transaction ID: ${donation.razorpayPaymentId || 'N/A'}</p>
            </div>
          </div>
          
          <div class="details">
            <div class="detail-group">
              <h3>Beneficiary Organization</h3>
              <p><strong>${charity?.organizationName || 'Charity Organization'}</strong></p>
              ${charity?.registrationNumber ? `<p>Reg. No: ${charity.registrationNumber}</p>` : ''}
              ${charity?.location ? `<p>${charity.location.city}, ${charity.location.state}</p>` : ''}
            </div>
            <div class="detail-group">
              <h3>Payment Method</h3>
              <p><strong>${donation.paymentMethod || 'Online Payment'}</strong></p>
              <p>Status: <span style="color: #10b981;">✓ Completed</span></p>
            </div>
          </div>
          
          <div class="amount-box">
            <span>DONATION AMOUNT</span>
            <strong>₹${donation.amount?.toLocaleString('en-IN') || '0'}</strong>
          </div>
          
          ${charity?.is80GRegistered ? `
          <div class="tax-info">
            <h4>📋 Tax Benefit Information</h4>
            <p>This organization is registered under Section 80G of the Income Tax Act. 
            You may claim tax deduction for this donation as per applicable laws.
            ${charity?.pan80G ? `<br>80G PAN: ${charity.pan80G}` : ''}</p>
          </div>
          ` : ''}
          
          <div class="thank-you">
            <h3>Thank You for Your Generosity! 🙏</h3>
            <p>Your support helps create real impact in communities across India.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt and does not require a signature.</p>
          <p>For any queries, contact support@donatematch.in</p>
          <p style="margin-top: 12px; color: #94a3b8;">© ${new Date().getFullYear()} DonateMatch. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Receipt Download Button Component
export const ReceiptDownloadButton = ({ donation, charity, donor, variant = 'primary' }) => {
  const handleDownload = async () => {
    try {
      const html = generateReceiptHTML(donation, charity, donor);
      
      // Create a new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      toast.success('Receipt ready for download!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt');
    }
  };

  const buttonClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 p-2 rounded-lg'
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 ${buttonClasses[variant]} transition-colors`}
      title="Download Receipt"
    >
      <FiDownload />
      {variant !== 'ghost' && <span>Download Receipt</span>}
    </button>
  );
};

// Receipt Preview Card
export const ReceiptCard = ({ donation, charity, donor, showActions = true }) => {
  const receiptNumber = `DM-${donation._id?.slice(-8).toUpperCase() || 'XXXXXXXX'}`;
  const date = new Date(donation.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handlePrint = () => {
    const html = generateReceiptHTML(donation, charity, donor);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiHeart />
            <span className="font-medium">Donation Receipt</span>
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {receiptNumber}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {charity?.organizationName || 'Charity'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{donation.amount?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
          </div>
        </div>

        {charity?.is80GRegistered && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-1">
              <FiCheck /> Eligible for 80G Tax Deduction
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <ReceiptDownloadButton 
              donation={donation} 
              charity={charity} 
              donor={donor}
              variant="primary"
            />
            <button
              onClick={handlePrint}
              className="btn-outline flex items-center gap-2"
            >
              <FiPrinter />
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  ReceiptDownloadButton,
  ReceiptCard,
  generateReceiptHTML
};
