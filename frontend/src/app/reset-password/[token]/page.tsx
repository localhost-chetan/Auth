import { Wrapper } from "@components/wrapper";
import { ResetPasswordForm } from "@components/reset-password-form";

type PageProps = {
    params: Promise<{ token: string }>
}

export default async function Page({ params }: PageProps) {
    const { token } = await params

    return <Wrapper>
        <ResetPasswordForm token={token} />
    </Wrapper>
}