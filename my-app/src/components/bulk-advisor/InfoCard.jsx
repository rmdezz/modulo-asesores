import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info } from 'lucide-react';

const InfoCard = ({ type, title, message, buttonText, buttonIcon, onClick }) => {
  const isWarning = type === 'warning';
  
  const bgColor = isWarning ? 'bg-yellow-50' : 'bg-blue-50';
  const borderColor = isWarning ? 'border-yellow-200' : 'border-blue-200';
  const iconColor = isWarning ? 'text-yellow-600' : 'text-blue-600';
  const titleColor = isWarning ? 'text-yellow-800' : 'text-blue-800';
  const messageColor = isWarning ? 'text-yellow-700' : 'text-blue-700';
  const buttonColors = isWarning 
    ? 'text-yellow-800 border-yellow-600 hover:bg-yellow-100' 
    : 'text-blue-800 border-blue-600 hover:bg-blue-100';
  
  return (
    <div className={`${bgColor} border ${borderColor} rounded-md p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isWarning ? (
            <AlertCircle className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <Info className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${titleColor}`}>{title}</h3>
          <div className={`mt-2 text-sm ${messageColor}`}>
            <p>{message}</p>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={buttonColors}
              onClick={onClick}
            >
              {buttonIcon}
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;