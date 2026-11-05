const environment = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    oauth: {
        clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
        redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
        authorizationEndpoint: "/connect/authorize",
        tokenEndpoint: "/connect/token",
        scope: "openid offline_access"
    }
}

export default environment