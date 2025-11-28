const CashOutline = (props: { className?: string; stroke?: string }) => {
  const { className, stroke = 'white' } = props;
  return (
    <svg
      className={className}
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.537549 5.59912H9.311C9.49736 5.59912 9.64844 5.44804 9.64844 5.26168V0.537517C9.64844 0.351153 9.49736 0.200076 9.311 0.200076H0.537549C0.351186 0.200076 0.200109 0.351153 0.200109 0.537517V5.26168C0.200109 5.44804 0.351186 5.59912 0.537549 5.59912Z"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
      <path
        d="M0.875 6.61133H8.97357"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5498 7.62354H8.29861"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.92451 4.58656C5.85632 4.58656 6.61171 3.83118 6.61171 2.89936C6.61171 1.96754 5.85632 1.21216 4.92451 1.21216C3.99269 1.21216 3.2373 1.96754 3.2373 2.89936C3.2373 3.83118 3.99269 4.58656 4.92451 4.58656Z"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.64814 1.88715C9.20067 1.88715 8.77152 1.70939 8.45511 1.39298C8.1387 1.07657 7.96094 0.647425 7.96094 0.199951"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.200195 1.88715C0.421762 1.88715 0.641159 1.84351 0.845859 1.75872C1.05056 1.67393 1.23656 1.54965 1.39323 1.39298C1.5499 1.23631 1.67418 1.05032 1.75897 0.845615C1.84376 0.640915 1.8874 0.421518 1.8874 0.199951"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.64814 3.91187C9.20067 3.91187 8.77152 4.08962 8.45511 4.40604C8.1387 4.72245 7.96094 5.15159 7.96094 5.59907"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.200195 3.91187C0.421762 3.91187 0.641159 3.95551 0.845859 4.0403C1.05056 4.12509 1.23656 4.24936 1.39323 4.40604C1.5499 4.56271 1.67418 4.7487 1.75897 4.9534C1.84376 5.1581 1.8874 5.3775 1.8874 5.59907"
        stroke={stroke}
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CashOutline;
