'use client'
import { useState } from "react";
import { Badge } from "./ui/badge";

const ExpandableTags = ({ tags, maxVisible = 2 }) => {
    const [expanded, setExpanded] = useState(false);
    
    const visibleTags = expanded ? tags : tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;
    
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {visibleTags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
        
        {!expanded && remainingCount > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium rounded-full px-1.5 py-0.5 hover:bg-blue-50"
          >
            +{remainingCount}
          </button>
        )}
        
        {expanded && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium rounded-full px-1.5 py-0.5 hover:bg-blue-50"
          >
            Menos
          </button>
        )}
      </div>
    );
  };
  
export default ExpandableTags;