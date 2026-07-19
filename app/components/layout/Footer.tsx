"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
export default function Footer(){
const [settings, setSettings] = useState<any>(null);

useEffect(() => {
  fetchSettings();
}, []);

async function fetchSettings() {
  const { data } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (data) {
    setSettings(data);
  }
}
return(

<footer className="bg-black text-white py-10">

<div className="max-w-7xl mx-auto px-6 text-center">

<h2 className="text-3xl font-bold">

{settings?.restaurant_name || "Madina Fast Food"}

</h2>

<p className="mt-4 text-gray-400">

Fresh Food • Fast Delivery • Premium Taste

</p>
<div className="mt-6 space-y-2 text-gray-300">

  <p>
    📞 {settings?.phone}
  </p>

  <p>
    💬 WhatsApp: {settings?.whatsapp}
  </p>

  <p>
    📍 {settings?.address}
  </p>

</div>
<div className="flex justify-center gap-6 mt-6">

  <a
    href={settings?.facebook}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-500"
  >
    Facebook
  </a>

  <a
    href={settings?.instagram}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-500"
  >
    Instagram
  </a>

  <a
    href={settings?.tiktok}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-red-500"
  >
    TikTok
  </a>

</div>
<p className="mt-8 text-sm text-gray-500">

© 2026 {settings?.restaurant_name || "Madina Fast Food"}
</p>

</div>

</footer>

);

}