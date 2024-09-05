export default function Bubble({
  isUser,
  message,
  time,
  status,
}: {
  isUser: boolean;
  message: string;
  time: string;
  status: string;
}) {
  const bubbleClass = isUser
    ? "bg-green-100 border-green-200"
    : "bg-blue-100 border-blue-200";
  const alignmentClass = isUser
    ? "text-right ml-[calc(100%/3)]"
    : "max-w-[calc(200%/3)]";
  const triangleClass = isUser
    ? "right-0 translate-x-2 border-l-8 border-green-100 border-l-transparent"
    : "left-0 -translate-x-2 border-r-8 border-blue-100 border-r-transparent";
  const statusColor = isUser ? "text-green-500" : "text-blue-500";

  return (
    <div className={`mb-4  ${alignmentClass}`}>
      <div
        className={`${bubbleClass} p-3 rounded-lg inline-block max-w-3/4 border relative`}
      >
        <p>{message}</p>
        <div
          className={`absolute top-0 transform -translate-y-1/2 w-1 h-1 border-t-8 border-b-8 ${triangleClass} border-b-transparent`}
        ></div>
        <div className="text-xs text-gray-500 mt-1">
          {time} | <span className={statusColor}>{status}</span>
        </div>
      </div>
    </div>
  );
}
