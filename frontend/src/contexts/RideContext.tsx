import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  Ride,
  RideRequest,
  RideRequestStatus,
} from "@/types";
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
    action: Exclude<RideRequestStatus, "pending">
  ) => Promise<RideRequest>;
}

const RideContext = createContext<RideContextValue | undefined>(
  undefined
);

export function RideProvider({ children }: { children: ReactNode }) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRides = async () => {
    setLoading(true);

    try {
      const result = await api<Ride[]>("/rides");
      setRides(result);
    } finally {
      setLoading(false);
    }
  };

  const getRide = (id: string) => api<Ride>(`/rides/${id}`);

  const addRide = async (data: Partial<Ride>) => {
    const ride = await api<Ride>("/rides", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setRides((current) => [ride, ...current]);
    return ride;
  };

  const deleteRide = async (id: string) => {
    await api(`/rides/${id}`, {
      method: "DELETE",
    });

    setRides((current) =>
      current.filter((ride) => ride._id !== id)
    );
  };

  const requestRide = (id: string) =>
    api<RideRequest>("/rides/request", {
      method: "POST",
      body: JSON.stringify({ rideId: id }),
    });

  const myRequests = () =>
    api<RideRequest[]>("/rides/requests/mine");

  const driverRequests = () =>
    api<RideRequest[]>("/rides/requests/driver");

  const respondToRequest = (
    requestId: string,
    action: Exclude<RideRequestStatus, "pending">
  ) =>
    api<RideRequest>("/rides/request/respond", {
      method: "PATCH",
      body: JSON.stringify({ requestId, action }),
    });

  return (
    <RideContext.Provider
      value={{
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
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export const useRides = () => {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error("useRides must be used within RideProvider");
  }

  return context;
};
