import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile } from "~/api/bsky";

interface BskyProfileData {
  handle: string;
  displayName: string;
  avatar: string;
  description: string;
  banner: string;
}

interface BaseBskyResultAttach {
  refreshData: () => Promise<void>;
}

type ErroredBskyResult = [
  never,
  {
    error: Record<string, unknown>;
    isLoading: false;
  } & BaseBskyResultAttach
];

type SuccessfulBskyResult = [
  BskyProfileData,
  {
    error: never;
    isLoading: false;
  } & BaseBskyResultAttach
];

type LoadingBskyResult = [
  never,
  {
    error: never;
    isLoading: true;
  } & BaseBskyResultAttach
];

type BskyResult = SuccessfulBskyResult | ErroredBskyResult | LoadingBskyResult;

export default function useBskyProfile(name: string | null): BskyResult {
  const [data, setData] = useState<BskyProfileData | null>(null);
  const [error, setError] = useState<Record<string, unknown> | null>(null);

  const isLoading = useMemo(
    () => data === null && error === null,
    [data, error]
  );

  const refreshData = useCallback(async () => {
    setData(null);
    setError(null);
    if (!name) return;

    try {
      const profileData = await getProfile(name);
      setData(profileData);
    } catch (err) {
      setError(
        err instanceof Error ? { message: err.message } : { error: err }
      );
    }
  }, [name]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return [
      null as never,
      { error: null as never, refreshData, isLoading: true },
    ];
  }

  if (error) {
    return [null as never, { error, refreshData, isLoading: false }];
  }

  if (data) {
    return [data, { error: null as never, refreshData, isLoading: false }];
  }

  throw new Error("Unexpected state in useBskyProfile hook");
}
