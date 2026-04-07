

## Problem

The image generation gets stuck loading forever due to a bug in the retry logic in `ImageGenerator.tsx`.

### Root Cause

When the first attempt (retryCount=0) fails, it schedules a retry via `setTimeout` and returns. The `finally` block sets `isLoading = false` (because retryCount is 0), then the retry sets it back to `true`. If retry 1 or 2 also fails and throws an error, the `finally` block does NOT reset `isLoading` because it only does so when `retryCount === 0`. Result: the spinner stays forever.

Additionally, the Google AI provider is returning a 502 "Network connection lost" error, which means the edge function returns `{ success: false, error: "no_image" }`. After exhausting retries, the user sees no feedback because `isLoading` stays `true`.

## Solution

### 1. Fix retry logic in `src/components/ImageGenerator.tsx`

- Always set `isLoading = false` in the `finally` block when it's the last attempt (retryCount >= 2) or when an error is thrown (not a retry path)
- Simpler approach: remove the `retryCount === 0` guard and instead only set `isLoading = false` when not continuing to retry. This means tracking whether we're actually retrying or finishing.

### 2. Improve error handling for the 502 case

- When the edge function returns `no_image` error after all retries, show a clear toast message telling the user to try again later
- Add a timeout safeguard (e.g., 90 seconds max) so loading always stops eventually

### Technical Changes

**File: `src/components/ImageGenerator.tsx`**

- Refactor `generateImage` to always reset `isLoading = false` on the final attempt or on error
- Change the `finally` block: set `isLoading = false` unless we are actively scheduling a retry (use a flag or restructure the flow)
- Add a safety timeout that forces `isLoading = false` after 90 seconds

