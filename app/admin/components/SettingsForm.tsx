"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SettingsForm() {
  const [loading, setLoading] = useState(false);

  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");

  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");

  const [heroTitle, setHeroTitle] = useState("");
const [heroSubtitle, setHeroSubtitle] = useState("");
const [heroImage, setHeroImage] = useState("");
const [orderButtonText, setOrderButtonText] = useState("");
const [callButtonText, setCallButtonText] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    if (!data) return;

    setRestaurantName(data.restaurant_name || "");
    setPhone(data.phone || "");
    setWhatsapp(data.whatsapp || "");
    setAddress(data.address || "");

    setDeliveryCharges(data.delivery_charges || 0);

    setOpeningTime(data.opening_time || "");
    setClosingTime(data.closing_time || "");

    setFacebook(data.facebook || "");
    setInstagram(data.instagram || "");
    setTiktok(data.tiktok || "");
    setHeroTitle(data.hero_title || "");
setHeroSubtitle(data.hero_subtitle || "");
setHeroImage(data.hero_image || "");
setOrderButtonText(data.order_button_text || "");
setCallButtonText(data.call_button_text || "");
  }

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("settings")
      .update({
        restaurant_name: restaurantName,
        phone,
        whatsapp,
        address,
        delivery_charges: deliveryCharges,
        opening_time: openingTime,
        closing_time: closingTime,
        facebook,
        instagram,
        tiktok,
        hero_title: heroTitle,
hero_subtitle: heroSubtitle,
hero_image: heroImage,
order_button_text: orderButtonText,
call_button_text: callButtonText,
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert("Update Failed");
      console.error(error);
      return;
    }

    alert("Settings Updated Successfully");
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Website Settings
      </h2>
<div className="grid md:grid-cols-2 gap-5">

  <input
    type="text"
    placeholder="Restaurant Name"
    value={restaurantName}
    onChange={(e) => setRestaurantName(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="WhatsApp Number"
    value={whatsapp}
    onChange={(e) => setWhatsapp(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="number"
    placeholder="Delivery Charges"
    value={deliveryCharges}
    onChange={(e) =>
      setDeliveryCharges(Number(e.target.value))
    }
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Opening Time"
    value={openingTime}
    onChange={(e) => setOpeningTime(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Closing Time"
    value={closingTime}
    onChange={(e) => setClosingTime(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Facebook Link"
    value={facebook}
    onChange={(e) => setFacebook(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="Instagram Link"
    value={instagram}
    onChange={(e) => setInstagram(e.target.value)}
    className="border rounded-xl p-4"
  />

  <input
    type="text"
    placeholder="TikTok Link"
    value={tiktok}
    onChange={(e) => setTiktok(e.target.value)}
    className="border rounded-xl p-4"
  />
<input
  type="text"
  placeholder="Hero Title"
  value={heroTitle}
  onChange={(e) => setHeroTitle(e.target.value)}
  className="border rounded-xl p-4"
/>

<input
  type="text"
  placeholder="Hero Subtitle"
  value={heroSubtitle}
  onChange={(e) => setHeroSubtitle(e.target.value)}
  className="border rounded-xl p-4"
/>

<input
  type="text"
  placeholder="Hero Image URL"
  value={heroImage}
  onChange={(e) => setHeroImage(e.target.value)}
  className="border rounded-xl p-4"
/>

<input
  type="text"
  placeholder="Order Button Text"
  value={orderButtonText}
  onChange={(e) => setOrderButtonText(e.target.value)}
  className="border rounded-xl p-4"
/>

<input
  type="text"
  placeholder="Call Button Text"
  value={callButtonText}
  onChange={(e) => setCallButtonText(e.target.value)}
  className="border rounded-xl p-4"
/>
</div>
<button
  onClick={saveSettings}
  disabled={loading}
  className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold"
>
  {loading ? "Saving..." : "Save Settings"}
</button>
    </div>
  );
}