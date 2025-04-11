
import { Ride } from "./types";

export const getMockRides = (): Ride[] => {
  return [
    {
      id: "1",
      driver: "Ahmed Benaissa",
      from: "Constantine",
      to: "Ali Mendjeli",
      date: new Date().toISOString().split('T')[0],
      time: "08:00",
      price: 250,
      seats: 3,
      rating: 4.7,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "2",
      driver: "Mohammed Larbi",
      from: "Ali Mendjeli",
      to: "Constantine",
      date: new Date().toISOString().split('T')[0],
      time: "09:30",
      price: 250,
      seats: 2,
      rating: 4.8,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "3",
      driver: "Omar Hamid",
      from: "Bekira",
      to: "Constantine",
      date: new Date().toISOString().split('T')[0],
      time: "10:15",
      price: 300,
      seats: 1,
      rating: 4.5,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "4",
      driver: "Samir Kaci",
      from: "Constantine",
      to: "El Khroub",
      date: new Date().toISOString().split('T')[0],
      time: "11:00",
      price: 200,
      seats: 4,
      rating: 4.6,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "5",
      driver: "Youcef Benali",
      from: "Didouche Mourad",
      to: "Constantine",
      date: new Date().toISOString().split('T')[0],
      time: "14:30",
      price: 350,
      seats: 2,
      rating: 4.9,
      driverGender: "male",
      trip_id: null
    }
  ];
};

export const getAlgerMockRides = (): Ride[] => {
  return [
    {
      id: "6",
      driver: "Farid Mebarki",
      from: "Sidi Yahia",
      to: "Hydra",
      date: new Date().toISOString().split('T')[0],
      time: "08:30",
      price: 300,
      seats: 3,
      rating: 4.8,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "7",
      driver: "Noureddine Boudiaf",
      from: "Hydra",
      to: "Bir Mourad Raïs",
      date: new Date().toISOString().split('T')[0],
      time: "09:15",
      price: 250,
      seats: 2,
      rating: 4.6,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "8",
      driver: "Kamel Dahmani",
      from: "Bab Ezzouar",
      to: "Alger Centre",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      price: 350,
      seats: 4,
      rating: 4.7,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "9",
      driver: "Rachid Hamidi",
      from: "Kouba",
      to: "El Biar",
      date: new Date().toISOString().split('T')[0],
      time: "11:30",
      price: 280,
      seats: 1,
      rating: 4.9,
      driverGender: "male",
      trip_id: null
    },
    {
      id: "10",
      driver: "Hamid Berrahma",
      from: "Bordj El Kiffan",
      to: "Dar El Beïda",
      date: new Date().toISOString().split('T')[0],
      time: "14:00",
      price: 320,
      seats: 3,
      rating: 4.5,
      driverGender: "male",
      trip_id: null
    }
  ];
};
