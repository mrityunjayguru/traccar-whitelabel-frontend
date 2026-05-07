import { Link } from 'react-router-dom';
import React from 'react';

const MenuItem = ({ title, link, icon, selected, className, iconClassName, textClassName }) => {
  return (
    <Link
      key={link}
      to={link}
      className={`flex items-center justify-center px-2 md:px-2.5 py-1.5 md:py-2 transition-all cursor-pointer no-underline shrink-0 ${className}`}
    >
      {icon && (
        <div className={`flex items-center justify-center mr-1 md:mr-2 ${iconClassName}`}>
          {React.cloneElement(icon, { sx: { fontSize: { xs: '18px', md: '20px' } }, className: iconClassName })}
        </div>
      )}
      <span className={`whitespace-nowrap text-[12px] md:text-[14px]! font-medium! ${textClassName}`}>
        {title}
      </span>
    </Link>
  );
};

export default MenuItem;
