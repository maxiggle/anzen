import { clsx } from "../../utils";
import {
  forwardRef,
  useState,
  useEffect,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "cta" | "default" | "plain";
  className?: string;
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className, loading, ...htmlButtonProps }, ref) => {
    const [isRippling, setIsRippling] = useState(false);
    const [coords, setCoords] = useState({ x: -1, y: -1 });

    useEffect(() => {
      if (coords.x !== -1 && coords.y !== -1) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 300);
      } else setIsRippling(false);
    }, [coords]);

    useEffect(() => {
      if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: (e.clientX - rect.left) / 2,
        y: (e.clientY - rect.top) / 2,
      });
      if (htmlButtonProps.onClick) {
        htmlButtonProps.onClick(e);
      }
    };
    const styles: Record<string, string> = {
      cta: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 !outline-2 !outline-indigo-700 !outline-offset-2 !rounded-full shadow-lg hover:shadow-xl",
      primary:
        "bg-purple-500 active:ring-4 transition-all active:bg-purple-800 hover:bg-purple-400 text-white",
      default:
        "bg-purple-500 active:ring-4 text-white transition-all active:ring-pink-200 hover:bg-purple-400",
      plain: "hover:bg-gray-100 active:bg-gray-200",
      secondary: "bg-purple-300",
      outline: "border border-purple-500 text-purple-500 hover:bg-purple-100",
    };

    return (
      <button
        {...htmlButtonProps}
        ref={ref}
        style={
          {
            "--coord-x": `${coords.x}px`,
            "--coord-y": `${coords.y}px`,
            ...htmlButtonProps.style,
          } as React.CSSProperties
        }
        className={clsx([
          "px-6 py-2 font-medium rounded-lg shadow inline-flex items-center gap-2 appearance-none overflow-hidden relative",
          styles[variant] || styles.default,
          isRippling && "ripple",
          className,
        ])}
        onClick={handleClick}
      >
        {loading && (
          <span className="material-symbols-outlined loading">pending</span>
        )}
        {htmlButtonProps.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
