import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Ride, RideRequest, RideRequestStatus } from "@/types";

import { api } from "@/lib/api";

interface RideContextValue {
  rides: Ride[];
  loading: boolean;

  loadRides: () => Promise<void>;
  getRide: (id: string) => Promise<Ride>;
  addRide: (data: Partial<Ride>) => Promise<Ride>;
  deleteRide: (id: string) => Promise<void>;

  requestRide: (id: string) => Promise<RideRequest>;
  myRequests: () => Promise<RideRequest[]>;
  driverRequests: () => Promise<RideRequest[]>;

  respondToRequest: (
    requestId: string,
    action: Exclude<RideRequestStatus, "pending">,
  ) => Promise<RideRequest>;
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

interface RideProviderProps {
  children: ReactNode;
}

export function RideProvider({ children }: RideProviderProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRides = useCallback(async () => {
    setLoading(true);

    try {
      const result = await api<Ride[]>("/rides");

      setRides(Array.isArray(result) ? result : []);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRide = useCallback(async (id: string) => {
    return api<Ride>(`/rides/${id}`);
  }, []);

  const addRide = useCallback(async (data: Partial<Ride>) => {
    const createdRide = await api<Ride>("/rides", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setRides((current) => [createdRide, ...current]);

    return createdRide;
  }, []);

  const deleteRide = useCallback(async (id: string) => {
    await api(`/rides/${id}`, {
      method: "DELETE",
    });

    setRides((current) => current.filter((ride) => ride._id !== id));
  }, []);

  const requestRide = useCallback(async (id: string) => {
    return api<RideRequest>("/rides/request", {
      method: "POST",
      body: JSON.stringify({
        rideId: id,
      }),
    });
  }, []);

  const myRequests = useCallback(async () => {
    const result = await api<RideRequest[]>("/rides/requests/mine");

    return Array.isArray(result) ? result : [];
  }, []);

  const driverRequests = useCallback(async () => {
    const result = await api<RideRequest[]>("/rides/requests/driver");

    return Array.isArray(result) ? result : [];
  }, []);

  const respondToRequest = useCallback(
    async (
      requestId: string,
      action: Exclude<RideRequestStatus, "pending">,
    ) => {
      return api<RideRequest>("/rides/request/respond", {
        method: "PATCH",
        body: JSON.stringify({
          requestId,
          action,
        }),
      });
    },
    [],
  );

  const value = useMemo<RideContextValue>(
    () => ({
      rides,
      loading,
      loadRides,
      getRide,
      addRide,
      deleteRide,
      requestRide,
      myRequests,
      driverRequests,
      respondToRequest,
    }),
    [
      rides,
      loading,
      loadRides,
      getRide,
      addRide,
      deleteRide,
      requestRide,
      myRequests,
      driverRequests,
      respondToRequest,
    ],
  );

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

export function useRides(): RideContextValue {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error("useRides must be used inside RideProvider");
  }

  return context;
}
