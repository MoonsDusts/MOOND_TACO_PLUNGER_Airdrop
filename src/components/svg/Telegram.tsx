type TelegramSVGType = {
  className?: string;
};

const TelegramSVG: React.FC<TelegramSVGType> = ({ className }) => (
  <svg
    viewBox="0 0 11 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className ?? ""}
  >
    <path
      d="M10.4691 0.801576L8.88477 8.27345C8.76524 8.80079 8.45352 8.93204 8.01055 8.68361L5.59649 6.9047L4.43165 8.02501C4.30274 8.15392 4.19493 8.26173 3.94649 8.26173L4.11993 5.80314L8.59415 1.76017C8.78868 1.58673 8.55196 1.49064 8.2918 1.66408L2.76055 5.14689L0.379305 4.40158C-0.138664 4.23986 -0.148039 3.88361 0.487117 3.63517L9.80118 0.046889C10.2324 -0.11483 10.6098 0.142983 10.4691 0.801576Z"
      fill="currentColor"
    />
  </svg>
);

export default TelegramSVG;
