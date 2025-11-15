import { Trophy, Clock, Target, RotateCcw, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  onRestart: () => void;
  userEmail?: string;
  userName?: string;
  userMobile?: string;
  userCollege?: string;
}

export default function Results({
  correctAnswers,
  totalQuestions,
  timeTaken,
  onRestart,
  userEmail,
  userName,
  userMobile,
  userCollege,
}: ResultsProps) {
  const [copied, setCopied] = useState(false);
  
  console.log('Results component rendering with:', { correctAnswers, totalQuestions, timeTaken });
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-emerald-600' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'text-yellow-600' };
    return { text: 'Keep Practicing!', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage();

  const generateResultSummary = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    return `SWAVIK INTERNSHIP
Quiz Result Summary

Generated on: ${currentDate} at ${currentTime}

Student Details:
Name: ${userName || 'N/A'}
Email: ${userEmail || 'N/A'}
Mobile: ${userMobile || 'N/A'}
College: ${userCollege || 'N/A'}

Quiz Performance:
Total Questions: ${totalQuestions}
Correct Answers: ${correctAnswers}
Accuracy: ${percentage}%
Time Taken: ${formatTime(timeTaken)}
Performance Level: ${performance.text}

Quiz Breakdown:
• Standard Round: 8 questions
• Final Boss Round: 7 questions

Thank you for participating in the SWAVIK Internship Quiz!`;
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(generateResultSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy results:', err);
      alert('Failed to copy results. Please try again.');
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      
      const primaryColor: [number, number, number] = [5, 150, 105];
      const textColor: [number, number, number] = [31, 41, 55];
      const lightGray: [number, number, number] = [107, 114, 128];
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('SWAVIK INTERNSHIP', 105, 25, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text('Quiz Result Summary', 105, 35, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(...lightGray);
      doc.text(`Generated on: ${currentDate} at ${currentTime}`, 105, 45, { align: 'center' });
      
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      doc.line(20, 50, 190, 50);
      
      let yPos = 65;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Student Details', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      if (userName) {
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(userName, 50, yPos);
        yPos += 8;
      }
      
      if (userEmail) {
        doc.setFont('helvetica', 'bold');
        doc.text('Email:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(userEmail, 50, yPos);
        yPos += 8;
      }
      
      if (userMobile) {
        doc.setFont('helvetica', 'bold');
        doc.text('Mobile:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(userMobile, 50, yPos);
        yPos += 8;
      }
      
      if (userCollege) {
        doc.setFont('helvetica', 'bold');
        doc.text('College:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(userCollege, 50, yPos);
        yPos += 8;
      }
      
      yPos += 10;
      
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(`${percentage}%`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text(performance.text, 105, yPos, { align: 'center' });
      yPos += 20;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Quiz Performance', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total Questions:', 25, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(totalQuestions.toString(), 70, yPos);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Accuracy:', 110, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${percentage}%`, 140, yPos);
      yPos += 8;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Correct Answers:', 25, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(correctAnswers.toString(), 70, yPos);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Time Taken:', 110, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(formatTime(timeTaken), 140, yPos);
      yPos += 15;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Quiz Breakdown', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('• Standard Round: 8 questions', 25, yPos);
      yPos += 8;
      doc.text('• Final Boss Round: 7 questions', 25, yPos);
      yPos += 20;
      
      doc.setFontSize(10);
      doc.setTextColor(...lightGray);
      doc.text('Thank you for participating in the SWAVIK Internship Quiz!', 105, yPos, { align: 'center' });
      doc.text('This document was generated automatically.', 105, yPos + 8, { align: 'center' });
      
      const fileName = `SWAVIK_Quiz_Results_${userName?.replace(/\s+/g, '_') || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try copying the results instead.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full transform transition-all" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
            SWAVIK INTERNSHIP
          </h1>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 break-words">Quiz Complete!</h2>
          <p className={`text-lg sm:text-xl font-semibold ${performance.color} break-words`}>
            {performance.text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 sm:p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mb-3 mx-auto">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 break-words">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xs sm:text-sm text-emerald-600 font-medium mt-1 break-words">
                Correct Answers
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-3 mx-auto">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-700 break-words">{percentage}%</div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium mt-1 break-words">
                Accuracy
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border-2 border-purple-200">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-3 mx-auto">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-700 break-words">
                {formatTime(timeTaken)}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium mt-1 break-words">
                Time Taken
              </div>
            </div>
          </div>
        </div>

        {(userName || userEmail || userMobile || userCollege) && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Student Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {userName && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800 break-words">{userName}</span>
                </div>
              )}
              {userEmail && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-800 break-words">{userEmail}</span>
                </div>
              )}
              {userMobile && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Mobile:</span>
                  <span className="font-semibold text-gray-800">{userMobile}</span>
                </div>
              )}
              {userCollege && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">College:</span>
                  <span className="font-semibold text-gray-800 break-words">{userCollege}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={downloadPDF}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={copyResults}
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              You answered <span className="font-semibold text-emerald-600">{correctAnswers}</span>{' '}
              out of <span className="font-semibold">{totalQuestions}</span> questions correctly
            </p>
            <p className="text-xs text-gray-500">
              Standard Round: 8 questions • Final Boss Round: 7 questions
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}