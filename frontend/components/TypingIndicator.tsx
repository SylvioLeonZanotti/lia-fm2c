export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-teal-100">
        <img src="/avatar.png" alt="Lia" className="w-full h-full object-cover object-top" />
      </div>
      <div className="flex items-center gap-1.5 py-1">
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
