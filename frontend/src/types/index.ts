export type UserRole = "driver" | "passenger";

export interface User {
  id: string;
  universityEmail: string;
  first_name: string;
  last_name: string;
  universityName: string;
  campusLocation: string;
  phoneNumber: string;
  location: string;
  role: UserRole;
  vehicleNumber?: string;
  profilePic?: string;
}

export interface DriverSummary {
  _id: string;
  first_name: string;
  last_name: string;
  universityEmail: string;
  campusLocation: string;
  location: string;
  vehicleNumber?: string;
  role: "driver";
}

export interface PassengerSummary {
  _id: string;
  first_name: string;
  last_name: string;
  universityEmail: string;
  phoneNumber?: string;
  campusLocation?: string;
  location?: string;
  role: "passenger";
}

export interface Ride {
  _id: string;
  date: string;
  route: string;
  pickupLocation: string;
  destination: string;
  driverId: DriverSummary | string | null;
  availableSeats: number;
  notes?: string;
  isFemaleOnly: boolean;
  status: string;
  passengerIdsList: string[];
  createdAt: string;
}

export type RideRequestStatus =
  | "pending"
  | "accepted"
  | "rejected";

export interface RideRequest {
  _id: string;
  rideId: Ride | string | null;
  passengerId: PassengerSummary | string | null;
  status: RideRequestStatus;
  createdAt: string;
  updatedAt?: string;
}
