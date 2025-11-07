"use client"; // This tells Next.js it's a client component
import  { useEffect, useState } from "react";
import { Monitor, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Navbar = () => {
  const [admissionCount, setAdmissionCount] = useState<number | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userInitial, setUserInitial] = useState<string>('A');
  const router = useRouter();

  useEffect(() => {
    // Listen to authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        setUserInitial(user.email.charAt(0).toUpperCase());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounts = () => {
      // Fetch total admissions count
      fetch("http://localhost:5000/admissions")
        .then((res) => res.json())
        .then((data) => {
          let admissionsArray = [];
          if (Array.isArray(data)) {
            admissionsArray = data;
          } else if (Array.isArray(data.data)) {
            admissionsArray = data.data;
          }
          setAdmissionCount(admissionsArray.length);
        })
        .catch(() => setAdmissionCount(null));

      // Fetch student count from localStorage (set by newstudenttable)
      if (typeof window !== 'undefined') {
        const count = localStorage.getItem('currentStudentCount');
        setStudentCount(count ? parseInt(count, 10) : null);
      }
    };

    fetchCounts();
    window.addEventListener('studentCountChanged', fetchCounts);
    return () => {
      window.removeEventListener('studentCountChanged', fetchCounts);
    };
  }, []);

  const handleProfileClick = () => {
    router.push('/admin/profile');
  };
  
  return (
    <div className=" ">
      <div className="md:flex sm:px-0 px-5 container mx-auto md:justify-between xl:mb-6 grid sm:mt-0 md:gap-0 gap-3  xl:space-y-0">
        <div>
          <h1 className="2xl:text-3xl xl:text-[26px] text-xl font-bold">
            Welcome Back Admin 👋🏼
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-600">{userEmail || 'admin@furniture.com'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button 
            onClick={handleProfileClick}
            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer"
            title="View Profile"
          >
            <span className="text-white font-semibold text-lg">{userInitial}</span>
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default Navbar;
