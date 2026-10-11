import "@testing-library/jest-dom/vitest"
import { vi, beforeEach } from "vitest"

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

beforeEach(() => {
    vi.clearAllMocks()
})
