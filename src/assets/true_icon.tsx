export interface IconProps {
    color?: string;
    size?: number;
  }
  export const TrueIcon = (props: IconProps) => {
    return (
      <>
        <svg
          width={props.size || 16}
          height={props.size || 16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.00004 10.586L3.70711 8.29303C3.31658 7.9025 2.68342 7.9025 2.29289 8.29303C1.90237 8.68356 1.90237 9.31672 2.29289 9.70725L5.29289 12.7072C5.68342 13.0977 6.31658 13.0977 6.70711 12.7072L13.7071 5.70725C14.0976 5.31672 14.0976 4.68356 13.7071 4.29303C13.3166 3.9025 12.6834 3.9025 12.2929 4.29303L6.00004 10.586Z"
            fill={props.color || "#28a745"}
          />
        </svg>
      </>
    );
  };
  