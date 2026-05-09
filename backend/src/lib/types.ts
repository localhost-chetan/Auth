type ApiError = {
    error: string;
};

type ApiMessage = {
    message: string;
};

type ApiData<T> = {
    message?: string;
    data: T;
};

export type ApiResponse<T = never> = ApiError | ApiMessage | ApiData<T>;