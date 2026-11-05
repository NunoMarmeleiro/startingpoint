function generateRandomString(length: number): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"

    const randomValues = crypto.getRandomValues(
        new Uint8Array(length)
    )

    return Array.from(randomValues)
        .map(value => characters[value % characters.length])
        .join("")
}

function base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)

    const binary = Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join("")

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

export async function generatePkcePair() {
    const codeVerifier = generateRandomString(64)

    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)

    const digest = await crypto.subtle.digest("SHA-256", data)

    const codeChallenge = base64UrlEncode(digest)

    return {
        codeVerifier,
        codeChallenge
    }
}