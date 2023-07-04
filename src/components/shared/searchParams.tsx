// import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { type z } from "zod";

const parseValue = (value: unknown) => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value as string) as unknown;
  } catch (error) {
    return value;
  }
};

export function useSearchParams<T extends z.AnyZodObject>(schema: T) {
  // const searchParams = useNextSearchParams();
  const router = useRouter();

  const setSearchParamsWithSchema = useCallback(
    (params: Partial<z.infer<T>>) => {
      const parsed = schema.safeParse(params);
      if (!parsed.success) {
        console.error(parsed.error);
        return {
          ok: false,
          error: parsed.error,
        } as const;
      }

      const newParams = new URLSearchParams();

      Object.entries(parsed.data).forEach(([key, value]) => {
        if (!value) {
          newParams.delete(key);
          return;
        }
        if (typeof value === "object") {
          newParams.set(key, JSON.stringify(value));
          return;
        }
        newParams.set(key, value as string);
      });

      // ignore the async, we don't care about the result
      void router.replace({
        pathname: router.pathname,
        query: newParams.toString(),
      });

      return {
        ok: true,
      } as const;
    },
    [router, schema]
  );

  return useMemo(() => {
    const keyOfZodSchema = Object.keys(schema.shape as Record<string, unknown>);
    const searchParamValues = Object.fromEntries(
      keyOfZodSchema.map((key) => [key, parseValue(router.query[key])])
    );

    const parsed = schema.safeParse(searchParamValues);
    if (!parsed.success) {
      console.error(parsed.error);
      return {
        ok: false,
        error: parsed.error,
      } as const;
    }

    return {
      ok: true,
      searchParams: parsed.data as z.infer<T>,
      setSearchParamsWithSchema,
    } as const;
  }, [router.query, schema, setSearchParamsWithSchema]);
}
