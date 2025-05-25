'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Define the expected structure of a server action's response
/**
 * Represents the typical structure of a response from a server action.
 * @template TResponsePayload The type of the data payload on success.
 */
export interface ServerActionResponse<TResponsePayload> {
  /** Indicates whether the server action was successful. */
  success: boolean;
  /** The data payload if the action was successful. */
  data?: TResponsePayload;
  /** An error message if the action failed. */
  error?: string;
}

// Define the options for the hook
/**
 * Options for configuring the `useDealAIInteraction` hook.
 * @template TRequestData The type of the data passed to the server action.
 * @template TResponsePayload The type of the data payload expected from a successful server action.
 */
export interface UseDealAIInteractionOptions<TRequestData, TResponsePayload> {
  /**
   * The server action function to be executed.
   * It should take `requestData` and return a `Promise` resolving to `ServerActionResponse<TResponsePayload>`.
   */
  action: (requestData: TRequestData) => Promise<ServerActionResponse<TResponsePayload>>;
  /** Optional callback executed on successful action completion. */
  onSuccess?: (data: TResponsePayload, requestData?: TRequestData) => void;
  /** Optional callback executed when the action results in an error or a client-side exception occurs. */
  onError?: (error: string, requestData?: TRequestData) => void;
  /** Optional custom message to display in a toast on success. Defaults to "Operation successful!". */
  successMessage?: string;
  /** Optional custom message to display in a toast on error. Defaults to the error received or a generic message. */
  errorMessage?: string;
}

// Define the return type of the hook
/**
 * The result object returned by the `useDealAIInteraction` hook.
 * @template TRequestData The type of the data passed to the server action.
 * @template TResponsePayload The type of the data payload expected from a successful server action.
 */
export interface UseDealAIInteractionResult<TRequestData, TResponsePayload> {
  /** The data returned from a successful server action, or `null` initially or after an error/reset. */
  data: TResponsePayload | null;
  /** Boolean indicating if the server action is currently in progress. */
  isLoading: boolean;
  /** Error message string if the last action failed or an exception occurred, or `null` otherwise. */
  error: string | null;
  /**
   * Function to trigger the server action.
   * @param requestData The data to pass to the server action.
   * @returns A `Promise` that resolves when the action attempt (including success/error handling) is complete.
   */
  execute: (requestData: TRequestData) => Promise<void>;
  /** Function to reset the hook's state (`data`, `isLoading`, `error`) to initial values. */
  reset: () => void;
}

/**
 * A custom React hook to manage the lifecycle of an AI-related server action call.
 * It handles state management for data, loading, and errors, and provides
 * toast notifications for success and failure.
 *
 * @template TRequestData The type of the data passed to the server action.
 * @template TResponsePayload The type of the data payload expected from a successful server action.
 * @param {UseDealAIInteractionOptions<TRequestData, TResponsePayload>} options Configuration options for the hook.
 * @returns {UseDealAIInteractionResult<TRequestData, TResponsePayload>} An object containing state and functions to interact with the server action.
 *
 * @example
 * ```tsx
 * // In your component:
 * // Assuming `myServerAction` is a server action like:
 * // async function myServerAction(params: { id: string }): Promise<ServerActionResponse<{ message: string }>> {
 * //   // ... your logic
 * //   if (success) return { success: true, data: { message: "Hello!" } };
 * //   return { success: false, error: "Failed!" };
 * // }
 *
 * const { data, isLoading, error, execute, reset } = useDealAIInteraction({
 *   action: myServerAction,
 *   successMessage: "Successfully fetched data!",
 *   onSuccess: (responseData) => console.log("Got data:", responseData),
 *   onError: (errorMsg) => console.error("Action failed:", errorMsg),
 * });
 *
 * // To call the action:
 * // execute({ id: 'some-id' });
 *
 * // To reset state:
 * // reset();
 * ```
 */
export function useDealAIInteraction<TRequestData, TResponsePayload>(
  options: UseDealAIInteractionOptions<TRequestData, TResponsePayload>
): UseDealAIInteractionResult<TRequestData, TResponsePayload> {
  const [data, setData] = useState<TResponsePayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { action, onSuccess, onError, successMessage, errorMessage } = options;

  const execute = useCallback(async (requestData: TRequestData) => {
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      const result = await action(requestData);

      if (result.success && result.data !== undefined) {
        setData(result.data);
        toast.success(successMessage || 'Operation successful!');
        if (onSuccess) {
          onSuccess(result.data, requestData);
        }
      } else {
        // Handle server action failure (result.success === false or result.error is present)
        const errorMsg = result.error || errorMessage || 'An unexpected error occurred.';
        setError(errorMsg);
        toast.error(errorMsg);
        if (onError) {
          onError(errorMsg, requestData);
        }
      }
    } catch (e) {
      // Handle client-side exceptions during the execute function
      console.error('Client-side error in useDealAIInteraction execute:', e);
      const clientErrorMsg = errorMessage || (e instanceof Error ? e.message : 'An unexpected client-side error occurred.');
      setError(clientErrorMsg);
      toast.error(clientErrorMsg);
      if (onError) {
        onError(clientErrorMsg, requestData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [action, onSuccess, onError, successMessage, errorMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}
