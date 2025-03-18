import { Link } from 'react-router-dom';

const Logo = ({ className = 'h-8 w-auto', withText = true }) => {
  return (
    <Link to="/" className="flex items-center">
      <svg
        className={className}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25 5L5 15V35L25 45L45 35V15L25 5Z"
          fill="#0EA5E9"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M25 25L5 15M25 25L45 15M25 25V45"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M15 20L20 22.5L25 25"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M35 20L30 22.5L25 25"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      
      {withText && (
        <span className="ml-2 text-xl font-bold text-gray-900">Revuverse</span>
      )}
    </Link>
  );
};

export default Logo; 