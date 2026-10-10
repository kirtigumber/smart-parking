import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { parkingWebSocket } from '../services/websocket';
import { generateSlotsForLocation } from '../data/mockData';

// =============================================================================
// SMART PARK — ParkingContext (All 5 Phases Fully Integrated)
//
// Phase 1: Parking lots & slots from Spring Boot REST API
// Phase 2: Reservations — create, cancel, view (real API, not mock)
// Phase 3: JWT token automatically attached by api.js to every request
// Phase 4: WebSocket real-time SLOT_UPDATE + QR verify + admit vehicle
// Phase 5: Admin CRUD for lots/slots, admin stats, cancel reservations
// =============================================================================

const ParkingContext = createContext();

const getToken = () => localStorage.getItem('smart_park_token');
const getUserEmail = () => {
  try {
    const u = JSON.parse(localStorage.getItem('smart_park_user') || 'null');
    return u?.email || null;
  } catch { return null; }
};
const getUserRole = () => {
  try {
    const u = JSON.parse(localStorage.getItem('smart_park_user') || 'null');
    return u?.role?.toLowerCase() || null;
  } catch { return null; }
};

export const ParkingProvider = ({ children }) => {
  // --- Core state (seeded empty — filled from backend on first load) ---
  const [locations, setLocations] = useState([]);
  const [slotsByLocation, setSlotsByLocation] = useState({});
  const [bookings, setBookings] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ref so callbacks always see latest locations without stale closure
  const locationsRef = useRef(locations);
  useEffect(() => { locationsRef.current = locations; }, [locations]);

  // --- Phase 4: WebSocket Real-Time Updates ---
  useEffect(() => {
    parkingWebSocket.connect();

    const unsubStatus = parkingWebSocket.subscribeStatus((connected) => {
      setWsConnected(connected);
    });

    const unsubMessages = parkingWebSocket.subscribe((msg) => {
      if (!msg || msg.type !== 'SLOT_UPDATE') return;

      // 1. Update individual slot status in real-time
      setSlotsByLocation((prev) => {
        const locSlots = prev[msg.locationId];
        if (!locSlots) return prev;
        const next = locSlots.map((s) => {
          if (s.slotNumber === msg.slotNumber || (msg.slotId && s.id === msg.slotId)) {
            return { ...s, status: msg.status?.toLowerCase(), vehicle: msg.vehicle };
          }
          return s;
        });
        return { ...prev, [msg.locationId]: next };
      });

      // 2. Update parking lot aggregate counts in real-time
      if (msg.totalSlots !== undefined) {
        setLocations((prev) =>
          prev.map((loc) => {
            if (loc.id === msg.locationId) {
              return {
                ...loc,
                totalSlots: msg.totalSlots,
                availableSlots: msg.availableSlots,
                occupiedSlots: msg.occupiedSlots,
                reservedSlots: msg.reservedSlots,
                occupancyPercentage: msg.occupancyPercentage,
              };
            }
            return loc;
          })
        );
      }
    });

    return () => {
      unsubStatus();
      unsubMessages();
    };
  }, []);

  // --- Phase 1–3: Fetch all data from Spring Boot REST API ---
  const refreshBackendData = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    const userEmail = getUserEmail();
    const userRole = getUserRole();

    try {
      // 1. Parking lots — public endpoint, always fetch
      const lotsData = await api.getLocations();
      if (Array.isArray(lotsData) && lotsData.length > 0) {
        setLocations(lotsData);
        setBackendConnected(true);
      }

      if (token) {
        // 2. Bookings — fetch per user (USER role) or all (ADMIN role)
        try {
          if (userRole === 'admin') {
            const allBookings = await api.getReservations();
            if (Array.isArray(allBookings)) setBookings(allBookings);
          } else if (userEmail) {
            const userBookings = await api.getUserReservations(userEmail);
            if (Array.isArray(userBookings)) setBookings(userBookings);
          }
        } catch (err) {
          console.warn('Bookings fetch error:', err.message);
        }

        // 3. Users — admin only
        if (userRole === 'admin') {
          try {
            const usersData = await api.getUsers();
            if (Array.isArray(usersData)) setRegisteredUsers(usersData);
          } catch (err) {
            console.warn('Users fetch error (non-admin user):', err.message);
          }
        }
      } else {
        // Not logged in: clear bookings to empty
        setBookings([]);
        setRegisteredUsers([]);
      }

      setBackendConnected(true);
    } catch (err) {
      console.warn('Backend unreachable:', err.message);
      setBackendConnected(false);
      // Keep whatever was in state — do NOT fall back to mock data
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount + re-fetch whenever auth state changes
  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // Re-fetch bookings any time the JWT token changes (login/logout)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'smart_park_token' || e.key === 'smart_park_user') {
        refreshBackendData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshBackendData]);

  // --- Slots: lazy-load from API per location ---
  const getLocationById = (id) => {
    return locationsRef.current.find((loc) => loc.id === id) || locationsRef.current[0];
  };

  const getSlotsForLocation = (locationId) => {
    if (!slotsByLocation[locationId]) {
      // Kick off async fetch, return empty array while loading
      api.getSlotsForLocation(locationId)
        .then((slots) => {
          if (Array.isArray(slots) && slots.length > 0) {
            setSlotsByLocation((prev) => ({ ...prev, [locationId]: slots }));
          } else {
            // Fallback: generate placeholder grid
            setSlotsByLocation((prev) => ({
              ...prev,
              [locationId]: generateSlotsForLocation(locationId, 24),
            }));
          }
        })
        .catch(() => {
          setSlotsByLocation((prev) => ({
            ...prev,
            [locationId]: generateSlotsForLocation(locationId, 24),
          }));
        });
      return [];
    }
    return slotsByLocation[locationId];
  };

  const loadSlots = async (locationId) => {
    try {
      const slots = await api.getSlotsForLocation(locationId);
      if (Array.isArray(slots) && slots.length > 0) {
        setSlotsByLocation((prev) => ({ ...prev, [locationId]: slots }));
        return slots;
      }
    } catch (e) {
      console.warn('loadSlots failed:', e.message);
    }
    return slotsByLocation[locationId] || generateSlotsForLocation(locationId, 24);
  };

  // --- Phase 2: Slot status override (admin/manual) ---
  const updateSlotStatus = async (locationId, slotId, newStatus) => {
    try {
      await api.updateSlotStatus(slotId, newStatus);
    } catch (err) {
      console.warn('updateSlotStatus API error:', err.message);
    }
    // Optimistic local update (WebSocket will confirm the real value)
    setSlotsByLocation((prev) => {
      const currentSlots = prev[locationId] || [];
      const next = currentSlots.map((s) =>
        s.id === slotId || s.slotNumber === slotId
          ? { ...s, status: newStatus.toLowerCase() }
          : s
      );
      return { ...prev, [locationId]: next };
    });
  };

  // --- Phase 2: Create Reservation + Phase 4: QR Generated ---
  const createReservation = async ({
    locationId,
    slotNumber,
    date,
    startTime,
    endTime,
    vehicleNumber,
    hours = 2,
    userName,
    userEmail,
  }) => {
    // Use authenticated user info if not provided
    const resolvedUserName = userName || JSON.parse(localStorage.getItem('smart_park_user') || '{}')?.name || 'Driver';
    const resolvedUserEmail = userEmail || getUserEmail() || 'driver@smartpark.io';

    const payload = {
      locationId,
      slotNumber,
      date,
      startTime,
      endTime,
      vehicleNumber,
      hours: Number(hours),
      userName: resolvedUserName,
      userEmail: resolvedUserEmail,
    };

    // Always try real API first
    const newBooking = await api.createReservation(payload);

    // Update local state immediately
    setBookings((prev) => [newBooking, ...prev]);

    // Mark slot as reserved in local grid
    setSlotsByLocation((prev) => {
      const locSlots = prev[locationId] || [];
      const next = locSlots.map((s) =>
        s.slotNumber === slotNumber ? { ...s, status: 'reserved', vehicle: vehicleNumber } : s
      );
      return { ...prev, [locationId]: next };
    });

    // Update location available count optimistically
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === locationId) {
          return {
            ...loc,
            availableSlots: Math.max(0, (loc.availableSlots || 1) - 1),
            reservedSlots: (loc.reservedSlots || 0) + 1,
          };
        }
        return loc;
      })
    );

    return newBooking;
  };

  // --- Phase 2 + 5: Cancel Reservation ---
  const cancelReservation = async (bookingId) => {
    try {
      await api.cancelReservation(bookingId);
    } catch (err) {
      console.warn('cancelReservation API error:', err.message);
      throw err; // surface error to UI
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  // --- Phase 4: QR Verification ---
  const verifyQrTicket = async (ticketId) => {
    try {
      return await api.verifyQrTicket(ticketId);
    } catch (err) {
      // Local fallback for offline demo
      const booking = bookings.find(
        (b) => b.id?.toUpperCase() === ticketId?.trim()?.toUpperCase()
      );
      if (!booking) {
        return {
          found: false,
          isValid: false,
          verificationStatus: 'INVALID',
          error: 'No reservation found matching this QR code / Booking ID.',
        };
      }
      const isCancelled = booking.status === 'Cancelled';
      const isUsed = Boolean(booking.isUsed);
      const isValid = !isCancelled && !isUsed && booking.status === 'Confirmed';
      const reason = isCancelled ? 'CANCELLED' : isUsed ? 'ALREADY_USED' : isValid ? 'VALID' : 'EXPIRED';
      return {
        found: true,
        booking,
        isValid,
        verificationStatus: reason,
        message: isValid
          ? '✓ QR Code Verified. Valid Parking Permit.'
          : isCancelled
          ? 'Access Denied: Ticket is marked as Cancelled.'
          : isUsed
          ? 'Access Denied: QR code already used for entry.'
          : `Ticket status is ${booking.status}. Access Denied.`,
      };
    }
  };

  // --- Phase 4: Admit Vehicle (Slot → OCCUPIED + WebSocket broadcast) ---
  const admitVehicle = async (bookingId) => {
    const result = await api.admitVehicle(bookingId);
    setBookings((prev) =>
      prev.map((b) =>
        b.id?.toUpperCase() === bookingId?.toUpperCase()
          ? { ...b, isUsed: true, status: 'Confirmed' }
          : b
      )
    );
    return result;
  };

  // --- Phase 5: Parking Lot CRUD ---
  const addLocation = async (newLoc) => {
    const created = await api.createLocation(newLoc);
    setLocations((prev) => [created, ...prev]);
    return created;
  };

  const updateLocation = async (id, updatedData) => {
    const updated = await api.updateLocation(id, updatedData);
    setLocations((prev) => prev.map((loc) => (loc.id === id ? updated : loc)));
    return updated;
  };

  const deleteLocation = async (id) => {
    await api.deleteLocation(id);
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    setSlotsByLocation((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // --- Phase 5: Parking Slot CRUD ---
  const createSlot = async (slotData) => {
    const created = await api.createSlot(slotData);
    const locId = slotData.locationId || slotData.parkingLotId;
    setSlotsByLocation((prev) => ({
      ...prev,
      [locId]: [...(prev[locId] || []), created],
    }));
    // Refresh lot counts
    setTimeout(refreshBackendData, 300);
    return created;
  };

  const updateSlot = async (id, slotData) => {
    const updated = await api.updateSlot(id, slotData);
    const locId = slotData.locationId || updated.parkingLotId;
    setSlotsByLocation((prev) => {
      const slots = prev[locId] || [];
      return { ...prev, [locId]: slots.map((s) => (s.id === id ? updated : s)) };
    });
    setTimeout(refreshBackendData, 300);
    return updated;
  };

  const deleteSlot = async (id, locationId) => {
    await api.deleteSlot(id);
    if (locationId) {
      setSlotsByLocation((prev) => ({
        ...prev,
        [locationId]: (prev[locationId] || []).filter((s) => s.id !== id),
      }));
    }
    setTimeout(refreshBackendData, 300);
  };

  return (
    <ParkingContext.Provider
      value={{
        // State
        locations,
        bookings,
        registeredUsers,
        backendConnected,
        wsConnected,
        loading,
        // Getters
        getLocationById,
        getSlotsForLocation,
        loadSlots,
        // Phase 2
        updateSlotStatus,
        createReservation,
        cancelReservation,
        // Phase 4
        verifyQrTicket,
        admitVehicle,
        // Phase 5 — Lots
        addLocation,
        updateLocation,
        deleteLocation,
        // Phase 5 — Slots
        createSlot,
        updateSlot,
        deleteSlot,
        // Utility
        refreshBackendData,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
