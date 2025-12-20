import { Footer, Navbar } from "@/src/components/layout";
import React from "react";
import ProfileView from "./section/profile.view";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProfileView />
      <Footer />
    </div>
  );
}
