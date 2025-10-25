import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void): void => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (newToken: string): void => {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
};

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        const errorResponse = error.response;

        if (errorResponse?.status === 401 && !originalRequest._retry) {
            const errorMessage =
                (errorResponse.data as any)?.message?.toLowerCase?.() || "";

            if (errorMessage.includes("expired")) {
                if (isRefreshing) {
                    return new Promise((resolve) => {
                        subscribeTokenRefresh((token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        });
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshTokenValue = localStorage.getItem("refreshToken");
                    if (!refreshTokenValue) throw new Error("No refresh token");

                    const refreshResponse = await refreshClient.post<{
                        result: { accessToken: string; refreshToken: string };
                    }>("/api/auth/refresh", {
                        refreshToken: refreshTokenValue,
                    });

                    const { accessToken, refreshToken } = refreshResponse.data.result;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
                    onRefreshed(accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error("Auto refresh token failed:", refreshError);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userProfile");
                    window.location.href = "/login";
                } finally {
                    isRefreshing = false;
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
