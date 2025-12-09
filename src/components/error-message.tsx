type ErrorMessageProps = {
  title: string;
  description: string;
};

const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
      <p className="text-red-500 text-sm font-bold uppercase">{props.title}</p>
      <p className="text-xs text-zinc-500 mt-1">{props.description}</p>
    </div>
  );
};

export { ErrorMessage };
