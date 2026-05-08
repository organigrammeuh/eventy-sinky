"use client";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import {SessionsPage} from "@/components/SessionPage";

export default function Home() {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <SessionsPage/>
    </div>
  );
}
