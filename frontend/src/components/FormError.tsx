type FormErrorProps = {
    error: string;
}

export const FormError = ({ error }: FormErrorProps) => {
    return (
        <p className="text-destructive brightness-125 text-sm font-semibold mt-2">{error}</p>
    );
}