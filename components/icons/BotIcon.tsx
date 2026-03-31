
import React from 'react';

const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
        {...props}
    >
        <path d="M12 .5a11.5 11.5 0 1011.5 11.5A11.51 11.51 0 0012 .5zm0 22a10.5 10.5 0 1110.5-10.5A10.51 10.51 0 0112 22.5z" />
        <path d="M12 5.5a5.5 5.5 0 105.5 5.5A5.51 5.51 0 0012 5.5zm0 10a4.5 4.5 0 114.5-4.5A4.51 4.51 0 0112 15.5z" />
        <path d="M12 7.25a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0V8a.75.75 0 00-.75-.75zM12 14.25a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75z" />
        <path d="M8 11.25a.75.75 0 00-.75.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75.75.75 0 000-1.5zM17.25 11.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 00-.75-.75z" />
    </svg>
);

export default BotIcon;
