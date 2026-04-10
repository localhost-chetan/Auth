type FormTitleProps = {
  title: string;
};

export const FormTitle = ({ title }: FormTitleProps) => {
  return (
    <h1 className="mb-6 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-center text-lg font-bold text-transparent md:text-2xl">
      {title}
    </h1>
  );
};
