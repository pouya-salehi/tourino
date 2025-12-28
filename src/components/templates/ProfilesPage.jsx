"use client";
import { useEffect, useState, useCallback } from "react";
import ProfileFilter from "../modules/profile/ProfileFilter";
import ProfileCards from "../modules/profile/ProfileCards";
import HoverCardSkeleton from "../skeletons/HoverCardSkeleton";
import { toast } from "../toast";

function ProfilesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourDetails, setTourDetails] = useState([]);
  
  const fetchUserProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchTourDetails = async () => {
    try {
      const response = await fetch("/api/tours");
      const result = await response.json();

      if (result.success) {
        setTourDetails(result.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  
  useEffect(() => {
    fetchUserProfiles();
    fetchTourDetails();
  }, [fetchUserProfiles]);

  // ✅ حالت لودینگ با اسکلتون
  if (loading) {
    return (
      <div className="mt-16 p-4">
        <ProfileFilter />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <HoverCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 p-4">
      <ProfileFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {users.map((user) => (
          <ProfileCards key={user.id} user={user} tour={tourDetails} />
        ))}
      </div>
    </div>
  );
}

export default ProfilesPage;