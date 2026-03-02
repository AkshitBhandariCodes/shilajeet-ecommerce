'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface Certificate {
  productId: string;
  productName: string;
  batchNumber: string;
  pdfPath: string;
}

export default function CertificateOfAnalysis() {
  const [batchInput, setBatchInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [downloading, setDownloading] = useState(false);

  // Local certificates with batch numbers and PDF paths
  const certificates: Certificate[] = [
    {
      productId: 'agnishila-shilajit-gummies',
      productName: 'Shilajit ShilaBoost Gummies',
      batchNumber: 'BAKG-0125',
      pdfPath: '/Agnishila Shilajit Fulvic Acid.pdf',
    },
    {
      productId: 'ashwa-glo-gummies',
      productName: 'KSM-66 AshwaGlow Gummies',
      batchNumber: 'BAKA-0126',
      pdfPath: '/Agnishila Ashwagandha.pdf',
    },
  ];

  const handleDownload = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const inputBatch = batchInput.trim().toUpperCase();
    
    if (!inputBatch) {
      setMessage({ type: 'error', text: 'Please enter a batch number' });
      return;
    }

    // Find matching certificate
    const matchingCert = certificates.find(
      cert => cert.batchNumber.toUpperCase() === inputBatch
    );

    if (!matchingCert) {
      setMessage({ type: 'error', text: 'Batch number not found. Please check and try again.' });
      return;
    }

    try {
      setDownloading(true);
      
      // Create link to local PDF
      const link = document.createElement('a');
      link.href = matchingCert.pdfPath;
      link.download = `${matchingCert.productName}-Certificate-${matchingCert.batchNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      setMessage({ type: 'success', text: `✓ Downloaded certificate for ${matchingCert.productName}` });
      setBatchInput('');

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: null, text: '' });
      }, 3000);
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Failed to download certificate. Please try again.' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-400/10"></div>
        <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[50px] border-r-transparent border-b-[50px] border-b-primary-400/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="w-6 h-6 text-primary-400" />
            <span className="text-primary-400 font-bold uppercase tracking-widest text-sm">Quality Assurance</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider mb-4">
            Certificate of Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Every batch of Agnishila products is tested for purity and potency. Enter your batch number to download the Certificate of Analysis.
          </p>

          {/* Input Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={batchInput}
                onChange={(e) => {
                  setBatchInput(e.target.value.toUpperCase());
                  setMessage({ type: null, text: '' });
                }}
                onKeyPress={handleDownload}
                placeholder="Enter batch number (e.g., BAKG-0125)"
                disabled={downloading}
                className="w-full bg-black border-2 border-primary-400 text-white px-6 py-4 rounded font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-primary-500 focus:shadow-lg focus:shadow-primary-400/30 transition-all text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-3 uppercase tracking-wider flex items-center justify-center gap-2">
                <Download className="w-3 h-3" />
                Press Enter to download
              </p>
            </div>

            {/* Message Display */}
            {message.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded flex items-center space-x-3 ${
                  message.type === 'success'
                    ? 'bg-green-400/10 border border-green-400/30'
                    : 'bg-red-400/10 border border-red-400/30'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <p className={message.type === 'success' ? 'text-green-400 text-sm font-medium' : 'text-red-400 text-sm font-medium'}>
                  {message.text}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary-400/10 border border-primary-400/30 p-6 rounded max-w-2xl mx-auto"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-bold mb-1">Quality Commitment</p>
              <p className="text-gray-300 text-sm">
                All Agnishila products undergo rigorous third-party testing to ensure purity, potency, and safety. Each batch is assigned a unique batch number for complete traceability. Find the batch number on your product packaging and enter it above to download your certificate.
              </p>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
