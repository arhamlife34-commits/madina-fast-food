"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function WebsiteStatusGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [websiteActive, setWebsiteActive] =
    useState(true);

  const [checking, setChecking] =
    useState(true);

  async function checkWebsiteStatus() {
    const { data, error } = await supabase
      .from("settings")
      .select("website_active")
      .eq("id", 1)
      .single();

    if (error) {
      console.error(
        "Website status error:",
        error
      );

      setWebsiteActive(true);
      setChecking(false);
      return;
    }

    setWebsiteActive(
      data?.website_active !== false
    );

    setChecking(false);
  }

  useEffect(() => {
    checkWebsiteStatus();

    const channel = supabase
      .channel("website-status-live")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "settings",
          filter: "id=eq.1",
        },
        (payload) => {
          const newValue =
            payload.new?.website_active;

          setWebsiteActive(
            newValue !== false
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isAdminArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");

  if (
    checking ||
    websiteActive ||
    isAdminArea
  ) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[999999] flex min-h-screen items-center justify-center overflow-hidden bg-[#071812] p-5">

      <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />

      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-[#c9a35b]/30 bg-white/10 p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-12">

        <div className="absolute inset-0 bg-white/[0.04]" />

        <div className="relative">

          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/40 bg-red-500/10 shadow-[0_0_35px_rgba(239,68,68,0.18)]">

            <span className="text-5xl leading-none text-red-500">
              ×
            </span>

          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Sorry! We&apos;re Currently Closed
          </h1>

          <p className="mx-auto mt-5 max-w-[440px] text-base leading-7 text-white/75 sm:text-lg">
            We&apos;re not operational at the
            moment. Our website is temporarily
            unavailable while we make some
            updates.
          </p>

          <p className="mt-5 text-sm font-semibold text-[#f0ca72]">
            Please check back soon.
          </p>

          <div className="mx-auto mt-8 h-px w-24 bg-[#c9a35b]/50" />

          <p className="mt-5 text-xs text-white/45">
            We apologize for the inconvenience.
            Thank you for your patience.
          </p>

        </div>

      </div>
    </div>
  );
}