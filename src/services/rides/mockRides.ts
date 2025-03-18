
import { Ride } from './types';

// Mock rides for development when not using Supabase
export const getMockRides = (): Ride[] => {
  return [
    {
      id: "1",
      driver: "Mohamed A.",
      origin: "Ali Mendjeli",
      destination: "City Center",
      departureDate: "2023-06-24",
      departureTime: "08:30",
      price: 200,
      seats: 3,
      rating: 4.8,
      is_mock: true,
      // Backward compatibility fields
      from: "Ali Mendjeli",
      to: "City Center",
      date: "2023-06-24",
      time: "08:30"
    },
    {
      id: "2",
      driver: "Samir B.",
      origin: "City Center",
      destination: "El Khroub",
      departureDate: "2023-06-24",
      departureTime: "10:15",
      price: 150,
      seats: 2,
      rating: 4.5,
      is_mock: true,
      // Backward compatibility fields
      from: "City Center",
      to: "El Khroub",
      date: "2023-06-24",
      time: "10:15"
    },
    {
      id: "3",
      driver: "Ahmed K.",
      origin: "Boussouf",
      destination: "Didouche Mourad",
      departureDate: "2023-06-24",
      departureTime: "12:00",
      price: 180,
      seats: 1,
      rating: 4.9,
      is_mock: true,
      // Backward compatibility fields
      from: "Boussouf",
      to: "Didouche Mourad",
      date: "2023-06-24",
      time: "12:00"
    },
    {
      id: "4",
      driver: "Fares Z.",
      origin: "Zighoud Youcef",
      destination: "Ain Abid",
      departureDate: "2023-06-24",
      departureTime: "15:30",
      price: 250,
      seats: 4,
      rating: 4.7,
      is_mock: true,
      // Backward compatibility fields
      from: "Zighoud Youcef",
      to: "Ain Abid",
      date: "2023-06-24",
      time: "15:30"
    },
    {
      id: "5",
      driver: "Karim M.",
      origin: "Hamma Bouziane",
      destination: "Bekira",
      departureDate: "2023-06-24",
      departureTime: "17:45",
      price: 120,
      seats: 2,
      rating: 4.6,
      is_mock: true,
      // Backward compatibility fields
      from: "Hamma Bouziane",
      to: "Bekira",
      date: "2023-06-24",
      time: "17:45"
    },
  ];
};
